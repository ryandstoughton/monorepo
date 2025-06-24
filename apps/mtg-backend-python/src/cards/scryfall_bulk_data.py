from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
import logging
import aiohttp
import httpx
import ijson
from sqlalchemy.dialects.postgresql import insert
from sqlmodel import Session

from database.database import get_session
from models.scryfall_card import ScryfallCard, ScryfallCardCreate


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


scheduler: AsyncIOScheduler = AsyncIOScheduler()


async def stream_json_objects(url: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            # TODO: Document the ijson + aiohttp response.content interaction in a notebook.
            async for obj in ijson.items_async(
                response.content, "item", use_float=True
            ):
                yield obj


async def scryfall_bulk_data() -> None:
    cards: list[ScryfallCardCreate] = []
    with get_session() as session:
        with httpx.Client() as client:
            default_cards = client.get(
                "https://api.scryfall.com/bulk-data/default-cards"
            )
            download_uri = default_cards.json().get("download_uri")

            if download_uri is None:
                logger.error("Download URI for default_cards not found")
                return

        async for obj in stream_json_objects(download_uri):
            cards.append(ScryfallCardCreate(**obj, scryfall_id=obj["id"]))

            if len(cards) % 20000 == 0 and len(cards) != 0:
                logger.info("Upserting batch of scryfall cards")
                await upsert_cards(session=session, cards=cards)
                cards.clear()

        if cards:
            logger.info("Upserting final batch of scryfall cards")
            await upsert_cards(session=session, cards=cards)

    logger.info("Completed scryfall_bulk_data")


async def upsert_cards(session: Session, cards: list[ScryfallCardCreate]):
    stmt = insert(ScryfallCard).values(
        [{k: v for k, v in card.model_dump().items() if k != "id"} for card in cards]
    )
    upsert_stmt = stmt.on_conflict_do_update(
        index_elements=["scryfall_id"],
        # TODO: Is there a shorthand here? Also, the __table__ access seems strange. Investigate.
        set_={
            c: getattr(stmt.excluded, c)  # type: ignore
            for c in ScryfallCard.__table__.columns.keys()  # type: ignore[attr-defined]
            if c != "id" and c != "scryfall_id"
        },
    )

    # TODO: Investigate if there are better alternatives
    session.execute(upsert_stmt)
    session.commit()


def scryfall_bulk_data_scheduler():
    scheduler.add_job(
        func=scryfall_bulk_data,
        trigger=IntervalTrigger(minutes=5),
        id="scryfall_bulk_data",
        name="scryfall_bulk_data",
        replace_existing=True,
    )
    scheduler.start()

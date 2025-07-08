import logging
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlmodel import Session

from cards.router import CreateCard
from database.database import get_session
from models.card import Card
from models.pack import Pack


router = APIRouter(prefix="/packs", tags=["packs"])

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class CreatePack(BaseModel):
    set_id: str
    cards: list[CreateCard] = Field(default=[])


@router.post("/", response_model=Pack)
async def create_pack(pack: CreatePack, session: Session = Depends(get_session)):
    new_pack = Pack.model_validate(pack.model_dump(exclude={"cards"}))
    session.add(new_pack)
    session.commit()
    session.refresh(new_pack)

    for card_data in pack.cards:
        card = Card.model_validate({**card_data.model_dump(), "pack_id": new_pack.id})
        session.add(card)

    session.commit()
    session.refresh(new_pack)

    return new_pack

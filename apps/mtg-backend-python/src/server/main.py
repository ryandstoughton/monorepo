from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from cards.router import router as cards_router
from cards.scryfall_bulk_data import scryfall_bulk_data_scheduler
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# TODO: Is there a more elegant way to initialize _all_ schedulers?
@asynccontextmanager
async def lifespan(app: FastAPI):
    scryfall_bulk_data_scheduler()
    try:
        yield
    finally:
        logger.error("Failed to initialize schedulers")


app = FastAPI(lifespan=lifespan)
app.include_router(cards_router)


def main():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)

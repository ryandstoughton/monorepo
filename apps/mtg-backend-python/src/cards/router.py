from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session

from database.database import get_session
from models.card import Card


router = APIRouter(prefix="/cards", tags=["cards"])


class CreateCard(BaseModel):
    scryfall_id: str
    set_id: str


@router.post("/", response_model=Card)
async def create_card(create: CreateCard, session: Session = Depends(get_session)):
    card = Card.model_validate(**create.model_dump())
    session.add(card)
    session.commit()
    session.refresh(card)

    return card

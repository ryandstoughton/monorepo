from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session

from database.database import get_session
from models.scryfall_card import ScryfallCard, ScryfallCardCreate
from sqlalchemy.exc import IntegrityError


router = APIRouter(prefix="/cards", tags=["cards"])


class CreateCard(BaseModel):
    scryfall_id: str
    name: str
    mana_cost: Optional[str] = None


@router.post("/", response_model=ScryfallCard)
async def create_card(create: CreateCard, session: Session = Depends(get_session)):
    try:
        card = ScryfallCard.model_validate(ScryfallCardCreate(**create.model_dump()))
        session.add(card)
        session.commit()
        session.refresh(card)

        return card
    except IntegrityError:
        raise HTTPException(status_code=400, detail="SQLAlchemy - Card already exists")

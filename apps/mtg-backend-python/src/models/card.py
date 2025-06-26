from typing import Optional
from sqlmodel import Field, SQLModel
import sqlalchemy as sa


class CardBase(SQLModel):
    scryfall_id: str = Field(sa_column=sa.Column(sa.String(), nullable=False))


class Card(CardBase, table=True):
    """
    Represents an **instance** of a card.

    Looking for card information? Check `ScryfallCard`.
    """

    __tablename__ = "card"  # type: ignore

    id: Optional[int] = Field(
        default=None,
        sa_column=sa.Column(sa.Integer(), primary_key=True, nullable=False),
    )

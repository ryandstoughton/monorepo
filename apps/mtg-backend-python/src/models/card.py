from typing import Optional
from sqlmodel import Field, ForeignKey, SQLModel
import sqlalchemy as sa


class CardBase(SQLModel):
    set_id: str = Field(sa_column=sa.Column(sa.Text(), nullable=False))

    scryfall_id: str = Field(
        sa_column=sa.Column(
            sa.String(),
            ForeignKey(
                "scryfall_card.scryfall_id",
                name="scryfall_id_fkey",
            ),
            nullable=False,
        )
    )

    pack_id: Optional[int] = Field(
        sa_column=sa.Column(
            sa.Integer(), ForeignKey("pack.id", name="pack_id_fkey"), default=None
        )
    )


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

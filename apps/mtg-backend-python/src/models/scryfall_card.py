from typing import Optional
from sqlmodel import Field, SQLModel
import sqlalchemy as sa


class ScryfallCardBase(SQLModel):
    scryfall_id: str = Field(
        sa_column=sa.Column(sa.Text(), unique=True, index=True, nullable=False)
    )
    name: str = Field(sa_column=sa.Column(sa.Text(), index=True, nullable=False))
    mana_cost: str | None = Field(sa_column=sa.Column(sa.String()))


class ScryfallCard(ScryfallCardBase, table=True):
    # TODO: Figure out why this line is complaining about types
    __tablename__ = "scryfall_card"  # type: ignore - this is valid

    id: Optional[int] = Field(
        default=None,
        sa_column=sa.Column(sa.Integer(), primary_key=True, nullable=False),
    )

class ScryfallCardCreate(ScryfallCardBase):
    pass
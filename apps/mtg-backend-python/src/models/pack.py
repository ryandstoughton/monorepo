from typing import Optional
from sqlmodel import Field, SQLModel
import sqlalchemy as sa


class PackBase(SQLModel):
    set_id: str = Field(sa_column=sa.Column(sa.String(), nullable=False))


class Pack(PackBase, table=True):
    """
    A collection of cards.
    """

    __tablename__ = "pack"  # type: ignore

    id: Optional[int] = Field(
        default=None,
        sa_column=sa.Column(sa.Integer(), primary_key=True, nullable=False),
    )

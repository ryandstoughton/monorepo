from sqlmodel import Field, SQLModel


class ScryfallCard(SQLModel, table=True):
    id: int = Field(primary_key=True)
    scryfall_id: str = Field(unique=True, index=True)
    name: str = Field(index=True)
    mana_cost: str | None = Field(nullable=True)

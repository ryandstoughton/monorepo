from typing import Optional, Dict, List
from sqlmodel import Field, SQLModel
import sqlalchemy as sa


class ScryfallCardBase(SQLModel):
    scryfall_id: str = Field(
        sa_column=sa.Column(sa.String(), unique=True, index=True, nullable=False)
    )
    oracle_id: Optional[str] = Field(default=None, sa_column=sa.Column(sa.String()))
    multiverse_ids: Optional[List[int]] = Field(
        default=None, sa_column=sa.Column(sa.JSON)
    )
    mtgo_id: Optional[int] = Field(default=None, sa_column=sa.Column(sa.Integer()))
    arena_id: Optional[int] = Field(default=None, sa_column=sa.Column(sa.Integer()))
    tcgplayer_id: Optional[int] = Field(default=None, sa_column=sa.Column(sa.Integer()))
    name: str = Field(sa_column=sa.Column(sa.String(), index=True, nullable=False))
    lang: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    released_at: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    uri: str = Field(sa_column=sa.Column(sa.Text(), nullable=False))
    scryfall_uri: str = Field(sa_column=sa.Column(sa.Text(), nullable=False))
    layout: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    highres_image: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    image_status: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    image_uris: Optional[Dict[str, str]] = Field(
        default=None, sa_column=sa.Column(sa.JSON)
    )
    mana_cost: Optional[str] = Field(default=None, sa_column=sa.Column(sa.String()))
    cmc: Optional[float] = Field(default=None, sa_column=sa.Column(sa.Float()))
    type_line: Optional[str] = Field(default=None, sa_column=sa.Column(sa.String()))
    oracle_text: Optional[str] = Field(default=None, sa_column=sa.Column(sa.Text()))
    colors: Optional[List[str]] = Field(default=None, sa_column=sa.Column(sa.JSON))
    color_identity: Optional[List[str]] = Field(
        default=None, sa_column=sa.Column(sa.JSON)
    )
    keywords: Optional[List[str]] = Field(default=None, sa_column=sa.Column(sa.JSON))
    produced_mana: Optional[List[str]] = Field(
        default=None, sa_column=sa.Column(sa.JSON)
    )
    legalities: Optional[Dict[str, str]] = Field(
        default=None, sa_column=sa.Column(sa.JSON)
    )
    games: Optional[List[str]] = Field(default=None, sa_column=sa.Column(sa.JSON))
    reserved: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    game_changer: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    foil: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    nonfoil: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    finishes: List[str] = Field(sa_column=sa.Column(sa.JSON, nullable=False))
    oversized: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    promo: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    reprint: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    variation: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    set_id: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    set: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    set_name: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    set_type: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    set_uri: str = Field(sa_column=sa.Column(sa.Text(), nullable=False))
    set_search_uri: str = Field(sa_column=sa.Column(sa.Text(), nullable=False))
    scryfall_set_uri: str = Field(sa_column=sa.Column(sa.Text(), nullable=False))
    rulings_uri: str = Field(sa_column=sa.Column(sa.Text(), nullable=False))
    prints_search_uri: str = Field(sa_column=sa.Column(sa.Text(), nullable=False))
    collector_number: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    digital: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    rarity: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    card_back_id: Optional[str] = Field(default=None, sa_column=sa.Column(sa.String()))
    artist: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    artist_ids: Optional[List[str]] = Field(default=None, sa_column=sa.Column(sa.JSON))
    illustration_id: Optional[str] = Field(
        default=None, sa_column=sa.Column(sa.String())
    )
    border_color: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    frame: str = Field(sa_column=sa.Column(sa.String(), nullable=False))
    full_art: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    textless: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    booster: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    story_spotlight: bool = Field(sa_column=sa.Column(sa.Boolean(), nullable=False))
    prices: Optional[Dict[str, Optional[str]]] = Field(
        default=None, sa_column=sa.Column(sa.JSON)
    )
    related_uris: Optional[Dict[str, str]] = Field(
        default=None, sa_column=sa.Column(sa.JSON)
    )
    purchase_uris: Optional[Dict[str, str]] = Field(
        default=None, sa_column=sa.Column(sa.JSON)
    )


class ScryfallCard(ScryfallCardBase, table=True, table_name="scryfall_card"):
    __tablename__ = "scryfall_card"  # type: ignore - Known SQLModel issue type checking `__tablename__`

    id: Optional[int] = Field(
        default=None,
        sa_column=sa.Column(sa.Integer(), primary_key=True, nullable=False),
    )

class ScryfallCardCreate(ScryfallCardBase):
    pass
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'scryfall_card' })
export class ScryfallCardEntity {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  scryfallId!: string;

  @Property({ nullable: true })
  oracleId!: string;

  @Property({ type: 'json', nullable: true })
  multiverseIds?: number[];

  @Property({ nullable: true })
  mtgoId?: number;

  @Property({ nullable: true })
  arenaId?: number;

  @Property({ nullable: true })
  tcgplayerId?: number;

  @Property()
  name!: string;

  @Property()
  lang!: string;

  @Property()
  releasedAt!: string;

  @Property({ type: 'text' })
  uri!: string;

  @Property({ type: 'text' })
  scryfallUri!: string;

  @Property()
  layout!: string;

  @Property()
  highresImage!: boolean;

  @Property()
  imageStatus!: string;

  @Property({ type: 'json', nullable: true })
  imageUris?: Record<string, string> | null;

  @Property({ nullable: true })
  manaCost?: string | null;

  @Property({ nullable: true })
  cmc?: number | null;

  @Property({ nullable: true })
  typeLine?: string | null;

  @Property({ type: 'text', nullable: true })
  oracleText?: string | null;

  @Property({ type: 'json', nullable: true })
  colors?: string[] | null;

  @Property({ type: 'json', nullable: true })
  colorIdentity?: string[] | null;

  @Property({ type: 'json', nullable: true })
  keywords?: string[] | null;

  @Property({ type: 'json', nullable: true })
  producedMana?: string[];

  @Property({ type: 'json', nullable: true })
  legalities?: Record<string, string> | null;

  @Property({ type: 'json', nullable: true })
  games?: string[] | null;

  @Property()
  reserved!: boolean;

  @Property()
  gameChanger!: boolean;

  @Property()
  foil!: boolean;

  @Property()
  nonfoil!: boolean;

  @Property({ type: 'json' })
  finishes!: string[];

  @Property()
  oversized!: boolean;

  @Property()
  promo!: boolean;

  @Property()
  reprint!: boolean;

  @Property()
  variation!: boolean;

  @Property()
  setId!: string;

  @Property()
  set!: string;

  @Property()
  setName!: string;

  @Property()
  setType!: string;

  @Property({ type: 'text' })
  setUri!: string;

  @Property({ type: 'text' })
  setSearchUri!: string;

  @Property({ type: 'text' })
  scryfallSetUri!: string;

  @Property({ type: 'text' })
  rulingsUri!: string;

  @Property({ type: 'text' })
  printsSearchUri!: string;

  @Property()
  collectorNumber!: string;

  @Property()
  digital!: boolean;

  @Property()
  rarity!: string;

  @Property({ nullable: true })
  cardBackId?: string | null;

  @Property()
  artist!: string;

  @Property({ type: 'json', nullable: true })
  artistIds?: string[] | null;

  @Property({ nullable: true })
  illustrationId!: string;

  @Property()
  borderColor!: string;

  @Property()
  frame!: string;

  @Property()
  fullArt!: boolean;

  @Property()
  textless!: boolean;

  @Property()
  booster!: boolean;

  @Property()
  storySpotlight!: boolean;

  @Property({ type: 'json', nullable: true })
  prices?: Record<string, string | null> | null;

  @Property({ type: 'json', nullable: true })
  relatedUris?: Record<string, string> | null;

  @Property({ type: 'json', nullable: true })
  purchaseUris?: Record<string, string> | null;
}

import { Entity, OneToOne, PrimaryKey, Ref } from '@mikro-orm/core';
import { ScryfallCardEntity } from './scryfall-card.entity';

@Entity({ tableName: 'card' })
export class CardEntity {
  @PrimaryKey()
  id!: number;

  scryfallCard!: Ref<ScryfallCardEntity>;
}

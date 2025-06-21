import { Migration } from '@mikro-orm/migrations';

export class Migration20250613024447_ScryfallCardTable extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "scryfall_card" ("id" serial primary key, "scryfall_id" varchar(255) not null, "oracle_id" varchar(255) null, "multiverse_ids" jsonb null, "mtgo_id" int null, "arena_id" int null, "tcgplayer_id" int null, "name" varchar(255) not null, "lang" varchar(255) not null, "released_at" varchar(255) not null, "uri" text not null, "scryfall_uri" text not null, "layout" varchar(255) not null, "highres_image" boolean not null, "image_status" varchar(255) not null, "image_uris" jsonb null, "mana_cost" varchar(255) null, "cmc" varchar(255) null, "type_line" varchar(255) null, "oracle_text" text null, "colors" jsonb null, "color_identity" jsonb null, "keywords" jsonb null, "produced_mana" jsonb null, "legalities" jsonb null, "games" jsonb null, "reserved" boolean not null, "game_changer" boolean not null, "foil" boolean not null, "nonfoil" boolean not null, "finishes" jsonb not null, "oversized" boolean not null, "promo" boolean not null, "reprint" boolean not null, "variation" boolean not null, "set_id" varchar(255) not null, "set" varchar(255) not null, "set_name" varchar(255) not null, "set_type" varchar(255) not null, "set_uri" text not null, "set_search_uri" text not null, "scryfall_set_uri" text not null, "rulings_uri" text not null, "prints_search_uri" text not null, "collector_number" varchar(255) not null, "digital" boolean not null, "rarity" varchar(255) not null, "card_back_id" varchar(255) null, "artist" varchar(255) not null, "artist_ids" jsonb null, "illustration_id" varchar(255) null, "border_color" varchar(255) not null, "frame" varchar(255) not null, "full_art" boolean not null, "textless" boolean not null, "booster" boolean not null, "story_spotlight" boolean not null, "prices" jsonb null, "related_uris" jsonb null, "purchase_uris" jsonb null);`);
    this.addSql(`alter table "scryfall_card" add constraint "scryfall_card_scryfall_id_unique" unique ("scryfall_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "scryfall_card" cascade;`);
  }

}

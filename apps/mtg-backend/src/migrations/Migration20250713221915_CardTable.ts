import { Migration } from '@mikro-orm/migrations';

export class Migration20250713221915_CardTable extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "card" ("id" serial primary key, "scryfall_id" int not null);`);
    this.addSql(`alter table "card" add constraint "card_scryfall_id_unique" unique ("scryfall_id");`);

    this.addSql(`alter table "card" add constraint "card_scryfall_id_foreign" foreign key ("scryfall_id") references "scryfall_card" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "card" cascade;`);
  }

}

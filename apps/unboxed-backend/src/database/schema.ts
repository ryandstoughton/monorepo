import {
  jsonb,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  auth0Id: varchar('auth0_id', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
});

export const cards = pgTable('cards', {
  id: varchar('id', { length: 36 }).primaryKey(), // Scryfall UUID
  oracleId: varchar('oracle_id', { length: 36 }),
  name: varchar('name', { length: 512 }).notNull(),
  lang: varchar('lang', { length: 10 }).notNull(),
  setCode: varchar('set_code', { length: 10 }).notNull(),
  collectorNumber: varchar('collector_number', { length: 50 }).notNull(),
  rarity: varchar('rarity', { length: 20 }),
  layout: varchar('layout', { length: 50 }),
  data: jsonb('data').$type<Record<string, unknown>>().notNull(),
  syncedAt: timestamp('synced_at').notNull().defaultNow(),
});

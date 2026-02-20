import {
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  auth0Id: varchar('auth0_id', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  anonId: varchar('anon_id', { length: 36 }).unique(),
});

export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  whitePlayerToken: varchar('white_player_token', { length: 255 }).notNull(),
  blackPlayerToken: varchar('black_player_token', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull().default('waiting'),
  fen: text('fen')
    .notNull()
    .default(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    ),
  winner: varchar('winner', { length: 10 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
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

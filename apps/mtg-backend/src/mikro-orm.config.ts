import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

// Load environment variables from .env file
import 'dotenv/config';

export default defineConfig({
  extensions: [Migrator],
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST,
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: +(process.env.DATABASE_PORT ?? 5432),
  entities: ['src/**/*.entity.ts'],
  migrations: {
    tableName: 'mikro_orm_migrations',
  },
});

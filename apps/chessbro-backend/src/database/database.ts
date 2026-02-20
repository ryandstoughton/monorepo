import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export type DrizzleDB = NodePgDatabase<typeof schema>;

export const DRIZZLE_TOKEN = 'DRIZZLE_DB';

export function createDrizzlePool(databaseUrl: string): Pool {
  return new Pool({ connectionString: databaseUrl });
}

export function createDrizzleDB(pool: Pool): DrizzleDB {
  return drizzle(pool, { schema });
}

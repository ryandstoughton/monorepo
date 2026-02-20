import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from './database/schema';

async function seed(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log('Seeding database...');

  await db
    .insert(users)
    .values([
      {
        email: 'alice@example.com',
        auth0Id: 'auth0|seed-alice',
        name: 'Alice',
      },
      {
        email: 'bob@example.com',
        auth0Id: 'auth0|seed-bob',
        name: 'Bob',
      },
    ])
    .onConflictDoNothing();

  console.log('Seeding complete.');
  await pool.end();
}

seed().catch((err: unknown) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

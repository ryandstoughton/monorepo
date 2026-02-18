import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

async function runMigrations(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log('Running database migrations...');
  const path = await import('path');
  const migrationsFolder = path.join(__dirname, '..', '..', 'drizzle');
  await migrate(db, { migrationsFolder });
  console.log('Migrations complete.');

  await pool.end();
}

runMigrations().catch((err: unknown) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

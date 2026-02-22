# Chessbro Monorepo

## Database migrations (chessbro-backend)

**Never run `db:push`.** It syncs the schema directly to the database and corrupts drizzle-kit's internal migration state, causing future `db:generate` calls to produce orphaned SQL files with no journal entry or snapshot.

Always use the migration workflow:

```bash
# After changing schema.ts:
pnpm --filter chessbro-backend run db:generate  # generates SQL + snapshot + journal entry
pnpm --filter chessbro-backend run db:migrate   # applies it locally
```

Render runs `db:migrate` (via `migrate.js`) as a pre-deploy command, so all schema changes must go through migration files.

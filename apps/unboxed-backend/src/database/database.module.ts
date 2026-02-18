import { Module, OnApplicationShutdown, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { createDrizzlePool, createDrizzleDB, DRIZZLE_TOKEN } from './database';

export const PG_POOL_TOKEN = 'PG_POOL';

@Module({
  providers: [
    {
      provide: PG_POOL_TOKEN,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.getOrThrow<string>('DATABASE_URL');
        return createDrizzlePool(url);
      },
    },
    {
      provide: DRIZZLE_TOKEN,
      inject: [PG_POOL_TOKEN],
      useFactory: (pool: Pool) => createDrizzleDB(pool),
    },
  ],
  exports: [DRIZZLE_TOKEN, PG_POOL_TOKEN],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(PG_POOL_TOKEN) private readonly pool: Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}

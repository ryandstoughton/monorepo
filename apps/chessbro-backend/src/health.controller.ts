import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Pool } from 'pg';
import { PG_POOL_TOKEN } from './database/database.module';
import { Public } from './auth/public.decorator';

@Public()
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    @Inject(PG_POOL_TOKEN) private readonly pool: Pool,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      (): Promise<HealthIndicatorResult> => this.checkDatabase(),
    ]);
  }

  private async checkDatabase(): Promise<HealthIndicatorResult> {
    const client = await this.pool.connect();
    try {
      await client.query('SELECT 1');
      return { database: { status: 'up' } };
    } catch {
      return { database: { status: 'down' } };
    } finally {
      client.release();
    }
  }
}

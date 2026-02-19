import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sql } from 'drizzle-orm';
import { Readable } from 'node:stream';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { DRIZZLE_TOKEN, DrizzleDB } from '../database/database';
import { cards } from '../database/schema';

const BATCH_SIZE = 500;
const LOG_INTERVAL = 50_000;
const SCRYFALL_BULK_DATA_URL = 'https://api.scryfall.com/bulk-data';
const USER_AGENT = 'UnboxedApp/1.0 (contact@unboxed.app)';

interface BulkDataEntry {
  type: string;
  updated_at: string;
  download_uri: string;
  size: number;
}

interface BulkDataResponse {
  data: BulkDataEntry[];
}

interface ScryfallCard {
  id: string;
  oracle_id?: string;
  name: string;
  lang: string;
  set: string;
  collector_number: string;
  rarity?: string;
  layout?: string;
  [key: string]: unknown;
}

@Injectable()
export class ScryfallService {
  private readonly logger = new Logger(ScryfallService.name);
  private isSyncing = false;

  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDB) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async scheduledSync(): Promise<void> {
    this.logger.log('Running scheduled Scryfall all_cards sync');
    await this.syncAllCards();
  }

  async syncAllCards(): Promise<void> {
    if (this.isSyncing) {
      this.logger.warn('Sync already in progress, skipping');
      return;
    }

    this.isSyncing = true;
    const startTime = Date.now();
    this.logger.log('Starting Scryfall all_cards sync');

    try {
      const entry = await this.fetchBulkDataEntry('all_cards');
      const sizeMb = (entry.size / 1024 / 1024).toFixed(1);
      this.logger.log(
        `Downloading all_cards (updated: ${entry.updated_at}, ~${sizeMb}MB)`,
      );

      const response = await fetch(entry.download_uri, {
        headers: { 'User-Agent': USER_AGENT },
      });
      if (!response.ok) {
        throw new Error(`Failed to download bulk data: ${response.status}`);
      }
      if (!response.body) {
        throw new Error('Response body is null');
      }

      const nodeStream = Readable.fromWeb(
        response.body as Parameters<typeof Readable.fromWeb>[0],
      );
      const jsonStream = chain([nodeStream, parser(), streamArray()]);

      let batch: (typeof cards.$inferInsert)[] = [];
      let totalProcessed = 0;
      const syncedAt = new Date();

      for await (const { value } of jsonStream) {
        const card = value as ScryfallCard;
        batch.push({
          id: card.id,
          oracleId: card.oracle_id ?? null,
          name: card.name,
          lang: card.lang,
          setCode: card.set,
          collectorNumber: card.collector_number,
          rarity: card.rarity ?? null,
          layout: card.layout ?? null,
          data: card,
          syncedAt,
        });

        if (batch.length >= BATCH_SIZE) {
          await this.upsertBatch(batch);
          totalProcessed += batch.length;
          batch = [];

          if (totalProcessed % LOG_INTERVAL === 0) {
            this.logger.log(
              `Progress: ${totalProcessed.toLocaleString()} cards synced`,
            );
          }
        }
      }

      if (batch.length > 0) {
        await this.upsertBatch(batch);
        totalProcessed += batch.length;
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      this.logger.log(
        `Scryfall sync complete: ${totalProcessed.toLocaleString()} cards in ${duration}s`,
      );
    } catch (error) {
      this.logger.error(
        'Scryfall sync failed',
        error instanceof Error ? error.stack : String(error),
      );
    } finally {
      this.isSyncing = false;
    }
  }

  private async fetchBulkDataEntry(type: string): Promise<BulkDataEntry> {
    const response = await fetch(SCRYFALL_BULK_DATA_URL, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Scryfall bulk data index: ${response.status}`,
      );
    }

    const body = (await response.json()) as BulkDataResponse;
    const entry = body.data.find((d) => d.type === type);
    if (!entry) {
      throw new Error(`Bulk data type '${type}' not found in Scryfall index`);
    }
    return entry;
  }

  private async upsertBatch(
    batch: (typeof cards.$inferInsert)[],
  ): Promise<void> {
    await this.db
      .insert(cards)
      .values(batch)
      .onConflictDoUpdate({
        target: cards.id,
        set: {
          oracleId: sql`excluded.oracle_id`,
          name: sql`excluded.name`,
          lang: sql`excluded.lang`,
          setCode: sql`excluded.set_code`,
          collectorNumber: sql`excluded.collector_number`,
          rarity: sql`excluded.rarity`,
          layout: sql`excluded.layout`,
          data: sql`excluded.data`,
          syncedAt: sql`excluded.synced_at`,
        },
      });
  }
}

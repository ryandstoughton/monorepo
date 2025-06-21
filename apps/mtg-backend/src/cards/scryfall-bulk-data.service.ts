import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EnsureRequestContext,
  EntityData,
  EntityRepository,
  MikroORM,
} from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { ScryfallCardEntity } from 'src/cards/scryfall-card.entity';
import { ScryfallService } from 'src/scryfall/scryfall.service';
import { Scryfall } from 'src/scryfall/types';
import { pipeline } from 'stream';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';

@Injectable()
export class UpdateScryfallCardData {
  private readonly logger = new Logger(UpdateScryfallCardData.name);

  constructor(
    private readonly orm: MikroORM, // Used implicitly by @CreateRequestContext() / @EnsureRequestContext()
    private readonly scryfall: ScryfallService,
    @InjectRepository(ScryfallCardEntity)
    private readonly cardRepo: EntityRepository<ScryfallCardEntity>,
  ) {}

  @Cron(CronExpression.EVERY_WEEK, {
    timeZone: 'America/Chicago',
    waitForCompletion: true,
  })
  @EnsureRequestContext()
  async updateScryfallCardData() {
    this.logger.debug('Fetching default cards');
    const bulkData = (await this.scryfall.bulkDataInfo()).data;
    const allCardsUri = bulkData.find(
      (data) => data.type === 'all_cards',
    )?.download_uri;
    if (!allCardsUri) {
      this.logger.error('Unable to find all_cards bulk data.');
      throw new Error('Unable to find all_cards bulk data.');
    }

    this.logger.debug('Downloading bulk data');
    const response = await axios
      .create()
      .get(allCardsUri, { responseType: 'stream' });

    return new Promise<void>((resolve, reject) => {
      const BATCH_SIZE = 1000;
      let batch: ScryfallCardEntity[] = [];

      const jsonPipeline = pipeline(
        response.data,
        parser(),
        streamArray(),
        async function (err) {
          if (err) reject(err);
          else resolve();
        },
      );

      jsonPipeline.on('data', async ({ value }) => {
        // each value is a single scryfall card
        batch.push(this.mapScryfallCardToScryfallCardEntity(value));

        if (batch.length >= BATCH_SIZE) {
          jsonPipeline.pause();
          await this.cardRepo.upsertMany(batch, {
            onConflictFields: ['scryfallId'],
          });
          this.orm.em.clear();

          batch = [];
          jsonPipeline.resume();
        }
      });

      jsonPipeline.on('end', async () => {
        if (batch.length > 0) {
          await this.cardRepo.upsertMany(batch, {
            onConflictFields: ['scryfallId'],
          });

          this.orm.em.clear();
        }

        this.logger.debug(`Updated Scryfall card data`);
        resolve();
      });

      jsonPipeline.on('error', reject);
    });
  }

  private mapScryfallCardToScryfallCardEntity(
    card: Scryfall.Card,
  ): ScryfallCardEntity {
    return this.cardRepo.create({
      scryfallId: card.id,
      oracleId: card.oracle_id,
      name: card.name,
      lang: card.lang,
      releasedAt: card.released_at,
      uri: card.uri,
      scryfallUri: card.scryfall_uri,
      layout: card.layout,
      highresImage: card.highres_image,
      imageStatus: card.image_status,
      manaCost: card.mana_cost,
      cmc: card.cmc,
      typeLine: card.type_line,
      oracleText: card.oracle_text,
      colors: card.colors,
      colorIdentity: card.color_identity,
      keywords: card.keywords,
      games: card.games,
      reserved: card.reserved,
      gameChanger: card.game_changer,
      foil: card.foil,
      nonfoil: card.nonfoil,
      finishes: card.finishes,
      oversized: card.oversized,
      promo: card.promo,
      reprint: card.reprint,
      variation: card.variation,
      setId: card.set_id,
      set: card.set,
      setName: card.set_name,
      setType: card.set_type,
      setUri: card.set_uri,
      setSearchUri: card.set_search_uri,
      scryfallSetUri: card.scryfall_set_uri,
      rulingsUri: card.rulings_uri,
      printsSearchUri: card.prints_search_uri,
      collectorNumber: card.collector_number,
      digital: card.digital,
      rarity: card.rarity,
      cardBackId: card.card_back_id,
      artist: card.artist,
      artistIds: card.artist_ids,
      illustrationId: card.illustration_id,
      borderColor: card.border_color,
      frame: card.frame,
      fullArt: card.full_art,
      textless: card.textless,
      booster: card.booster,
      storySpotlight: card.story_spotlight,
    });
  }
}

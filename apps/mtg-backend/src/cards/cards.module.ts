import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ScryfallCardEntity } from 'src/cards/scryfall-card.entity';
import { UpdateScryfallCardData } from 'src/cards/scryfall-bulk-data.service';
import { ScryfallModule } from 'src/scryfall/scryfall.module';

@Module({
  imports: [ScryfallModule, MikroOrmModule.forFeature([ScryfallCardEntity])],
  providers: [UpdateScryfallCardData],
})
export class CardsModule {}

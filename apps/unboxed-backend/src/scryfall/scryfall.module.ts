import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ScryfallController } from './scryfall.controller';
import { ScryfallService } from './scryfall.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ScryfallController],
  providers: [ScryfallService],
})
export class ScryfallModule {}

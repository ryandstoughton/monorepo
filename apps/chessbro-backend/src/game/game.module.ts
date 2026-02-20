import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';

@Module({
  imports: [DatabaseModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [GameService],
})
export class GameModule {}

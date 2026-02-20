import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { GameService } from './game.service';
import { Public } from '../auth/public.decorator';

@Public()
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(@Body() body: { playerToken: string }) {
    const game = await this.gameService.createGame(body.playerToken);
    return { id: game.id };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const game = await this.gameService.getGame(id);
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }
}

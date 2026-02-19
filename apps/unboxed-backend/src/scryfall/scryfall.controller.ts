import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminApiKeyGuard } from '../auth/admin-api-key.guard';
import { ScryfallService } from './scryfall.service';

@UseGuards(AdminApiKeyGuard)
@Controller('scryfall')
export class ScryfallController {
  constructor(private readonly scryfallService: ScryfallService) {}

  @Post('sync')
  @HttpCode(HttpStatus.ACCEPTED)
  triggerSync(): { message: string } {
    void this.scryfallService.syncAllCards();
    return { message: 'Scryfall sync started' };
  }
}

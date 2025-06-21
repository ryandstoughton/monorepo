import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ScryfallService } from 'src/scryfall/scryfall.service';

/**
 * Assumes a global ConfigService.
 */
@Module({
  providers: [
    {
      provide: 'SCRYFALL_API',
      useFactory: (configService?: ConfigService) => {
        return axios.create({
          baseURL:
            configService?.get('SCRYFALL_API_URL') ??
            'https://api.scryfall.com/',
        });
      },
    },
    ScryfallService,
  ],
  exports: ['SCRYFALL_API', ScryfallService],
})
export class ScryfallModule {}

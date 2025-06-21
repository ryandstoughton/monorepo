import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Scryfall } from 'src/scryfall/types';

@Injectable()
export class ScryfallService {
  constructor(
    @Inject('SCRYFALL_API') private readonly scryfallApi: AxiosInstance,
  ) {}

  async bulkDataInfo(): Promise<Scryfall.BulkDataResponse> {
    return (await this.scryfallApi.get('bulk-data')).data;
  }

  // async downloadBulkData(download_uri: string): Promise<Scryfall.Card[]> {
  // return
  // }
}

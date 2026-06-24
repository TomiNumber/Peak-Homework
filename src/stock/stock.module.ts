import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { FinnhubService } from './finnhub/finnhub.service';

@Module({
  providers: [StockService, FinnhubService]
})
export class StockModule {}

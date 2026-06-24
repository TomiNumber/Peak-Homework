import { Module } from '@nestjs/common';

import { StockService } from './stock.service';
import { FinnhubService } from './finnhub/finnhub.service';
import { StockController } from './stock.controller';

@Module({
  providers: [StockService, FinnhubService],
  controllers: [StockController],
})
export class StockModule {}

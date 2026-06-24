import { Module } from '@nestjs/common';

import { StockService } from './stock.service';
import { FinnhubService } from './finnhub/finnhub.service';
import { StockController } from './stock.controller';
import { StockRepository } from './stock.repository';

@Module({
  providers: [StockService, FinnhubService, StockRepository],
  controllers: [StockController],
})
export class StockModule {}

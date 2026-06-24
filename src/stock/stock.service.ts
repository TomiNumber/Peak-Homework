import { Injectable, Logger } from '@nestjs/common';
import { FinnhubService } from './finnhub/finnhub.service';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(private readonly finnhubService: FinnhubService) {}
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { schedule, ScheduledTask } from 'node-cron';

import { FinnhubService } from './finnhub/finnhub.service';
import { StockRepository } from './stock.repository';

const MOVING_AVERAGE_WINDOW = 10;
const CHECK_SCHEDULE = '* * * * *';

@Injectable()
export class StockService {
  constructor(
    private readonly finnhubService: FinnhubService,
    private readonly stockRepository: StockRepository,
  ) {}
  private readonly logger = new Logger(StockService.name);
  private readonly tasks = new Map<string, ScheduledTask>();

  async getStock(symbol: string) {
    const prices = await this.stockRepository.getPrices(
      symbol,
      MOVING_AVERAGE_WINDOW,
    );

    const latest = prices[0];
    if (!latest) {
      throw new NotFoundException(
        `No price data for "${symbol}". Start periodic checks first.`,
      );
    }

    return {
      symbol,
      currentPrice: latest.price,
      lastUpdated: latest.timestamp,
      movingAverage: this.calculateMovingAverage(prices.map((p) => p.price)),
    };
  }

  async startPeriodicCheck(symbol: string) {
    if (this.tasks.has(symbol)) {
      return {
        symbol,
        status: 'already running'
      };
    }

    const task = schedule(CHECK_SCHEDULE, () => void this.checkPrice(symbol), {
      name: `stock-check-${symbol}`,
    });

    this.tasks.set(symbol, task);
    void this.checkPrice(symbol);
    return { symbol, status: 'started' };
  }

  private calculateMovingAverage(prices: number[]): number {
    const sum = prices.reduce((total, price) => total + price, 0);
    return sum / prices.length;
  }

  private async checkPrice(symbol: string): Promise<void> {
    try {
      const quote = await this.finnhubService.getQuote(symbol);
      await this.stockRepository.savePrice(symbol, quote.c, new Date());
    } catch (err) {
      this.logger.error(`Periodic check failed for "${symbol}".`, err);
    }
  }
}

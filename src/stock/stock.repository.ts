import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { StockPrice } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockRepository {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(StockRepository.name);

  async savePrice(symbol: string, price: number, timestamp: Date): Promise<StockPrice> {
    try {
      return await this.prisma.stockPrice.create({
        data: {
          symbol,
          price,
          timestamp
        },
      });
    } catch (err) {
      this.logger.error(`Failed to save price for "${symbol}".`, err);
      throw new InternalServerErrorException();
    }
  }

  async getPrices(symbol: string, number: number): Promise<StockPrice[]> {
    try {
      return await this.prisma.stockPrice.findMany({
        where: { symbol },
        orderBy: { timestamp: 'desc' },
        take: number,
      });
    } catch (err) {
      this.logger.error(`Failed to get the last: ${number} symbol: "${symbol}".`, err);
      throw new InternalServerErrorException();
    }
  }
}

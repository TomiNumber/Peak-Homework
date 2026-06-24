import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from './stock.service';
import { FinnhubService } from './finnhub/finnhub.service';
import { StockRepository } from './stock.repository';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';

describe('StockService', () => {
  let service: StockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: FinnhubService,
          useValue: { getQuote: jest.fn() },
        },
        {
          provide: StockRepository,
          useValue: { getPrices: jest.fn(), savePrice: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

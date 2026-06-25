import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { StockService } from './stock.service';
import { FinnhubService } from './finnhub/finnhub.service';
import { StockRepository } from './stock.repository';
import {
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
  jest,
} from '@jest/globals';

const finnhubServiceMock = {
  getQuote: jest.fn(),
  symbolExists: jest.fn(),
};

const stockRepositoryMock = {
  getPrices:
    jest.fn<
      (symbol: string, limit: number) => Promise<{ price: number; timestamp: Date }[]>
    >(),
  savePrice: jest.fn(),
};

describe('StockService', () => {
  let service: StockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: FinnhubService,
          useValue: finnhubServiceMock,
        },
        {
          provide: StockRepository,
          useValue: stockRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getStock returns the latest price and moving average', async () => {
    const timestamp = new Date();
    stockRepositoryMock.getPrices.mockResolvedValue([
      { price: 10, timestamp },
      { price: 20, timestamp },
    ]);

    const result = await service.getStock('AAPL');
    expect(result).toEqual({
      symbol: 'AAPL',
      currentPrice: 10,
      lastUpdated: timestamp,
      movingAverage: 15,
    });
  });

  it('getStock throws NotFoundException when no price data exists', async () => {
    stockRepositoryMock.getPrices.mockResolvedValue([]);
    await expect(service.getStock('AAPL')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

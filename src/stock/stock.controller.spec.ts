import { Test, TestingModule } from '@nestjs/testing';
import {
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
  jest,
} from '@jest/globals';

import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { StockPriceResponseDto } from './dto/stock-price.response.dto';
import {
  PeriodicCheckResponseDto,
  PeriodicCheckStatus,
} from './dto/periodic-check.response.dto';

const stockServiceMock = {
  getStock: jest.fn<(symbol: string) => Promise<StockPriceResponseDto>>(),
  startPeriodicCheck:
    jest.fn<(symbol: string) => Promise<PeriodicCheckResponseDto>>(),
};

describe('StockController', () => {
  let controller: StockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [
        {
          provide: StockService,
          useValue: stockServiceMock,
        },
      ],
    }).compile();

    controller = module.get<StockController>(StockController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getStock delegates to the service', async () => {
    const response: StockPriceResponseDto = {
      symbol: 'AAPL',
      currentPrice: 100,
      lastUpdated: new Date(),
      movingAverage: 95,
    };
    stockServiceMock.getStock.mockResolvedValue(response);

    const result = await controller.getStock({ symbol: 'AAPL' });
    expect(stockServiceMock.getStock).toHaveBeenCalledWith('AAPL');
    expect(result).toBe(response);
  });

  it('startPeriodicCheck delegates to the service', async () => {
    const response: PeriodicCheckResponseDto = {
      symbol: 'AAPL',
      status: PeriodicCheckStatus.Started,
    };
    stockServiceMock.startPeriodicCheck.mockResolvedValue(response);

    const result = await controller.startPeriodicCheck({ symbol: 'AAPL' });
    expect(stockServiceMock.startPeriodicCheck).toHaveBeenCalledWith('AAPL');
    expect(result).toBe(response);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  BadGatewayException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { FinnhubService } from './finnhub.service';
import { FinnhubQuote } from './finnhub.types';

const QUOTE: FinnhubQuote = {
  c: 1,
  d: 2,
  dp: 3,
  h: 4,
  l: 5,
  o: 6,
  pc: 7,
  t: 8,
};

const configServiceMock = {
  get: jest.fn((key: string, defaultValue?: string) =>
    key === 'FINNHUB_API_KEY' ? 'test-key' : defaultValue,
  ),
};

const mockFetchResponse = (response: Partial<Response>) => {
  jest.spyOn(global, 'fetch').mockResolvedValue(response as Response);
};

describe('FinnhubService', () => {
  let service: FinnhubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinnhubService,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<FinnhubService>(FinnhubService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('successful response', async () => {
    mockFetchResponse({
      ok: true,
      json: async () => QUOTE,
    });

    const result = await service.getQuote('AAPL');
    expect(result).toEqual(QUOTE);
  });

  it('throws UnauthorizedException on an auth error (401)', async () => {
    mockFetchResponse({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ error: 'Unauthorized' }),
    });

    await expect(service.getQuote('AAPL')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('throws BadGatewayException on an error (502)', async () => {
    mockFetchResponse({
      ok: false,
      status: 502,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'Happy dog' }),
    });

    await expect(service.getQuote('AAPL')).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });

  it('throws ServiceUnavailableException when fetch fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    await expect(service.getQuote('AAPL')).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});

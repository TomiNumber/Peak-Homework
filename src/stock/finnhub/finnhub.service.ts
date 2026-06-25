import {
  BadGatewayException,
  HttpException,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FinnhubQuote } from './finnhub.types';

const DEFAULT_BASE_URL = 'https://finnhub.io/api/v1';

@Injectable()
export class FinnhubService {
  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('FINNHUB_API_KEY', '');
    this.baseUrl = DEFAULT_BASE_URL;
  }
  private readonly logger = new Logger(FinnhubService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  async getQuote(symbol: string): Promise<FinnhubQuote> {
    const url = new URL(`${this.baseUrl}/quote`);
    url.searchParams.set('symbol', symbol);
    url.searchParams.set('token', this.apiKey);

    try {
      const response = await fetch(url.toString());
      const result = await response.json();
      if (!response.ok) {
        const reason = result.error ?? response.statusText;
        if (response.status === 401 || response.status === 403) {
          this.logger.error(`Finnhub auth failed (${response.status})`);
          throw new UnauthorizedException('Finnhub auth failed - (check API key).');
        }

        this.logger.warn(`Finnhub returned ${response.status} for "${symbol}": ${reason}`);
        throw new BadGatewayException(`Finnhub error for "${symbol}" (${response.status}): ${reason}`);
      }

      return result as FinnhubQuote;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      this.logger.error('Unexpected error fetching quote', err);
      throw new ServiceUnavailableException('Finnhub service is unavailable.');
    }
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class StockPriceResponseDto {
  @ApiProperty({ example: 'AAPL' })
  symbol!: string;

  @ApiProperty({ example: 192.34 })
  currentPrice!: number;

  @ApiProperty({ type: String, format: 'date-time' })
  lastUpdated!: Date;

  @ApiProperty({ example: 190.12 })
  movingAverage!: number;
}

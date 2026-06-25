import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SymbolParamDto {
  @ApiProperty({ example: 'AAPL', description: 'Stock ticker symbol' })
  @IsString()
  symbol!: string;
}

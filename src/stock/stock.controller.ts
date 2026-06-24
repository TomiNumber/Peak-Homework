import { Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { StockService } from './stock.service';
import { SymbolParamDto } from './dto/finnhub-symbol.dto';

@ApiTags('stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/:symbol')
  @ApiOperation({
    summary: 'Retrieve the current price, last updated time and moving average',
  })
  getStock(@Param() { symbol }: SymbolParamDto) {
    return this.stockService.getStock(symbol);
  }

  @Put('/:symbol')
  @ApiOperation({ summary: 'Start the periodic checks for a given symbol' })
  startPeriodicCheck(@Param() { symbol }: SymbolParamDto) {
    return this.stockService.startPeriodicCheck(symbol);
  }
}

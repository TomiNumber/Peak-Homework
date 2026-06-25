import { Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { StockService } from './stock.service';
import { SymbolParamDto } from './dto/finnhub-symbol.dto';
import { StockPriceResponseDto } from './dto/stock-price.response.dto';
import { PeriodicCheckResponseDto } from './dto/periodic-check.response.dto';

@ApiTags('stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/:symbol')
  @ApiOperation({
    summary: 'Retrieve the current price, last updated time and moving average',
  })
  @ApiOkResponse({ type: StockPriceResponseDto })
  getStock(@Param() { symbol }: SymbolParamDto): Promise<StockPriceResponseDto> {
    return this.stockService.getStock(symbol);
  }

  @Put('/:symbol')
  @ApiOperation({ summary: 'Start the periodic checks for a given symbol' })
  @ApiOkResponse({ type: PeriodicCheckResponseDto })
  startPeriodicCheck(
    @Param() { symbol }: SymbolParamDto,
  ): Promise<PeriodicCheckResponseDto> {
    return this.stockService.startPeriodicCheck(symbol);
  }
}

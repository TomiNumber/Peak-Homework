import { Controller, Get, NotImplementedException, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { StockService } from './stock.service';

@ApiTags('stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/:symbol')
  @ApiOperation({
    summary: 'Retrieve the current price, last updated time and moving average',
  })
  getStock() {
    throw new NotImplementedException();
  }

  @Put('/:symbol')
  @ApiOperation({ summary: 'Start the periodic checks for a given symbol' })
  startPeriodicCheck() {
    throw new NotImplementedException();
  }
}

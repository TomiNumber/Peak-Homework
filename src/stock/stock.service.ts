import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StockService {
    private readonly logger = new Logger(StockService.name);
    
    constructor() {}
}

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FinnhubService {
    private readonly logger = new Logger(FinnhubService.name);

    constructor() {}
}

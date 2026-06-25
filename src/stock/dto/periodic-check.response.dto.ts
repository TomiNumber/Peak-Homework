import { ApiProperty } from '@nestjs/swagger';

export enum PeriodicCheckStatus {
  Started = 'started',
  AlreadyRunning = 'already running',
}

export class PeriodicCheckResponseDto {
  @ApiProperty({ example: 'AAPL' })
  symbol!: string;

  @ApiProperty({ enum: PeriodicCheckStatus })
  status!: PeriodicCheckStatus;
}

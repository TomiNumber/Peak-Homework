import { IsString } from 'class-validator';

export class SymbolParamDto {
  @IsString()
  symbol!: string;
}

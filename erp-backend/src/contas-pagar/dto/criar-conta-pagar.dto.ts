import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CriarContaPagarDto {
  @IsString()
  descricao: string;

  @IsNumber()
  valor: number;

  @IsDateString()
  vencimento: string;

  @IsOptional()
  @IsBoolean()
  pago?: boolean;
}
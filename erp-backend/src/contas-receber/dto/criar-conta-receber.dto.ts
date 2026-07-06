import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CriarContaReceberDto {
  @IsString()
  descricao: string;

  @IsNumber()
  valor: number;

  @IsDateString()
  vencimento: string;

  @IsOptional()
  @IsBoolean()
  pago?: boolean;

  @IsOptional()
  @IsNumber()
  clienteId?: number;

  @IsOptional()
  @IsNumber()
  vendaId?: number;
}
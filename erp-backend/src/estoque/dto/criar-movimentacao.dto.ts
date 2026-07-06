import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { TipoMovimentacao } from '@prisma/client';

export class CriarMovimentacaoDto {
  @IsInt()
  @IsNotEmpty()
  produtoId: number;

  @IsEnum(TipoMovimentacao)
  @IsNotEmpty()
  tipo: TipoMovimentacao;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  quantidade: number;

  @IsString()
  @IsOptional()
  motivo?: string;
}
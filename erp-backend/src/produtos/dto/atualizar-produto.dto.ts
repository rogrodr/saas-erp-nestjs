import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class AtualizarProdutoDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  preco?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estoque?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estoqueMin?: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsNotEmpty } from 'class-validator';

export class CriarProdutoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNumber()
  @Min(0)
  preco: number;

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
import { IsNumber, IsArray, ValidateNested, IsOptional, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusPedido } from '@prisma/client';

export class ItemVendaDto {
  @IsNumber()
  produtoId: number;

  @IsNumber()
  @Min(1)
  quantidade: number;

  @IsNumber()
  preco: number;
}

export class CriarVendaDto {
  @IsNumber()
  @Min(0)
  total: number;

  @IsOptional()
  @IsNumber()
  clienteId?: number;

  @IsOptional()
  @IsEnum(StatusPedido)
  status?: StatusPedido;

  @IsOptional()
  @IsNumber()
  @Min(0)
  desconto?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemVendaDto)
  itens: ItemVendaDto[];
}
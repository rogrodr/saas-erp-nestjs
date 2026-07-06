import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { AcaoAuditoria } from '@prisma/client';

export class FiltroAuditoriaDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  pagina?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  limite?: number;

  @IsOptional()
  @IsString()
  entidade?: string;

  @IsOptional()
  @IsEnum(AcaoAuditoria)
  acao?: AcaoAuditoria;
}
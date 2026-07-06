import { IsString, IsOptional } from 'class-validator';

export class AtualizarEmpresaDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  cnpj?: string;
}
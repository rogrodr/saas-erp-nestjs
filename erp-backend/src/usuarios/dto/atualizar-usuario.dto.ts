import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';
import { Role, StatusUsuario } from '@prisma/client';

export class AtualizarUsuarioDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(StatusUsuario)
  status?: StatusUsuario;
}
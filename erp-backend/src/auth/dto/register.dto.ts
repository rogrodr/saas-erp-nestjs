import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional, IsInt } from 'class-validator';
import { Role, StatusUsuario } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  senha: string;

  @IsInt()
  @IsNotEmpty()
  empresaId: number;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(StatusUsuario)
  status?: StatusUsuario;
}
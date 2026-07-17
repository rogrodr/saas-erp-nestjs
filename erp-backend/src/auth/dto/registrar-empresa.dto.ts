import { IsString, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegistrarEmpresaDto {
  // Dados da empresa
  @IsString()
  @IsNotEmpty({ message: 'O nome da empresa é obrigatório' })
  nomeEmpresa: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  // Dados do usuário administrador
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;
}
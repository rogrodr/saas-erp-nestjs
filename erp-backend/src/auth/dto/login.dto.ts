import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  senha: string;
}

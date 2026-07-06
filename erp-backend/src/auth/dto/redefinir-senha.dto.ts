import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RedefinirSenhaDto {
  @IsString()
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;

  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres' })
  @IsString()
  @IsNotEmpty()
  novaSenha: string;
}
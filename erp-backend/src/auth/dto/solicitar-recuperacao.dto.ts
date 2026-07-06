import { IsEmail, IsNotEmpty } from 'class-validator';

export class SolicitarRecuperacaoDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;
}
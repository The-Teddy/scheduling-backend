import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class EmailUserDto {
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  email: string;

  @IsNotEmpty({ message: 'O campo subject não pode estar vazio.' })
  @IsEnum(['CHANGE_PASSWORD', 'CHANGE_EMAIL', 'CONFIRM_EMAIL'], {
    message:
      'Tipo de código inválido. Deve ser "CHANGE_PASSWORD", "CHANGE_EMAIL" ou "CONFIRM_EMAIL".',
  })
  subject: 'CHANGE_PASSWORD' | 'CHANGE_EMAIL' | 'CONFIRM_EMAIL';
}
export class ChangeEmailDTO {
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  email: string;
}

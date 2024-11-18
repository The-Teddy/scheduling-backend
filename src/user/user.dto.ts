import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { IsSixDigitCode } from 'src/validators/IsSixDigitCode';

export class CreateUserDTO {
  @IsString({ message: 'O nome deve ser uma string entre 3 e 100 caracteres' })
  @Length(3, 100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  readonly email: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'A senha deve ser uma string' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/, {
    message:
      'A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 letra minúscula e 1 caractere especial.',
  })
  readonly password: string;
}
export class UpdateDataUserDTO {
  @IsString({ message: 'O nome deve ser uma string entre 3 e 100 caracteres' })
  @Length(3, 100)
  name: string;

  @IsDateString(
    {},
    { message: 'A data de nascimento deve seguir o padrão ISO: YYYY-MM-DD' },
  )
  birthDate: Date;
}
export class UpdateEmailUserDTO {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsOptional()
  @IsSixDigitCode({
    message: 'O código deve ter exatamente 6 dígitos numéricos.',
  })
  readonly codeEmail?: string | null;
}
export class UpdatePasswordDTO {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'A senha deve ser uma string' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/, {
    message:
      'A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 letra minúscula e 1 caractere especial.',
  })
  readonly password: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'A senha deve ser uma string' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/, {
    message:
      'A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 letra minúscula e 1 caractere especial.',
  })
  readonly newPassword: string;
}

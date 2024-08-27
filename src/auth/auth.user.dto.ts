import { isBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { IsSixDigitCode } from 'src/validators/IsSixDigitCode';

export class AuthUserDto {
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

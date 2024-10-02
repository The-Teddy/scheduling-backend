import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail()
  readonly email: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  readonly password: string;
}
export class UpdateDataUserDTO {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsDateString()
  birthDate: Date;
}

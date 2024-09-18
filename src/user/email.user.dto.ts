import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class EmailUserDto {
  @IsEmail()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email: string;
}

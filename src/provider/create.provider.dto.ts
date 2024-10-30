import { Transform } from 'class-transformer';
import { IsString, Length, Validate } from 'class-validator';
import { IsBuffer } from 'src/validators/isBuffer.validator';
import { IsDocument } from 'src/validators/IsDocument';

export class CreateUpdateProviderDTO {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  businessName: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Validate(IsDocument)
  document: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  url: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  category: string;
}

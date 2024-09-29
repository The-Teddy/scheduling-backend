import { IsString, Length, Validate } from 'class-validator';
import { IsBuffer } from 'src/validators/isBuffer.validator';
import { IsDocument } from 'src/validators/IsDocument';

export class CreateProviderDTO {
  @IsString()
  businessName: string;

  @Validate(IsDocument)
  document: string;

  @IsString()
  url: string;

  @IsString()
  category: string;
}

import { IsString } from 'class-validator';
import { IsBuffer } from 'src/validators/isBuffer.validator';

export class CreateProviderDTO {
  @IsString()
  businessName: string;

  @IsString()
  url: string;

  @IsString()
  category: string;
}

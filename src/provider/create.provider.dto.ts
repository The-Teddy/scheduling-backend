import { IsString } from 'class-validator';
import { IsBuffer } from 'src/validators/isBuffer.validator';

export class CreateProviderDTO {
  @IsBuffer({ message: 'id inválido' })
  userId: Buffer;

  @IsString()
  businessName: string;

  @IsString()
  category: string;
}

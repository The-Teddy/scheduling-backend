import { Injectable } from '@nestjs/common';
import { ProviderService } from 'src/provider/provider.service';

@Injectable()
export class UploadService {
  constructor(private readonly providerService: ProviderService) {}

  async updateImageProvider(
    id: Buffer,
    logoPath: string | null,
    isLogo: boolean,
  ): Promise<any> {
    return this.providerService.updateImageProvider(id, logoPath, isLogo);
  }
}

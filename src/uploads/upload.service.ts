import { UserService } from 'src/user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  constructor(private readonly usersService: UserService) {}

  async updateImageUser(
    id: Buffer,
    logoPath: string | null,
    coverPath: string | null,
  ): Promise<any> {
    return this.usersService.updateImageUser(id, logoPath, coverPath);
  }
}

import { UserService } from 'src/user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  constructor(private readonly usersService: UserService) {}

  async updateLogoUser(id: Buffer, logoPath: string): Promise<any> {
    return this.usersService.updateLogoUser(id, logoPath);
  }
}

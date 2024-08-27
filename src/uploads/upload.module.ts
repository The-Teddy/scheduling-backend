import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UserModule } from 'src/user/user.module';

import { UploadService } from './upload.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [UploadController],
  providers: [UploadService, ConfigService],
})
export class UploadModule {}

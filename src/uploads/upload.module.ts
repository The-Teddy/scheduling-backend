import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UserModule } from 'src/user/user.module';

import { UploadService } from './upload.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoggingModule } from 'src/logging/logging.module';
import { UtilityModule } from 'src/utility/Utility.module';

@Module({
  imports: [UserModule, JwtModule, LoggingModule, UtilityModule],
  controllers: [UploadController],
  providers: [UploadService, ConfigService],
})
export class UploadModule {}

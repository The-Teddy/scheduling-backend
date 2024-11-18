import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UserModule } from 'src/user/user.module';

import { UploadService } from './upload.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoggingModule } from 'src/logging/logging.module';
import { UtilityModule } from 'src/utility/Utility.module';
import { ProviderModule } from 'src/provider/provider.module';

@Module({
  imports: [JwtModule, LoggingModule, UtilityModule, ProviderModule],
  controllers: [UploadController],
  providers: [UploadService, ConfigService],
})
export class UploadModule {}

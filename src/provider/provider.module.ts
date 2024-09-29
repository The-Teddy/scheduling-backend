import { Module } from '@nestjs/common';
import { providerProviders } from './provider.provider';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { DatabaseModule } from 'src/database/database.module';
import { LoggingModule } from 'src/logging/logging.module';
import { JwtModule } from '@nestjs/jwt';
import { UtilityModule } from 'src/utility/Utility.module';

@Module({
  controllers: [ProviderController],
  imports: [DatabaseModule, LoggingModule, JwtModule, UtilityModule],
  providers: [...providerProviders, ProviderService],
  exports: [],
})
export class ProviderModule {}

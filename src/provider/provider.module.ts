import { Module } from '@nestjs/common';
import { providerProviders } from './provider.provider';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';

@Module({
  controllers: [ProviderController],
  imports: [],
  providers: [...providerProviders, ProviderService],
  exports: [],
})
export class ProviderModule {}

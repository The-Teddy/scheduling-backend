import { DataSource } from 'typeorm';
import { ProviderEntity } from 'src/database/entities/providers.entity';

export const providerProviders = [
  {
    provide: 'PROVIDER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProviderEntity),
    inject: ['DATA_SOURCE'],
  },
];

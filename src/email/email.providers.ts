import { DataSource } from 'typeorm';
import { EmailEntity } from '../database/entities/email.entity';

export const emailProviders = [
  {
    provide: 'EMAIL_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EmailEntity),
    inject: ['DATA_SOURCE'],
  },
];

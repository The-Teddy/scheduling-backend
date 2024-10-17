import { FieldChangeLogEntity } from 'src/database/entities/field_change_log.entity';
import { DataSource } from 'typeorm';

export const fieldChangeLogProviders = [
  {
    provide: 'FIELD_CHANGE_LOG_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(FieldChangeLogEntity),
    inject: ['DATA_SOURCE'],
  },
];

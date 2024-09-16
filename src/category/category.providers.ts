import { DataSource } from 'typeorm';
import { CategoryEntity } from 'src/database/entities/category.entity';

export const categoryProviders = [
  {
    provide: 'CATEGORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CategoryEntity),
    inject: ['DATA_SOURCE'],
  },
];

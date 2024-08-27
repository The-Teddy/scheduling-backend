import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      try {
        const dataSource = new DataSource({
          type: configService.get<'mysql' | 'postgres'>('TYPEORM_TYPE'),
          host: configService.get<string>('TYPEORM_HOST'),
          port: configService.get<number>('TYPEORM_PORT'),
          username: configService.get<string>('TYPEORM_USER'),
          password: configService.get<string>('TYPEORM_PASSWORD'),
          database: configService.get<string>('TYPEORM_DATABASE'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE'),
        });
        await dataSource.initialize();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        return dataSource;
      } catch (error) {
        console.error('Erro ao inicializar o DataSource:', error);
        throw new Error(
          'Erro ao conectar-se ao banco de dados. Verifique as configurações.',
        );
      }
    },
  },
];

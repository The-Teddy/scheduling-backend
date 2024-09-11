import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateServicesTable1725889568977 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'services',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'providerId',
            type: 'binary',
            length: '16',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'duration',
            type: 'int',
          },
          {
            name: 'price',
            type: 'float',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
          },

          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['providerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'providers',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('services');
  }
}

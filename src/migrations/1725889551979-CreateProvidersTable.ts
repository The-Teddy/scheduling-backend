import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProvidersTable1725889551979 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'providers',
        columns: [
          {
            name: 'id',
            type: 'binary',
            length: '16',
            isPrimary: true,
          },
          {
            name: 'userId',
            type: 'binary',
            length: '16',
            isUnique: true,
          },
          {
            name: 'businessName',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'category',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'rating',
            type: 'float',
            default: 0,
          },
          {
            name: 'logo',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'cover',
            type: 'varchar',
            length: '255',
            isNullable: true,
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
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('providers');
  }
}

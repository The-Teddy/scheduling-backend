import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateConsumersTable1725889609433 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'consumers',
        columns: [
          {
            name: 'id',
            type: 'binary',
            length: '16',
            isPrimary: true,
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
            name: 'phone',
            type: 'varchar',
            length: '30',
          },
          {
            name: 'lastAppointment',
            type: 'timestamp',
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
    await queryRunner.dropTable('consumers');
  }
}

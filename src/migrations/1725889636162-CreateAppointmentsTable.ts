import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAppointmentsTable1725889636162
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appointments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
            default: `'PENDING'`,
          },
          {
            name: 'duration',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'notes',
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
          {
            name: 'consumerId',
            type: 'binary',
            length: '16',
            isNullable: true,
          },
          {
            name: 'providerId',
            type: 'binary',
            length: '16',
            isNullable: true,
          },
          {
            name: 'serviceId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'paymentId',
            type: 'int',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['consumerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'consumers',
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['providerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'providers',
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('appointments');
  }
}

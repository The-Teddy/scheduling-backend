import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAvailabilitiesTable1725889623720
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'availabilities',
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
            name: 'dayOfWeek',
            type: 'int',
          },
          {
            name: 'startTime',
            type: 'time',
          },
          {
            name: 'endTime',
            type: 'time',
          },
          {
            name: 'isRecurring',
            type: 'boolean',
            default: true,
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
    await queryRunner.dropTable('availabilities');
  }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNotificationsTable1725889598774
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'providerID',
            type: 'binary',
            length: '16',
          },
          {
            name: 'consumerId',
            type: 'binary',
            length: '16',
          },
          {
            name: 'consumerName',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'message',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'isRead',
            type: 'boolean',
            default: false,
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
            columnNames: ['providerID'],
            referencedColumnNames: ['id'],
            referencedTableName: 'providers',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications');
  }
}

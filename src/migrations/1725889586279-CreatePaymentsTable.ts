import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePaymentsTable1725889586279 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'appointmentId',
            type: 'int',
            isUnique: true,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },

          {
            name: 'paymentStatus',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'paymentMethodId',
            type: 'int',
          },
          {
            name: 'paymentMethodName',
            type: 'varchar',
            length: '100',
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payments');
  }
}

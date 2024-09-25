import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFieldChangeLog1727273552154 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'field_change_log',
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
            isUnique: true,
          },
          {
            name: 'fieldName',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'previousValue',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'newValue',
            type: 'text',
          },
          {
            name: 'automaticUpdate',
            type: 'boolean',
            default: false,
          },
          {
            name: 'userJustification',
            type: 'text',
          },
          {
            name: 'analizedBy',
            type: 'binary',
            length: '16',
            isNullable: true,
          },
          {
            name: 'analizedByName',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'adminJustification',
            type: 'text',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pendente', 'aprovado', 'rejeitado'],
            default: `'pendente'`,
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
    await queryRunner.dropTable('field_change_log');
  }
}

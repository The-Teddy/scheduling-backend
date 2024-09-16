import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCategoriesTable1726067756174 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'observation',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },

          {
            name: 'createdBy',
            type: 'binary',
            length: '16',
          },
          {
            name: 'isSuggested',
            type: 'boolean',
            default: false,
          },
          {
            name: 'approvedBy',
            type: 'binary',
            length: '16',
            isNullable: true,
          },
          {
            name: 'approvedByName',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'createdByName',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'approvalStatus',
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
    await queryRunner.dropTable('categories');
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  observation: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'binary', length: 16 })
  createdBy: Buffer;

  @Column({ type: 'boolean', default: false })
  isSuggested: boolean;

  @Column({ type: 'binary', length: 16, nullable: true })
  analizedBy: Buffer;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  analizedByName: string;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  createdByName: string;

  @Column({
    type: 'enum',
    enum: ['pendente', 'aprovado', 'rejeitado'],
    default: 'pendente',
  })
  approvalStatus: 'pendente' | 'aprovado' | 'rejeitado';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

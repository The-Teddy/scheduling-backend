import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('field_change_log')
export class FieldChangeLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'binary', length: 16 })
  providerOrUserId: Buffer;

  @Column({ type: 'varchar', length: 255 })
  fieldName: string;

  @Column({ type: 'text', nullable: true })
  previousValue: string | null;

  @Column({ type: 'text' })
  newValue: string;

  @Column({ type: 'boolean', default: false })
  automaticUpdate: boolean;

  @Column({ type: 'boolean', default: true })
  isProviderId: boolean;

  @Column({ type: 'text', nullable: true })
  userJustification: string;

  @Column({ type: 'binary', length: 16, nullable: true })
  analizedBy: Buffer | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  analizedByName: string | null;

  @Column({ type: 'text', nullable: true })
  adminJustification: string;

  @Column({
    type: 'enum',
    enum: ['pendente', 'aprovado', 'rejeitado'],
    default: 'pendente',
  })
  status: 'pendente' | 'aprovado' | 'rejeitado';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

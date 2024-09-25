import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('field_change_log')
export class FieldChangeLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'binary', length: 16, unique: true })
  providerId: Buffer;

  @Column({ type: 'varchar', length: 255 })
  fieldName: string;

  @Column({ type: 'text', nullable: true })
  previousValue: string | null;

  @Column({ type: 'text' })
  newValue: string;

  @Column({ type: 'boolean', default: false })
  automaticUpdate: boolean;

  @Column({ type: 'text' })
  userJustification: string;

  @Column({ type: 'binary', length: 16, nullable: true })
  analizedBy: Buffer | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  analizedByName: string | null;

  @Column({ type: 'text' })
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

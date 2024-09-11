import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProviderEntity } from './providers.entity';

@Entity('payment_methods')
export class PaymentMethodsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '100' })
  name: string;

  @Column({ type: 'varchar', length: '255', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => ProviderEntity, (provider) => provider.paymentMethods)
  provider: ProviderEntity;
}

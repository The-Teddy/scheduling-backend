import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { AppointmentEntity } from './appointment.entity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  appointmentId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 20 })
  paymentStatus: string;

  @Column({ type: 'int' })
  paymentMethodId: number;

  @Column({ type: 'varchar', length: 100 })
  paymentMethodName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => AppointmentEntity, (appointment) => appointment.payments)
  appointment: AppointmentEntity;
}

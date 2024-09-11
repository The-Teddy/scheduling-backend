import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ConsumerEntity } from './consumers.entity';
import { ServiceEntity } from './service.entity';
import { PaymentEntity } from './payment.entity';
import { ProviderEntity } from './providers.entity';
import { AppointmentStatus } from '../../enums/appointment.status.enum';

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ConsumerEntity, (consumer) => consumer.appointments)
  consumer: ConsumerEntity;

  @ManyToOne(() => ProviderEntity, (provider) => provider.appointments)
  provider: ProviderEntity;

  @ManyToOne(() => ServiceEntity, (service) => service.appointments)
  service: ServiceEntity;
  @OneToOne(() => PaymentEntity, (payment) => payment.appointment)
  payments: PaymentEntity;
}

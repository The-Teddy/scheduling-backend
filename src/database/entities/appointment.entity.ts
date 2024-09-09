import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ConsumerEntity } from './consumers.entity';
import { ServiceEntity } from './service.entity';
import { UserEntity } from './user.entity';
import { PaymentEntity } from './payment.entity';

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: Buffer;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ConsumerEntity, (client) => client.appointments)
  client: ConsumerEntity;

  @ManyToOne(() => UserEntity, (user) => user.appointments)
  user: UserEntity;

  @ManyToOne(() => ServiceEntity, (service) => service.appointments)
  service: ServiceEntity;
  @OneToMany(() => PaymentEntity, (payment) => payment.appointment)
  payments: PaymentEntity[];
}

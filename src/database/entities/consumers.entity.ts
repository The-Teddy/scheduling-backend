import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AppointmentEntity } from './appointment.entity';

@Entity('consumers')
export class ConsumerEntity {
  @PrimaryColumn('binary', { length: 16 })
  id: Buffer;

  @Column({ type: 'binary', length: 16 })
  providerId: Buffer;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 30 })
  phone: string;

  @Column({ type: 'timestamp', nullable: true })
  lastAppointment: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.consumer)
  appointments: AppointmentEntity[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AppointmentEntity } from './appointment.entity';
import { ProviderEntity } from './providers.entity';

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int' })
  duration: number;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ProviderEntity, (provider) => provider.services)
  provider: ProviderEntity;
  @OneToMany(() => AppointmentEntity, (appointment) => appointment.service)
  appointments: AppointmentEntity[];
}

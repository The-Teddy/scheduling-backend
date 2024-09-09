import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';
import { AppointmentEntity } from './appointment.entity';
import { AvailabilityEntity } from './availability.entity';
import { ServiceEntity } from './service.entity';
import { NotificationEntity } from './notification.entity';
import { ProviderEntity } from './providers.entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('binary', { length: 16 })
  id: Buffer;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ type: 'varchar', length: 14, nullable: true })
  cpfOrCnpj: string;

  @Column({ default: true })
  isActive: boolean;
  @Column({
    default: false,
  })
  emailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.user)
  appointments: AppointmentEntity[];
  @OneToMany(() => AvailabilityEntity, (availability) => availability.user)
  availabilities: AvailabilityEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToMany(() => ServiceEntity, (service) => service.user)
  services: ServiceEntity[];

  @OneToOne(() => ProviderEntity, (provider) => provider.user)
  provider: ProviderEntity;
}

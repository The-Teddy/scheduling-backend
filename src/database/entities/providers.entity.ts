import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity'; // Importa a entidade de usuário
import { AppointmentEntity } from './appointment.entity';
import { AvailabilityEntity } from './availability.entity';
import { NotificationEntity } from './notification.entity';
import { ServiceEntity } from './service.entity';
import { PaymentMethodsEntity } from './payment_methods.entity';

@Entity('providers')
export class ProviderEntity {
  @PrimaryColumn('binary', { length: 16 })
  id: Buffer;

  @Column('binary', { length: 16, unique: true })
  userId: Buffer;

  @Column({ type: 'varchar', length: 100 })
  businessName: string;

  @Column({ type: 'varchar', length: 18, nullable: true })
  document: string;

  @Column({ nullable: true, length: 15 })
  phone_number_commercial: string;

  @Column({ nullable: true, length: 255 })
  street: string;

  @Column({ nullable: true, length: 50 })
  number: string;

  @Column({ nullable: true, length: 255 })
  complement: string;

  @Column({ nullable: true, length: 255 })
  reference: string;

  @Column({ nullable: true, length: 255 })
  neighborhood: string;

  @Column({ nullable: true, length: 255 })
  city: string;

  @Column({ nullable: true, length: 2 })
  state: string;

  @Column({ nullable: true, length: 9 })
  postal_code: string;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  about: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column({ type: 'varchar', length: 30 })
  url: string;

  @Column('float', { default: 0 })
  rating: number;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  cover: string;

  @Column({ type: 'boolean', default: false })
  hasAutomaticUpdate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.provider)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.provider)
  appointments: AppointmentEntity[];
  @OneToMany(() => AvailabilityEntity, (availability) => availability.provider)
  availabilities: AvailabilityEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.provider)
  notifications: NotificationEntity[];

  @OneToMany(() => ServiceEntity, (service) => service.provider)
  services: ServiceEntity[];

  @OneToMany(
    () => PaymentMethodsEntity,
    (paymentMethods) => paymentMethods.provider,
  )
  paymentMethods: PaymentMethodsEntity[];
}

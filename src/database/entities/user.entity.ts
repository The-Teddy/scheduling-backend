import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';
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

  @Column({ default: 'user' })
  role: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ nullable: true, length: 15 })
  phone_number_personal: string;

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

  @OneToOne(() => ProviderEntity, (provider) => provider.user)
  provider: ProviderEntity;
}

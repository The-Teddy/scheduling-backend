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

  @Column()
  role: string;

  @Column({ type: 'varchar', length: 14, nullable: true })
  document: string;

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

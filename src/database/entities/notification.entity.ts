import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProviderEntity } from './providers.entity';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'binary', length: 16 })
  consumerId: Buffer;

  @Column({ type: 'varchar', length: 100 })
  consumerName: string;

  @Column({ type: 'varchar', length: 255 })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ProviderEntity, (provider) => provider.notifications)
  provider: ProviderEntity;
}

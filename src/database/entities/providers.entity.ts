import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity'; // Importa a entidade de usuário

@Entity('providers')
export class ProviderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('binary', { length: 16 })
  userId: Buffer;

  @Column({ type: 'varchar', length: 100 })
  businessName: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column('float', { default: 0 })
  rating: number;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  cover: string;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.provider)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}

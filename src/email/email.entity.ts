import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class EmailEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 200 })
  email: string;
  @Column()
  code: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}

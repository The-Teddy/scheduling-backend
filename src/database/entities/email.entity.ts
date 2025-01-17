import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('email_codes')
export class EmailEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 200 })
  email: string;
  @Column({ length: 200, nullable: true })
  oldEmail: string;
  @Column()
  code: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}

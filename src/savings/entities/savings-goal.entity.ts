import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { SavingGoal } from '../interfaces/saving.interfaces';
import { Users } from '../../users/entities/users.entity';

@Entity()
export class SavingsGoal implements SavingGoal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 1000 })
  name: string;

  @Column('varchar', { length: 1000, nullable: true })
  description?: string;

  @Column('int', { nullable: true })
  value?: number;

  @Column('int', { nullable: true })
  finishValue?: number;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;

  @CreateDateColumn()
  createdAt: Date;
}

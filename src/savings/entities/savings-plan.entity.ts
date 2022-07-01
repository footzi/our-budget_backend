import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { Saving } from '../interfaces/saving.interfaces';
import { SavingsGoal } from './savings-goal.entity';

@Entity()
export class SavingsPlan implements Saving {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  value: number;

  @Column('varchar', { length: 1000 })
  comment: string;

  @Column('date')
  date: string;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => SavingsGoal)
  @JoinColumn()
  goal: SavingsGoal;
}

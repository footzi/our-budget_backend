import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { Saving } from '../interfaces/saving.interfaces';
import { SavingsGoal } from './savings-goal.entity';
import { SAVING_ACTION_TYPE } from '../savings.constants';

@Entity()
export class SavingsFact implements Saving {
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

  @Column({
    type: 'enum',
    enum: SAVING_ACTION_TYPE,
    default: SAVING_ACTION_TYPE.INCOME,
  })
  actionType: SAVING_ACTION_TYPE;

  @CreateDateColumn()
  createdAt: Date;
}

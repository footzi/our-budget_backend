import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Users } from '../../users/entities/users.entity';
import { Saving } from '../interfaces/saving.interface';
import { SAVING_ACTION_TYPE } from '../savings.constants';
import { SavingsGoal } from './savings-goal.entity';

@Entity()
export class SavingsFact implements Saving {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  value: number;

  @Column('varchar', { length: 1000 })
  comment: string;

  @Column('timestamp')
  date: Date;

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

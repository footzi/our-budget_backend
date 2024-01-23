import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CURRENCIES, DEFAULT_CURRENCY } from '../../currencies/currencies.constants';
import { Users } from '../../users/entities/users.entity';
import { BALANCE_ACTIONS } from '../balances.constants';
import { BalanceHistory } from '../interfaces/balance.interface';

@Entity()
export class BalanceHistories implements BalanceHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;

  @Column({ type: 'enum', enum: CURRENCIES, default: DEFAULT_CURRENCY })
  currency: CURRENCIES;

  @Column({ type: 'enum', enum: BALANCE_ACTIONS, default: BALANCE_ACTIONS.INCREMENT })
  action: BALANCE_ACTIONS;

  @Column('int')
  oldValue: number;

  @Column('int')
  newValue: number;
}

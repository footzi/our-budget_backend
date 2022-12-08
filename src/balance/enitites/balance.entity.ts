import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CurrenciesValues } from '../../currencies/curerncies.interfaces';
import { DEFAULT_CURRENCY } from '../../currencies/currencies.constants';
import { Users } from '../../users/entities/users.entity';
import { Balance } from '../interfaces/balance.interface';

@Entity()
export class Balances implements Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  common: number;

  @Column({ type: 'json', default: { [DEFAULT_CURRENCY]: 0 } })
  values: CurrenciesValues;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;
}

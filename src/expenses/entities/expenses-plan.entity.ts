import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Categories } from '../../categories/entities/categories.entity';
import { CURRENCIES, DEFAULT_CURRENCY } from '../../currencies/currencies.constants';
import { ColumnNumericTransformer } from '../../transformer/transformer.index';
import { Users } from '../../users/entities/users.entity';
import { Expense } from '../interfaces/expense.interface';

@Entity()
export class ExpensesPlan implements Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('numeric', { precision: 10, scale: 2, transformer: new ColumnNumericTransformer() })
  value: number;

  @Column('varchar', { length: 1000 })
  comment: string;

  @Column('varchar', { default: DEFAULT_CURRENCY })
  currency: CURRENCIES;

  @Column('timestamp')
  date: Date;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Categories)
  @JoinColumn()
  category: Categories;

  @CreateDateColumn()
  createdAt: Date;
}

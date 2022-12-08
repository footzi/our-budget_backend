import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CURRENCIES, DEFAULT_CURRENCY } from '../../currencies/currencies.constants';
import { ColumnNumericTransformer } from '../../transformer/transformer.index';
import { Users } from '../../users/entities/users.entity';
import { SavingGoal } from '../interfaces/saving.interface';

@Entity()
export class SavingsGoal implements SavingGoal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 1000 })
  name: string;

  @Column('varchar', { default: DEFAULT_CURRENCY })
  currency: CURRENCIES;

  @Column('varchar', { length: 1000, nullable: true })
  description?: string;

  @Column('numeric', { precision: 10, scale: 2, transformer: new ColumnNumericTransformer(), nullable: true })
  value?: number;

  @Column('int', { nullable: true })
  finishValue?: number;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;

  @CreateDateColumn()
  createdAt: Date;
}

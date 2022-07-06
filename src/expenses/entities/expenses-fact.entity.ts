import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { Expense } from '../interfaces/expense.interfaces';
import { Categories } from '../../categories/entities/categories.entity';

@Entity()
export class ExpensesFact implements Expense {
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

  @ManyToOne(() => Categories)
  @JoinColumn()
  category: Categories;

  @CreateDateColumn()
  createdAt: Date;
}

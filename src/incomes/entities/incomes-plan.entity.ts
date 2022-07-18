import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { Categories } from '../../categories/entities/categories.entity';
import { Income } from '../interfaces/income.interface';

@Entity()
export class IncomesPlan implements Income {
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

  @ManyToOne(() => Categories)
  @JoinColumn()
  category: Categories;

  @CreateDateColumn()
  createdAt: Date;
}

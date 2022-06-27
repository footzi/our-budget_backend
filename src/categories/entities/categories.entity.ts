import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../interfaces/categories.inteface';
import { Users } from '../../users/entities/users.entity';
import { CATEGORIES_TYPES } from '../constants.categories';

@Entity()
export class Categories implements Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 1000 })
  name: string;

  @Column({
    type: 'enum',
    enum: CATEGORIES_TYPES,
    default: CATEGORIES_TYPES.INCOME,
  })
  type: CATEGORIES_TYPES;

  @Column('date', { nullable: true })
  startDate: string;

  @Column('date', { nullable: true })
  endDate: string;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;
}

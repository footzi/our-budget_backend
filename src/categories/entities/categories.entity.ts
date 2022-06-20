import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../interfaces/categories.inteface';
import { Users } from '../../users/entities/users.entity';

@Entity()
export class Categories implements Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 1000 })
  name: string;

  @Column('boolean')
  isAdditional: boolean;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;
}

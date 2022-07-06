import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { Balance } from '../interfaces/balance.interface';

@Entity()
export class Balances implements Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  common: number;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;
}

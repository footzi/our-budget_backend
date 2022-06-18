import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Auth } from '../interfaces/auth.interfaces';

@Entity()
export class Auths implements Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  userId: number;

  @Column('varchar')
  refresh: string;
}

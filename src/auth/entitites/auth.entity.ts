import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Auth } from '../interfaces/auth.interface';

@Entity()
export class Auths implements Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  userId: number;

  @Column('varchar')
  refresh: string;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../interfaces/users.interface';
import { USER_ROLES } from '../users.constants';

@Entity()
export class Users implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 200 })
  login: string;

  @Column('varchar', { length: 200 })
  firstName: string;

  @Column('varchar', { nullable: true })
  password?: string;

  @Column('varchar', { array: true })
  roles: USER_ROLES[];
}

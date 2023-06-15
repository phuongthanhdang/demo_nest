import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class LockAccount {
  @PrimaryGeneratedColumn()
  public id: string;
  @Column()
  count: number;
  @ManyToOne(() => User, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public user: User;
}

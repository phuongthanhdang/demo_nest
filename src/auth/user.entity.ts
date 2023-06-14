import { Exclude } from 'class-transformer';
import { type } from 'os';
import { Task } from 'src/tasks/task.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role/role.entity';
import { Session } from 'src/session/session.entity';
import { Cart } from 'src/cart/cart.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @OneToMany((_type) => Task, (task) => task.user)
  tasks: Task[];

  @ManyToOne(() => Role, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public role: Role;

  @OneToMany((_type) => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany((_type) => Cart, (cart) => cart.user)
  cart: Cart[];
}
export default User;

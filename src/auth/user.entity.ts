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

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @OneToOne(() => Role, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public role: Role;
}
export default User;

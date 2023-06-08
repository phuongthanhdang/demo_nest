import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from '../user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  public id: string;
  @Column()
  public name: string;
  @OneToMany(() => User, (user: User) => user.role)
  @Exclude({ toPlainOnly: true })
  public user: User[];
}

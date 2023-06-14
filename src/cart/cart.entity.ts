import { Exclude } from 'class-transformer';
import User from 'src/auth/user.entity';
import { Product } from 'src/product/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  count: number;

  @ManyToOne((_type) => User, (user) => user.cart, {
    eager: true,
    cascade: true,
  })
  @Exclude({ toPlainOnly: true })
  user: User;
  @ManyToOne((_type) => Product, (product) => product.cart, {
    eager: true,
    cascade: true,
  })
  @Exclude({ toPlainOnly: true })
  product: Product;
}

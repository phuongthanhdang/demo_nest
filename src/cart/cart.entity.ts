import { Exclude } from 'class-transformer';
import User from 'src/auth/user.entity';
import { Product } from 'src/product/product.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne((_type) => User, (user) => user.cart, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  @ManyToOne((_type) => Product, (product) => product.cart, { eager: false })
  @Exclude({ toPlainOnly: true })
  product: Product;
}

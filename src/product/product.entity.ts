import { Cart } from 'src/cart/cart.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column()
  price: number;

  @OneToMany((_type) => Cart, (cart) => cart.product)
  cart: Cart[];
}

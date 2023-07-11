import { Exclude } from 'class-transformer';
import { Cart } from 'src/cart/cart.entity';
import { LoaiSP } from 'src/loai-sp/loai-sp.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @ManyToOne((_type) => LoaiSP, (loaisp) => loaisp.product, {
    eager: true,
    cascade: true,
  })
  @Exclude({ toPlainOnly: true })
  loaisp: LoaiSP;
}

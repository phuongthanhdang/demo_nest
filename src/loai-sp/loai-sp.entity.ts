import { Cart } from 'src/cart/cart.entity';
import { Product } from 'src/product/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LoaiSP {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @OneToMany((_type) => Product, (product) => product.loaisp)
  product: Product[];
}

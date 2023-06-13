import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CraeteProduct } from './dto/craete-product.dto';
import { SearchProduct } from './dto/search-product.dto';
import { IsEmpty } from 'class-validator';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(craeteProduct: CraeteProduct): Promise<Product> {
    const { image, name, title, price } = craeteProduct;

    const product = this.productRepository.create({
      image,
      name,
      title,
      price,
    });
    await this.productRepository.save(product);
    return product;
  }
  async saerchProdut(searchProdut: SearchProduct): Promise<Product[]> {
    const { name, price } = searchProdut;
    const query = this.productRepository.createQueryBuilder('product');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if ((name.length == 0 || name == null) && price == null) {
      const allProduct = await this.productRepository.find();
      return allProduct;
    } else {
      if (name.length != 0) {
        console.log(name.length);
        query.andWhere('product.name like (:name)', { name: `%${name}%` });
      }
      if (price != null) {
        query.andWhere('product.price =:price', { price });
      }
      const product = await query.getMany();
      return product;
    }
  }
}

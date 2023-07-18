import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CraeteProduct } from './dto/craete-product.dto';
import { SearchProduct } from './dto/search-product.dto';
import { IsEmpty } from 'class-validator';
import { LoaiSpService } from 'src/loai-sp/loai-sp.service';
import { LoaiSP } from 'src/loai-sp/loai-sp.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private loaiSpService: LoaiSpService,
  ) {}

  async createProduct(craeteProduct: CraeteProduct, req): Promise<Product> {
    if (req.user.role != 'admin') {
      throw new UnauthorizedException();
    }
    const { image, name, title, price, loaisp } = craeteProduct;
    const loai = await this.loaiSpService.getLoaiSPById(loaisp);
    console.log(loai);
    const product = this.productRepository.create({
      image,
      name,
      title,
      price,
      loaisp: loai,
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
  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    return product;
  }
  async getProductByLoaiSP(id: string): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');
    query.andWhere('product.loaisp.id =:id', { id });
    const product = await query.getMany();
    return product;
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CraeteProduct } from './dto/craete-product.dto';
import { Product } from './product.entity';
import { SearchProduct } from './dto/search-product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/craete-product')
  craeteProduct(@Body() craeteProduct: CraeteProduct): Promise<Product> {
    return this.productService.createProduct(craeteProduct);
  }
  @Post('/search-product')
  searchproduct(@Body() searchproduct: SearchProduct): Promise<Product[]> {
    return this.productService.saerchProdut(searchproduct);
  }
}

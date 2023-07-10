import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CraeteProduct } from './dto/craete-product.dto';
import { Product } from './product.entity';
import { SearchProduct } from './dto/search-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import User from 'src/auth/user.entity';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post('/craete-product')
  craeteProduct(
    @Body() craeteProduct: CraeteProduct,
    @Request() req,
  ): Promise<Product> {
    return this.productService.createProduct(craeteProduct, req);
  }
  @Post('/search-product')
  searchproduct(@Body() searchproduct: SearchProduct): Promise<Product[]> {
    return this.productService.saerchProdut(searchproduct);
  }
  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }
}

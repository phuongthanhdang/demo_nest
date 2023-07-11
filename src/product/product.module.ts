import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from 'src/cart/cart.module';
import { SessionModule } from 'src/session/session.module';
import { LoaiSpModule } from 'src/loai-sp/loai-sp.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), SessionModule, LoaiSpModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}

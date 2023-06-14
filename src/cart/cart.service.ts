import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import User from 'src/auth/user.entity';
import { ProductService } from 'src/product/product.service';
import { UsersRepository } from 'src/auth/users.repository';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private productService: ProductService,
    private authService: AuthService,
  ) {}

  async addCart(idProduct: string, user: User): Promise<string> {
    const product = await this.productService.getProductById(idProduct);
    const { username } = user;
    const users = await this.authService.getUserByUsername(username);
    console.log(users);
    const cart = this.cartRepository.create({
      user,
      product,
    });
    await this.cartRepository.save(cart);
    return 'Susscecfully';
  }
}

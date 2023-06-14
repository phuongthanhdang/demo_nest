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

  async addCart(idProduct: string, req): Promise<string> {
    const product = await this.productService.getProductById(idProduct);
    const username = req.user.username;
    const user = await this.authService.getUserByUsername(username);
    const carts = await this.cartRepository.findOne({
      where: { user, product },
    });
    if (carts) {
      carts.count = carts.count++;
      console.log(carts.count++);
      await this.cartRepository.update(carts.id, carts);
      return 'Susscecfully';
    } else {
      const cart = this.cartRepository.create({
        count: 1,
        user,
        product,
      });
      await this.cartRepository.save(cart);
      return 'Susscecfully';
    }
  }
  async getCartByUserId(req): Promise<Cart[]> {
    const username = req.user.username;
    const user = await this.authService.getUserByUsername(username);
    const carts = await this.cartRepository.find({ where: { user } });
    return carts;
  }
}

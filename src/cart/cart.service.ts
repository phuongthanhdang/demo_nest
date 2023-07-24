import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import User from 'src/auth/user.entity';
import { ProductService } from 'src/product/product.service';
import { UsersRepository } from 'src/auth/users.repository';
import { AuthService } from 'src/auth/auth.service';
import { AddCart } from './dto/add-cart.dto';
import { ProductCart } from './dto/product.dto';
import e from 'express';
import { AddToCart } from './dto/add-to-cart.dto';
import { number } from 'joi';
import { UpdateCountCart } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private productService: ProductService,
    private authService: AuthService,
  ) {}
  dem?: number;
  async addCart(addToCart: AddToCart, req): Promise<string> {
    const { idProduct, count } = addToCart;

    const product = await this.productService.getProductById(idProduct);
    if (!product) {
      throw new NotFoundException('Product does not exist');
    }
    const username = req.user.username;
    const user = await this.authService.getUserByUsername(username);
    const carts = await this.cartRepository.findOne({
      where: { user, product },
    });
    if (carts) {
      carts.count = count + carts.count;
      console.log('dem', this.dem);
      await this.cartRepository.update(carts.id, carts);
      return 'Susscecfully';
    } else {
      const cart = this.cartRepository.create({
        count,
        user,
        product,
      });
      await this.cartRepository.save(cart);
      return 'Susscecfully';
    }
  }
  async getCartByUserId(req): Promise<AddCart> {
    const username = req.user.username;
    const user = await this.authService.getUserByUsername(username);
    const carts = await this.cartRepository.find({ where: { user } });
    const listProduct = [];
    const addCart = new AddCart();
    carts.forEach(function (entry) {
      const productCart = new ProductCart();
      productCart.id = entry.product.id;
      productCart.image = entry.product.image;
      productCart.name = entry.product.name;
      productCart.tittle = entry.product.title;
      productCart.quantity = entry.count;
      productCart.price = entry.product.price;
      productCart.idCart = entry.id;
      listProduct.push(productCart);
    });
    console.log(listProduct);

    addCart.userId = user.id;
    addCart.username = user.username;
    addCart.product = listProduct;

    return addCart;
  }
  async updateCountCart(updateCountCart: UpdateCountCart) {
    const { id, count } = updateCountCart;
    const carts = await this.cartRepository.findOne({ where: { id } });
    if (carts) {
      carts.count = count;
      await this.cartRepository.update(id, carts);
    }
  }
  async deleteCart(updateCountCart: UpdateCountCart) {
    const { id } = updateCountCart;
    const carts = await this.cartRepository.findOne({ where: { id } });
    if (carts) {
      await this.cartRepository.delete(id);
    }
  }
}

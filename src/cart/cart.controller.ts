import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { string } from 'joi';
import { GetUser } from 'src/auth/get-user.decorator';
import User from 'src/auth/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Post('/add-cart/:idProduct')
  addCart(
    @Param('idProduct') idProduct: string,
    @GetUser() user: User,
  ): Promise<string> {
    return this.cartService.addCart(idProduct, user);
  }
}

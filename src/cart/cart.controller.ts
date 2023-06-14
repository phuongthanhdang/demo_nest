import { Controller, Param, Post, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { string } from 'joi';
import { GetUser } from 'src/auth/get-user.decorator';
import User from 'src/auth/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Cart } from './cart.entity';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Post('/add-cart/:idProduct')
  addCart(
    @Param('idProduct') idProduct: string,
    @Request() req,
  ): Promise<string> {
    return this.cartService.addCart(idProduct, req);
  }

  @UseGuards(AuthGuard)
  @Post('/get-cart')
  getCartByUserId(@Request() req): Promise<Cart[]> {
    return this.cartService.getCartByUserId(req);
  }
}

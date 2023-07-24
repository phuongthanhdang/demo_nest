import {
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { string } from 'joi';
import { GetUser } from 'src/auth/get-user.decorator';
import User from 'src/auth/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Cart } from './cart.entity';
import { AddCart } from './dto/add-cart.dto';
import { AddToCart } from './dto/add-to-cart.dto';
import { UpdateCountCart } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Post('/add-cart')
  addCart(@Body() addToCart: AddToCart, @Request() req): Promise<string> {
    return this.cartService.addCart(addToCart, req);
  }

  @UseGuards(AuthGuard)
  @Post('/get-cart')
  getCartByUserId(@Request() req): Promise<AddCart> {
    return this.cartService.getCartByUserId(req);
  }

  @Post('/update-cart')
  updateCountCart(@Body() updateCountCart: UpdateCountCart) {
    return this.cartService.updateCountCart(updateCountCart);
  }

  @Post('/delete-cart')
  deleteCart(@Body() updateCountCart: UpdateCountCart) {
    return this.cartService.deleteCart(updateCountCart);
  }
}

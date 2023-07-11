import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LoaiSpService } from './loai-sp.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CraeteLoaiSP } from './dto/create-loaisp.dto';
import { LoaiSP } from './loai-sp.entity';
@Controller('loai-sp')
export class LoaiSpController {
  constructor(private loaiSpService: LoaiSpService) {}
  @UseGuards(AuthGuard)
  @Post('/craete-loaisp')
  craeteProduct(
    @Body() craeteLoaiSP: CraeteLoaiSP,
    @Request() req,
  ): Promise<LoaiSP> {
    return this.loaiSpService.createProduct(craeteLoaiSP, req);
  }
}

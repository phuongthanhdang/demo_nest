import { Module } from '@nestjs/common';
import { LoaiSpController } from './loai-sp.controller';
import { LoaiSpService } from './loai-sp.service';
import { LoaiSP } from './loai-sp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [TypeOrmModule.forFeature([LoaiSP]), SessionModule],
  controllers: [LoaiSpController],
  providers: [LoaiSpService],
  exports: [LoaiSpService],
})
export class LoaiSpModule {}

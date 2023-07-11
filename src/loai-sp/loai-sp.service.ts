import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoaiSP } from './loai-sp.entity';
import { Repository } from 'typeorm';
import { CraeteLoaiSP } from './dto/create-loaisp.dto';

@Injectable()
export class LoaiSpService {
  constructor(
    @InjectRepository(LoaiSP)
    private loaiSPtRepository: Repository<LoaiSP>,
  ) {}
  async createProduct(craeteLoaiSP: CraeteLoaiSP, req): Promise<LoaiSP> {
    if (req.user.role != 'admin') {
      throw new UnauthorizedException();
    }
    const { name } = craeteLoaiSP;

    const loaiSp = this.loaiSPtRepository.create({
      name,
    });
    await this.loaiSPtRepository.save(loaiSp);
    return loaiSp;
  }
  async getLoaiSPById(id: string): Promise<LoaiSP> {
    const loaisp = await this.loaiSPtRepository.findOne({ where: { id } });
    return loaisp;
  }
}

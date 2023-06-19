import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckEmail } from './check-email.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CheckEmailService {
  constructor(
    @InjectRepository(CheckEmail)
    private checkEmailRepository: Repository<CheckEmail>,
  ) {}
  async addCheckEmail(iv: string, encryptedData: string) {
    const chekcEmail = this.checkEmailRepository.create({
      iv,
      encryptedData,
    });
    await this.checkEmailRepository.save(chekcEmail);
  }
  async delete(iv: string, encryptedData: string) {
    const check = await this.checkEmailRepository.findOne({
      where: { iv, encryptedData },
    });
    if (!check) {
      throw new NotFoundException();
    } else {
      await this.checkEmailRepository.delete(check.id);
    }
  }
  async getCheckEmail(iv: string, encryptedData: string): Promise<CheckEmail> {
    const check = await this.checkEmailRepository.findOne({
      where: { iv, encryptedData },
    });
    if (!check) {
      throw new NotFoundException('Link time out');
    }
    return check;
  }
}

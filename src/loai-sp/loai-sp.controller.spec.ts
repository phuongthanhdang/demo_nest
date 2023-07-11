import { Test, TestingModule } from '@nestjs/testing';
import { LoaiSpController } from './loai-sp.controller';

describe('LoaiSpController', () => {
  let controller: LoaiSpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoaiSpController],
    }).compile();

    controller = module.get<LoaiSpController>(LoaiSpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

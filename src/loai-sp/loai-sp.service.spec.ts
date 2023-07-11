import { Test, TestingModule } from '@nestjs/testing';
import { LoaiSpService } from './loai-sp.service';

describe('LoaiSpService', () => {
  let service: LoaiSpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoaiSpService],
    }).compile();

    service = module.get<LoaiSpService>(LoaiSpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

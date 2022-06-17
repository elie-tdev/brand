import { Test, TestingModule } from '@nestjs/testing';
import { CoverArtService } from './cover-art.service';

describe('CoverArtService', () => {
  let service: CoverArtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoverArtService],
    }).compile();

    service = module.get<CoverArtService>(CoverArtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

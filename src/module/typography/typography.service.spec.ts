import { Test, TestingModule } from '@nestjs/testing';
import { TypographyService } from './typography.service';

describe('TypographyService', () => {
  let service: TypographyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypographyService],
    }).compile();

    service = module.get<TypographyService>(TypographyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

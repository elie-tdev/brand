import { Test, TestingModule } from '@nestjs/testing';
import { GuidelineService } from './guideline.service';

describe('GuidelineService', () => {
  let service: GuidelineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuidelineService],
    }).compile();

    service = module.get<GuidelineService>(GuidelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

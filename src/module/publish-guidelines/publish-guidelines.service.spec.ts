import { Test, TestingModule } from '@nestjs/testing';
import { PublishGuidelinesService } from './publish-guidelines.service';

describe('PublishGuidelinesService', () => {
  let service: PublishGuidelinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublishGuidelinesService],
    }).compile();

    service = module.get<PublishGuidelinesService>(PublishGuidelinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

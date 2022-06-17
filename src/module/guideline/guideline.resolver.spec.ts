import { Test, TestingModule } from '@nestjs/testing';
import { GuidelineResolver } from './guideline.resolver';

describe('GuidelineResolver', () => {
  let resolver: GuidelineResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuidelineResolver],
    }).compile();

    resolver = module.get<GuidelineResolver>(GuidelineResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

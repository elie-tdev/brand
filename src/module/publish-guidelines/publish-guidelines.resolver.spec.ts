import { Test, TestingModule } from '@nestjs/testing';
import { PublishGuidelinesResolver } from './publish-guidelines.resolver';

describe('PublishGuidelinesResolver', () => {
  let resolver: PublishGuidelinesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublishGuidelinesResolver],
    }).compile();

    resolver = module.get<PublishGuidelinesResolver>(PublishGuidelinesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

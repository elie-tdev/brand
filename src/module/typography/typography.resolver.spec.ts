import { Test, TestingModule } from '@nestjs/testing';
import { TypographyResolver } from './typography.resolver';

describe('TypographyResolver', () => {
  let resolver: TypographyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypographyResolver],
    }).compile();

    resolver = module.get<TypographyResolver>(TypographyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

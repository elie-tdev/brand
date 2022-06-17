import { Test, TestingModule } from '@nestjs/testing';
import { CoverArtResolver } from './cover-art.resolver';

describe('CoverArtResolver', () => {
  let resolver: CoverArtResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoverArtResolver],
    }).compile();

    resolver = module.get<CoverArtResolver>(CoverArtResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

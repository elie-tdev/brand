import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionPlanResolver } from './subscription-plan.resolver';

describe('SubscriptionPlanResolver', () => {
  let resolver: SubscriptionPlanResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionPlanResolver],
    }).compile();

    resolver = module.get<SubscriptionPlanResolver>(SubscriptionPlanResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

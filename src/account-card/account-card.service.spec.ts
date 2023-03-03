import { Test, TestingModule } from '@nestjs/testing';
import { AccountCardService } from './account-card.service';

describe('AccountCardService', () => {
  let service: AccountCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountCardService],
    }).compile();

    service = module.get<AccountCardService>(AccountCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

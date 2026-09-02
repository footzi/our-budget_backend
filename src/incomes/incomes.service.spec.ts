import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BalanceService } from '../balance/balance.service';
import { ValidatorService } from '../validator/validator.service';
import { IncomesFact } from './entities/incomes-fact.entity';
import { IncomesPlan } from './entities/incomes-plan.entity';
import { IncomesService } from './incomes.service';

describe('IncomesService', () => {
  let service: IncomesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncomesService,
        { provide: getRepositoryToken(IncomesPlan), useValue: {} },
        { provide: getRepositoryToken(IncomesFact), useValue: {} },
        { provide: BalanceService, useValue: {} },
        { provide: ValidatorService, useValue: {} },
      ],
    }).compile();

    service = module.get<IncomesService>(IncomesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

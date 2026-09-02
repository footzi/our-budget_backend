import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BalanceService } from '../balance/balance.service';
import { ValidatorService } from '../validator/validator.service';
import { ExpensesFact } from './entities/expenses-fact.entity';
import { ExpensesPlan } from './entities/expenses-plan.entity';
import { ExpensesService } from './expenses.service';

describe('ExpensesService', () => {
  let service: ExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: getRepositoryToken(ExpensesPlan), useValue: {} },
        { provide: getRepositoryToken(ExpensesFact), useValue: {} },
        { provide: BalanceService, useValue: {} },
        { provide: ValidatorService, useValue: {} },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

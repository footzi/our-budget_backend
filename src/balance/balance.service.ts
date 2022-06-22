import { Injectable } from '@nestjs/common';
import { IncomesService } from '../incomes/incomes.service';
import { ExpensesService } from '../expenses/expenses.service';

@Injectable()
export class BalanceService {
  constructor(private incomesService: IncomesService, private expensesService: ExpensesService) {}

  /**
   * Возвращает общий баланс (разница между доходами и расходами)
   */
  async getCommon(start: string, end: string): Promise<number> {
    const incomes = await this.incomesService.getFactsSumByPeriod(start, end);
    const expenses = await this.expensesService.getFactsSumByPeriod(start, end);

    return incomes - expenses;
  }
}

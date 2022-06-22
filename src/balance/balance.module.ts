import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { IncomesModule } from '../incomes/incomes.module';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
  imports: [IncomesModule, ExpensesModule],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceModule } from '../balance/balance.module';
import { ExpensesFact } from './entities/expenses-fact.entity';
import { ExpensesPlan } from './entities/expenses-plan.entity';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExpensesPlan, ExpensesFact]), BalanceModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [TypeOrmModule, ExpensesService],
})
export class ExpensesModule {}

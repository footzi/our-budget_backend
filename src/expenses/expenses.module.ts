import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { ExpensesPlan } from './entities/expenses-plan.entity';
import { ExpensesFact } from './entities/expenses-fact.entity';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExpensesPlan, ExpensesFact]), BalanceModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [TypeOrmModule, ExpensesService],
})
export class ExpensesModule {}

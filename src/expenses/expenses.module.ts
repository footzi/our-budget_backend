import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { ExpensesPlan } from './entities/expenses-plan.entity';
import { ExpensesFact } from './entities/expenses-fact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpensesPlan, ExpensesFact])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [TypeOrmModule],
})
export class ExpensesModule {}

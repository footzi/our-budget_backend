import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
// import { IncomesModule } from '../incomes/incomes.module';
// import { ExpensesModule } from '../expenses/expenses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balances } from './enitites/balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Balances])],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}

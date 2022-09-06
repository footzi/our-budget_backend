import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceModule } from '../balance/balance.module';
import { IncomesFact } from './entities/incomes-fact.entity';
import { IncomesPlan } from './entities/incomes-plan.entity';
import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';

@Module({
  imports: [TypeOrmModule.forFeature([IncomesPlan, IncomesFact]), BalanceModule],
  controllers: [IncomesController],
  providers: [IncomesService],
  exports: [TypeOrmModule, IncomesService],
})
export class IncomesModule {}

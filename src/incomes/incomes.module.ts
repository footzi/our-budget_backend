import { Module } from '@nestjs/common';
import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomesPlan } from './entities/incomes-plan.entity';
import { IncomesFact } from './entities/incomes-fact.entity';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [TypeOrmModule.forFeature([IncomesPlan, IncomesFact]), BalanceModule],
  controllers: [IncomesController],
  providers: [IncomesService],
  exports: [TypeOrmModule, IncomesService],
})
export class IncomesModule {}

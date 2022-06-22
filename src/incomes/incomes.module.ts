import { Module } from '@nestjs/common';
import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomesPlan } from './entities/incomes-plan.entity';
import { IncomesFact } from './entities/incomes-fact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IncomesPlan, IncomesFact])],
  controllers: [IncomesController],
  providers: [IncomesService],
  exports: [TypeOrmModule],
})
export class IncomesModule {}

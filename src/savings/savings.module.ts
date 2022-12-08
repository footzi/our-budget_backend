import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceModule } from '../balance/balance.module';
import { ValidatorModule } from '../validator/validator.module';
import { SavingsFact } from './entities/savings-fact.entity';
import { SavingsGoal } from './entities/savings-goal.entity';
import { SavingsPlan } from './entities/savings-plan.entity';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';

@Module({
  imports: [TypeOrmModule.forFeature([SavingsPlan, SavingsFact, SavingsGoal]), BalanceModule, ValidatorModule],
  controllers: [SavingsController],
  providers: [SavingsService],
  exports: [TypeOrmModule, SavingsService],
})
export class SavingsModule {}

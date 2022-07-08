import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { SavingsPlan } from './entities/savings-plan.entity';
import { SavingsFact } from './entities/savings-fact.entity';
import { SavingsGoal } from './entities/savings-goal.entity';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [TypeOrmModule.forFeature([SavingsPlan, SavingsFact, SavingsGoal]), BalanceModule],
  controllers: [SavingsController],
  providers: [SavingsService],
  exports: [TypeOrmModule, SavingsService],
})
export class SavingsModule {}

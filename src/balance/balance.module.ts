import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ValidatorModule } from '../validator/validator.module';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { Balances } from './enitites/balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Balances]), ValidatorModule],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}

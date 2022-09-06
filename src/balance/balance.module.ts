import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { Balances } from './enitites/balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Balances])],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}

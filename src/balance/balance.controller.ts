import { BalanceService } from './balance.service';
import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { GetBalanceOutputDto } from './dto/get-balance-output-dto';

@Controller('/api/balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @HttpCode(200)
  async getBalance(@Query('start') start: string, @Query('end') end: string): Promise<GetBalanceOutputDto> {
    try {
      return {
        balance: {
          common: await this.balanceService.getCommon(start, end),
        },
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}

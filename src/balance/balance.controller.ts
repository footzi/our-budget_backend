import { BalanceService } from './balance.service';
import { Controller, Get, HttpCode, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { GetBalanceOutputDto } from './dto/get-balance-output-dto';

@Controller('/api/balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @HttpCode(200)
  async getBalance(@Request() req): Promise<GetBalanceOutputDto> {
    try {
      return {
        balance: {
          common: await this.balanceService.getCommon(req.user),
        },
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}

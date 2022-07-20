import { BalanceService } from './balance.service';
import { Body, Controller, Get, HttpCode, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { GetBalanceOutputDto } from './dto/get-balance-output-dto';
import { SuccessHandler } from '../utils/successHandler/interfaces';
import { successHandler } from '../utils/successHandler';
import { UpdateBalanceDto } from './dto/update-balance-dto';

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

  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(200)
  async updateUBalance(@Body() updateBalanceDto: UpdateBalanceDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.balanceService.update(updateBalanceDto, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }
}

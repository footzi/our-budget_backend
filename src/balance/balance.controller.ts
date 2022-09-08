import { Body, Controller, Get, HttpCode, Inject, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { ErrorHandler } from '../utils/errorHandler/interfaces';
import { successHandler } from '../utils/successHandler';
import { SuccessHandler } from '../utils/successHandler/interfaces';
import { BalanceService } from './balance.service';
import { GetBalanceOutputDto } from './dto/get-balance-output.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Controller('/api/balance')
export class BalanceController {
  constructor(
    private readonly balanceService: BalanceService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @HttpCode(200)
  @ApiOkResponse({ type: GetBalanceOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async getBalance(@Request() req): Promise<GetBalanceOutputDto> {
    try {
      return {
        balance: {
          common: await this.balanceService.getCommon(req.user),
        },
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async updateBalance(@Body() updateBalanceDto: UpdateBalanceDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.balanceService.update(updateBalanceDto, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }
}

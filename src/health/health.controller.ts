import { Controller, Get, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';

import { SERVICE_NAME } from '../constants';

@Controller('/api/health-check')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Приложение работает и база доступна' })
  async check(): Promise<string> {
    try {
      await this.dataSource.query('SELECT 1');

      return 'OK';
    } catch (error) {
      this.logger.error(`[${SERVICE_NAME}] health-check не прошёл: база недоступна — ${error.message}`);

      throw new HttpException('DB_UNAVAILABLE', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

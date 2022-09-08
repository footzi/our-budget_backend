import { HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from 'winston';

import { ErrorHandlerProps } from './interfaces';

export const errorHandler = (error: ErrorHandlerProps, logger: Logger, req) => {
  const status = error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
  const message = `\n СТАТУС: ${status} \n ОШИБКА: ${error.message} \n STACK: ${error.stack} \n ПОЛЬЗОВАТЕЛЬ: ${req.user?.id}`;

  logger.error(message);

  throw new HttpException(error.message, status);
};

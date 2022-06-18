import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorHandlerProps } from './interfaces';

export const errorHandler = (error: ErrorHandlerProps) => {
  const status = error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
  throw new HttpException(error.message, status);
};

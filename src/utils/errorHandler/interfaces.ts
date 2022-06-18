import { HttpStatus } from '@nestjs/common';

export interface ErrorHandlerProps extends Error {
  status?: HttpStatus;
}

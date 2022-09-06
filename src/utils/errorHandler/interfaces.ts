import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export interface ErrorHandlerProps extends Error {
  status?: HttpStatus;
}

export class ErrorHandler {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
}

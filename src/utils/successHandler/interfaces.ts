import { ApiProperty } from '@nestjs/swagger';

export class SuccessHandler {
  @ApiProperty()
  success: boolean;
}

import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/hello')
export class IncomesController {
  constructor() {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  // @HttpCode(201)
  add() {
    console.log('hello');
    return 'hello'
  }
}

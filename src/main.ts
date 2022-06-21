import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const { port, useCors } = config();

  const app = await NestFactory.create(AppModule, { cors: useCors });
  await app.listen(port);
}
bootstrap();

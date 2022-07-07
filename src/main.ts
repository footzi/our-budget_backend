import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const { port, useCors } = config();

  const cors = {
    origin: 'http://localhost:3000',
  };

  const app = await NestFactory.create(AppModule, { cors: useCors && cors });
  await app.listen(port);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const { port, useCors } = config();

  const cors = {
    origin: 'http://localhost:3000',
  };

  const app = await NestFactory.create(AppModule, { cors: useCors && cors });

  const swaggerConfig = new DocumentBuilder().setTitle('Our budget').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
}
bootstrap();

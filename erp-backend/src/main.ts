import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não declarados no DTO
      forbidNonWhitelisted: true,
      transform: true, // converte tipos automaticamente
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const uploadsPath = join(__dirname, '..', 'uploads');
  const logoPath = join(__dirname, '..', 'uploads/logo');
  const coverPath = join(__dirname, '..', 'uploads/cover');

  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath);
  }
  if (!existsSync(logoPath)) {
    mkdirSync(logoPath);
  }
  if (!existsSync(coverPath)) {
    mkdirSync(coverPath);
  }
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(3011);
}
bootstrap();

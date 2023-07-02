import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import 'dotenv/config';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

const PORT = process.env.PORT;

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(morgan('dev'));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(PORT);
  logger.log(`app is listening on ${PORT}`, await app.getUrl());
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { winstonLogger } from './common/logging/set-winston.logger';

dotenv.config();

const APPLICATION_NAME: string = process.env.APPLICATION_NAME;
const APPLICATION_DESCRIPTION: string = process.env.APPLICATION_DESCRIPTION;
const APPLICATION_VERSION: string = process.env.APPLICATION_VERSION;
const PORT = process.env.PORT;

async function bootstrap() {
  const logger = winstonLogger;

  const app = await NestFactory.create(AppModule);

  // Logging
  app.useLogger(winstonLogger);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Interceptors

  // Filters

  // Swagger Security

  // Documentation

  await app.listen(3000);
}
bootstrap();

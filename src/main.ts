import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { CustomLogger } from './common/logger/logger.service';
import { DEFAULT_PORT } from './utils/constants';

dotenv.config();
const PORT = Number(process.env.PORT) || DEFAULT_PORT;
export const CRYPT_SALT = 10;
export const JWT_SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME;
export const TOKEN_REFRESH_EXPIRE_TIME = process.env.TOKEN_REFRESH_EXPIRE_TIME;
export const LOGGER_LEVEL = process.env.LOGGER_LEVEL;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, document);

  const config = app.get(ConfigService);
  const logger = new CustomLogger(config);

  app.useLogger(logger);

  process.on('uncaughtException', (err, origin) => {
    logger.error(`Caught exception: ${err}. Exception origin: ${origin}.`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at promise. ${reason}`);
  });

  await app.listen(PORT);
}
bootstrap();

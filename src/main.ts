import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { DEFAULT_PORT } from './utils/constants';

dotenv.config();
const PORT = Number(process.env.PORT) || DEFAULT_PORT;
export const CRYPT_SALT = 10;
export const JWT_SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const TOKEN_EXPIRE_TIME = '1h';
export const TOKEN_REFRESH_EXPIRE_TIME = '24h';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();

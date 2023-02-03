import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { DEFAULT_PORT } from './constants';

dotenv.config();
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();

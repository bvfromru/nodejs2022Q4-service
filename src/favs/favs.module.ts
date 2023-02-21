import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';

@Module({
  controllers: [FavsController],
  providers: [FavsService, PrismaService],
})
export class FavsModule {}

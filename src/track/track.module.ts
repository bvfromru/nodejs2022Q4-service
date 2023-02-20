import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  controllers: [TrackController],
  providers: [TrackService, PrismaService],
})
export class TrackModule {}

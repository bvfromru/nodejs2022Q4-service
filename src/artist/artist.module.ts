import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, PrismaService],
  // imports: [PrismaModule],
})
export class ArtistModule {}

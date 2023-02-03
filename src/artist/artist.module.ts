import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  // imports: [
  //   forwardRef(() => TrackModule),
  //   forwardRef(() => AlbumModule),
  //   forwardRef(() => FavsModule),
  // ],
  exports: [ArtistService],
})
export class ArtistModule {}

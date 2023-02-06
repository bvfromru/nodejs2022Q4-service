import { Module, forwardRef } from '@nestjs/common';
import { AlbumModule } from 'src/album/album.module';
import { ArtistModule } from 'src/artist/artist.module';
import { FavsModule } from 'src/favs/favs.module';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [
    forwardRef(() => ArtistModule),
    forwardRef(() => FavsModule),
    forwardRef(() => AlbumModule),
  ],
  exports: [TrackService],
})
export class TrackModule {}

import { Module, forwardRef } from '@nestjs/common';
import { FavsModule } from 'src/favs/favs.module';
import { TrackModule } from 'src/track/track.module';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [forwardRef(() => FavsModule), forwardRef(() => TrackModule)],
  exports: [AlbumService],
})
export class AlbumModule {}

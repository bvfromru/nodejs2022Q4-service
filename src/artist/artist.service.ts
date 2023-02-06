import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ERROR_MESSAGES } from 'src/constants';
import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}
  public artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto) {
    const artist: Artist = {
      ...createArtistDto,
      id: uuidv4(),
    };
    this.artists.push(artist);
    return artist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException(
        ERROR_MESSAGES.artistNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    let artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new HttpException(
        ERROR_MESSAGES.artistNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    const { name, grammy } = updateArtistDto;
    artist = { ...artist, name, grammy };
    return artist;
  }

  remove(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException(
        ERROR_MESSAGES.artistNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    this.albumService.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    this.trackService.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    if (this.favsService.favs.artists.includes(id)) {
      this.favsService.removeArtist(id);
    }
    this.artists = this.artists.filter((artist) => artist.id !== id);
  }
}

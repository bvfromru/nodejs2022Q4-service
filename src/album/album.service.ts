import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  public albums: Album[] = [];
  create(createAlbumDto: CreateAlbumDto) {
    const album: Album = {
      ...createAlbumDto,
      id: uuidv4(),
    };
    this.albums.push(album);
    return album;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException(
        ERROR_MESSAGES.albumNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    let album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new HttpException(
        ERROR_MESSAGES.albumNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    album = { ...album, ...updateAlbumDto };
    return album;
  }

  remove(id: string) {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException(
        ERROR_MESSAGES.albumNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    this.trackService.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
    if (this.favsService.favs.albums.includes(id)) {
      this.favsService.removeAlbum(id);
    }
    this.albums = this.albums.filter((album) => album.id !== id);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];
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
    this.albums = this.albums.filter((album) => album.id !== id);
  }
}

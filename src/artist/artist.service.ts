import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

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
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new HttpException(
        ERROR_MESSAGES.artistNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    artist.grammy = updateArtistDto.grammy;
    artist.name = updateArtistDto.name;
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
    this.artists = this.artists.filter((artist) => artist.id !== id);
  }
}

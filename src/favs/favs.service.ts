import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/constants';
import { TrackService } from 'src/track/track.service';
import { Favorites } from './favs.interface';

@Injectable()
export class FavsService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  public favs: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  findAll() {
    const albums = this.albumService.findAll();
    const tracks = this.trackService.findAll();
    const artists = this.artistService.findAll();
    return {
      albums: albums.filter((album) => this.favs.albums.includes(album.id)),
      tracks: tracks.filter((track) => this.favs.tracks.includes(track.id)),
      artists: artists.filter((album) => this.favs.artists.includes(album.id)),
    };
  }

  addTrack(id: string) {
    const tracks = this.trackService.findAll();
    if (!tracks.find((track) => track.id === id)) {
      throw new HttpException(
        ERROR_MESSAGES.trackNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favs.tracks.push(id);
    return SUCCESS_MESSAGES.addTrack;
  }

  removeTrack(id: string) {
    if (!this.favs.tracks.includes(id)) {
      throw new HttpException(
        ERROR_MESSAGES.trackIsNotFavorite,
        HttpStatus.NOT_FOUND,
      );
    }
    this.favs.tracks = this.favs.tracks.filter((i) => i !== id);
    return SUCCESS_MESSAGES.removeTrack;
  }

  addAlbum(id: string) {
    const albums = this.albumService.findAll();
    if (!albums.find((album) => album.id === id)) {
      throw new HttpException(
        ERROR_MESSAGES.albumNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favs.albums.push(id);
    return SUCCESS_MESSAGES.addAlbum;
  }

  removeAlbum(id: string) {
    if (!this.favs.albums.includes(id)) {
      throw new HttpException(
        ERROR_MESSAGES.albumIsNotFavorite,
        HttpStatus.NOT_FOUND,
      );
    }
    this.favs.albums = this.favs.albums.filter((i) => i !== id);
    return SUCCESS_MESSAGES.removeAlbum;
  }

  addArtist(id: string) {
    const artists = this.artistService.findAll();
    if (!artists.find((artist) => artist.id === id)) {
      throw new HttpException(
        ERROR_MESSAGES.artistNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favs.artists.push(id);
    return SUCCESS_MESSAGES.addArtist;
  }

  removeArtist(id: string) {
    if (!this.favs.artists.includes(id)) {
      throw new HttpException(
        ERROR_MESSAGES.artistIsNotFavorite,
        HttpStatus.NOT_FOUND,
      );
    }
    this.favs.artists = this.favs.artists.filter((i) => i !== id);
    return SUCCESS_MESSAGES.removeArtist;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './track.interface';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto) {
    const track: Track = {
      ...createTrackDto,
      id: uuidv4(),
    };
    this.tracks.push(track);
    return track;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException(
        ERROR_MESSAGES.trackNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    let track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new HttpException(
        ERROR_MESSAGES.trackNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    track = { ...track, ...updateTrackDto };
    return track;
  }

  remove(id: string) {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException(
        ERROR_MESSAGES.trackNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    this.tracks = this.tracks.filter((track) => track.id !== id);
  }
}

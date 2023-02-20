import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { PrismaService } from 'src/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  // constructor(
  //   @Inject(forwardRef(() => ArtistService))
  //   private readonly artistService: ArtistService,
  //   @Inject(forwardRef(() => FavsService))
  //   private readonly favsService: FavsService,
  //   @Inject(forwardRef(() => AlbumService))
  //   private readonly albumService: AlbumService,
  // ) {}
  // public tracks: Track[] = [];

  async create(createTrackDto: CreateTrackDto) {
    // const track: Track = {
    //   ...createTrackDto,
    //   id: uuidv4(),
    // };
    // this.tracks.push(track);
    // return track;
    return await this.prisma.track.create({ data: createTrackDto });
  }

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new HttpException(
        ERROR_MESSAGES.trackNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    // const track = await this.prisma.track.
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: updateTrackDto,
      });
    } catch {
      throw new HttpException(
        ERROR_MESSAGES.trackNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    // let track = await this.tracks.find((track) => track.id === id);
    // if (!track) {
    // }
    // track = { ...track, ...updateTrackDto };
    // return track;
  }

  async remove(id: string) {
    try {
      await this.prisma.track.delete({ where: { id } });
    } catch {
      throw new HttpException(
        ERROR_MESSAGES.trackNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    // const track = await this.tracks.find((track) => track.id === id);
    // if (!track) {
    // }
    // if (this.favsService.favs.tracks.includes(id)) {
    //   this.favsService.removeTrack(id);
    // }
    // this.tracks = this.tracks.filter((track) => track.id !== id);
  }
}

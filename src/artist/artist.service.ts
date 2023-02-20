import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { PrismaService } from 'src/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  // constructor(
  //   @Inject(forwardRef(() => AlbumService))
  //   private readonly albumService: AlbumService,
  //   @Inject(forwardRef(() => TrackService))
  //   private readonly trackService: TrackService,
  //   @Inject(forwardRef(() => FavsService))
  //   private readonly favsService: FavsService,
  // ) {}
  // public artists: Artist[] = [];

  async create(createArtistDto: CreateArtistDto) {
    // const artist: Artist = {
    //   ...createArtistDto,
    //   id: uuidv4(),
    // };
    return await this.prisma.artist.create({ data: createArtistDto });
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new HttpException(
        ERROR_MESSAGES.artistNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    try {
      return await this.prisma.artist.update({
        where: { id },
        data: updateArtistDto,
      });
    } catch {
      throw new HttpException(
        ERROR_MESSAGES.artistNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    // let artist = await this.artists.find((artist) => artist.id === id);

    // if (!artist) {
    // }
    // const { name, grammy } = updateArtistDto;
    // artist = { ...artist, name, grammy };
    // return artist;
  }

  async remove(id: string) {
    // const artist = await this.artists.find((artist) => artist.id === id);
    try {
      await this.prisma.artist.delete({ where: { id } });
    } catch {
      throw new HttpException(
        ERROR_MESSAGES.artistNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    // if (!artist) {
    // }
    // this.albumService.albums.forEach((album) => {
    //   if (album.artistId === id) {
    //     album.artistId = null;
    //   }
    // });
    // this.trackService.tracks.forEach((track) => {
    //   if (track.artistId === id) {
    //     track.artistId = null;
    //   }
    // });
    // if (this.favsService.favs.artists.includes(id)) {
    //   this.favsService.removeArtist(id);
    // }
    // this.artists = this.artists.filter((artist) => artist.id !== id);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { PrismaService } from 'src/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}
  // constructor(
  //   @Inject(forwardRef(() => FavsService))
  //   private readonly favsService: FavsService,
  //   @Inject(forwardRef(() => TrackService))
  //   private readonly trackService: TrackService,
  // ) {}

  // public albums: Album[] = [];

  async create(createAlbumDto: CreateAlbumDto) {
    // const album: Album = {
    //   ...createAlbumDto,
    //   id: uuidv4(),
    // };
    return await this.prisma.album.create({ data: createAlbumDto });
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new HttpException(
        ERROR_MESSAGES.albumNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    // const album = await this.prisma.album.findUnique({ where: { id } });

    // if (!album) {
    //   throw new HttpException(
    //     ERROR_MESSAGES.albumNotFound,
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
    // album = { ...album, ...updateAlbumDto };
    // return await album;
    try {
      await this.prisma.album.update({ where: { id }, data: updateAlbumDto });
    } catch {
      new HttpException(ERROR_MESSAGES.albumNotFound, HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string) {
    // const album = await this.prisma.album.findUnique({ where: { id } });
    // if (!album) {
    try {
      await this.prisma.album.delete({ where: { id } });
    } catch {
      throw new HttpException(
        ERROR_MESSAGES.albumNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    // }
    // this.trackService.tracks.forEach((track) => {
    //   if (track.albumId === id) {
    //     track.albumId = null;
    //   }
    // });
    // if (this.favsService.favs.albums.includes(id)) {
    //   this.favsService.removeAlbum(id);
    // }
    // this.albums = this.albums.filter((album) => album.id !== id);
  }
}

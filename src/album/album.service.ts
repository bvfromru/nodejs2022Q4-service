import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { PrismaService } from 'src/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
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
    try {
      await this.prisma.album.update({ where: { id }, data: updateAlbumDto });
    } catch {
      new HttpException(ERROR_MESSAGES.albumNotFound, HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.album.delete({ where: { id } });
    } catch {
      throw new HttpException(
        ERROR_MESSAGES.albumNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

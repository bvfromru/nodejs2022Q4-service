import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ERROR_MESSAGES } from 'src/utils/constants';
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
      throw new NotFoundException(ERROR_MESSAGES.albumNotFound);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: updateAlbumDto,
      });
    } catch {
      throw new NotFoundException(ERROR_MESSAGES.albumNotFound);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.album.delete({ where: { id } });
    } catch {
      throw new NotFoundException(ERROR_MESSAGES.albumNotFound);
    }
  }
}

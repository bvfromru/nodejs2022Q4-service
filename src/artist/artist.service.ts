import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { PrismaService } from 'src/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    return await this.prisma.artist.create({ data: createArtistDto });
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException(ERROR_MESSAGES.artistNotFound);
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
      throw new NotFoundException(ERROR_MESSAGES.artistNotFound);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.artist.delete({ where: { id } });
    } catch {
      throw new NotFoundException(ERROR_MESSAGES.artistNotFound);
    }
  }
}

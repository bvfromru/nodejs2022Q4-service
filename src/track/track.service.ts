import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { PrismaService } from 'src/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto) {
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
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const [item] = await this.prisma.favorites.findMany({
      select: {
        albums: {
          select: { id: true, name: true, year: true, artistId: true },
        },
        artists: {
          select: { id: true, name: true, grammy: true },
        },
        tracks: {
          select: {
            id: true,
            name: true,
            duration: true,
            artistId: true,
            albumId: true,
          },
        },
      },
    });
    return item;
  }

  async addItem(type: string, id: string) {
    const item = await this.prisma[type].findFirst({ where: { id } });

    if (!item) {
      throw new HttpException(
        ERROR_MESSAGES.idDoesntExist,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorites = await this.prisma.favorites.findMany();

    if (!favorites.length) {
      const createdFavs = await this.prisma.favorites.create({ data: {} });
      await this.prisma[type].update({
        where: { id },
        data: { favoriteId: createdFavs.id },
      });
    } else {
      await this.prisma[type].update({
        where: { id },
        data: { favoriteId: favorites[0].id },
      });
    }
    return item;
  }

  async removeItem(type: string, id: string) {
    try {
      await this.prisma[type].update({
        where: { id },
        data: { favoriteId: { set: null } },
      });
    } catch (error) {
      throw new HttpException(ERROR_MESSAGES.idNotFound, HttpStatus.NOT_FOUND);
    }
  }
}

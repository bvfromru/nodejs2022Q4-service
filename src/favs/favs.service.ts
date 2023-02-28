import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ERROR_MESSAGES } from 'src/utils/constants';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const item = await this.prisma.favorites.findFirst({
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

    if (!item) {
      return {
        albums: [],
        artists: [],
        tracks: [],
      };
    }
    return item;
  }

  async addItem(type: string, id: string) {
    const item = await this.prisma[type].findFirst({ where: { id } });

    if (!item) {
      throw new UnprocessableEntityException(ERROR_MESSAGES.idDoesntExist);
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
      throw new NotFoundException(ERROR_MESSAGES.idNotFound);
    }
  }
}

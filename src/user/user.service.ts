import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // private users: User[] = [];

  async create(createUserDto: CreateUserDto) {
    // const timestamp = Date.now();
    const user: User = {
      ...createUserDto,
      // id: uuidv4(),
      // version: 1,
      // createdAt: timestamp,
      // updatedAt: timestamp,
    };
    const data = await this.prisma.user.create({ data: user });
    const userEntity = new UserEntity(data);
    // this.users.push(user);
    return userEntity;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserEntity(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(
        ERROR_MESSAGES.userNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    const userEntity = new UserEntity(user);
    return userEntity;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    let user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException(
        ERROR_MESSAGES.userNotFound,
        HttpStatus.NOT_FOUND,
      );
    }

    const { oldPassword, newPassword } = updatePasswordDto;

    if (user.password !== oldPassword) {
      throw new HttpException(
        ERROR_MESSAGES.wrongPassword,
        HttpStatus.FORBIDDEN,
      );
    }

    const newVersion = user.version + 1;
    const timestamp = new Date();
    user.password = newPassword;
    user = {
      ...user,
      version: newVersion,
      updatedAt: timestamp,
    };
    const userData = await this.prisma.user.update({
      where: { id },
      data: user,
    });
    const userEntity = new UserEntity(userData);
    return userEntity;
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch {
      throw new HttpException(
        ERROR_MESSAGES.userNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

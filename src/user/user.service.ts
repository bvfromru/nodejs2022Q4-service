import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { hashData } from 'src/utils/helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(public prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    // const userExists = await this.prisma.user.findFirst({
    //   where: { login },
    // });
    // if (userExists) {
    //   throw new BadRequestException(ERROR_MESSAGES.userAlreadyExists);
    // }
    const hash = await hashData(password);
    const data = await this.prisma.user.create({
      data: { ...createUserDto, password: hash },
    });
    const userEntity = new UserEntity(data);
    return userEntity;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserEntity(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.userNotFound);
    }
    const userEntity = new UserEntity(user);
    return userEntity;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    let user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.userNotFound);
    }

    const { oldPassword, newPassword } = updatePasswordDto;
    const passwordMatches = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatches) {
      throw new ForbiddenException(ERROR_MESSAGES.wrongPassword);
    }

    const newVersion = user.version + 1;
    const timestamp = new Date();
    const newHashedPassword = await hashData(newPassword);
    user.password = newHashedPassword;
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
      throw new NotFoundException(ERROR_MESSAGES.userNotFound);
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './user.interface';

@Injectable()
export class UserService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const timestamp = Date.now();
    const user: User = {
      ...createUserDto,
      id: uuidv4(),
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException(
        ERROR_MESSAGES.userNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto) {
    let user = this.users.find((user) => user.id === id);

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
    const timestamp = Date.now();
    user.password = newPassword;
    user = {
      ...user,
      version: newVersion,
      updatedAt: timestamp,
    };
    return user;
  }

  remove(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException(
        ERROR_MESSAGES.userNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    this.users = this.users.filter((user) => user.id !== id);
  }
}

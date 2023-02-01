import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './user.interface';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

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
    // return db.users.create(createUserDto);
  }

  findAll() {
    return this.users;
    // return db.users.findAll();
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (user) return user;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const timestamp = Date.now();
    const user = this.users.find((user) => user.id === id);
    user.password = updatePasswordDto.newPassword;
    user.version = user.version + 1;
    user.updatedAt = timestamp;
    return user;
    // return db.users.updatePassword(updatePasswordDto);
  }

  remove(id: string) {
    this.users.filter((user) => user.id === id);
  }
}

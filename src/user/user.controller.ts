import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto): UserEntity {
    return new UserEntity(this.userService.create(createUserDto));
  }

  @Get()
  findAll(): UserEntity[] {
    return this.userService.findAll().map((user) => new UserEntity(user));
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): UserEntity {
    return new UserEntity(this.userService.findOne(id));
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updatePasswordDto: UpdatePasswordDto,
  ): UserEntity {
    return new UserEntity(this.userService.update(id, updatePasswordDto));
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}

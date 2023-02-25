import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(signupAuthDto: SignupAuthDto) {
    const data = await this.prisma.user.create({ data: signupAuthDto });
    const userEntity = new UserEntity(data);
    return userEntity;
  }

  async login(loginAuthDto: LoginAuthDto) {
    return `This action returns all auth`;
  }

  async refresh(refreshAuthDto: RefreshAuthDto) {
    return `This action returns a auth`;
  }
}

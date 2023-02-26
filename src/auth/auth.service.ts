import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CRYPT_SALT } from 'src/main';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { ERROR_MESSAGES } from 'utils/constants';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async signup(signupAuthDto: SignupAuthDto) {
    const { login, password } = signupAuthDto;
    const userExists = await this.prisma.user.findFirst({
      where: { login },
    });
    if (userExists) {
      throw new BadRequestException(ERROR_MESSAGES.userAlreadyExists);
    }

    const hash = await this.hashData(password);
    const newUser = await this.userService.create({
      ...signupAuthDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser._id, newUser.login);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  async login(loginAuthDto: LoginAuthDto) {
    return `This action returns all auth`;
  }

  async refresh(refreshAuthDto: RefreshAuthDto) {
    return `This action returns a auth`;
  }

  private hashData = async (data: string) => bcrypt.hash(data, CRYPT_SALT);

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async getTokens(userId: string, login: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          login,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          login,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}

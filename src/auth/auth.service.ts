import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { hashData } from 'src/utils/helpers';
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
    return await this.userService.create(signupAuthDto);
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { login, password } = loginAuthDto;
    const user = await this.prisma.user.findFirst({
      where: { login },
    });
    if (!user) throw new BadRequestException(ERROR_MESSAGES.authDataIncorrect);
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new BadRequestException(ERROR_MESSAGES.authDataIncorrect);
    }
    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(refreshAuthDto: RefreshAuthDto) {
    const { refreshToken } = refreshAuthDto;
    try {
      const decodedToken = this.jwtService.decode(refreshToken) as {
        userId: string;
        login: string;
      };
      const user = await this.prisma.user.findUnique({
        where: { id: decodedToken.userId },
      });
      if (!user || !user.refreshToken) {
        throw new ForbiddenException(ERROR_MESSAGES.accessDenied);
      }
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!refreshTokenMatches)
        throw new ForbiddenException(ERROR_MESSAGES.accessDenied);
      const tokens = await this.getTokens(user.id, user.login);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch {
      throw new ForbiddenException(ERROR_MESSAGES.accessDenied);
    }
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await hashData(refreshToken);
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async getTokens(userId: string, login: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          login,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME'),
        },
      ),
      this.jwtService.signAsync(
        {
          userId,
          login,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
          expiresIn: this.configService.get<string>(
            'TOKEN_REFRESH_EXPIRE_TIME',
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}

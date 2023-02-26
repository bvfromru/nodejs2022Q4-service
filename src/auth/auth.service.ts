import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CRYPT_SALT } from 'src/main';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ERROR_MESSAGES } from 'src/utils/constants';
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
    const { password } = signupAuthDto;

    const hash = await this.hashData(password);
    return await this.userService.create({
      ...signupAuthDto,
      password: hash,
    });
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { login, password } = loginAuthDto;
    const user = await this.prisma.user.findFirst({
      where: { login },
    });
    if (!user) throw new BadRequestException(ERROR_MESSAGES.authDataIncorrect);
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches)
      throw new BadRequestException(ERROR_MESSAGES.authDataIncorrect);
    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(refreshAuthDto: RefreshAuthDto) {
    const { refreshToken } = refreshAuthDto;
    const decodedToken = this.jwtService.decode(refreshToken) as {
      id: string;
      login: string;
    };
    const user = await this.prisma.user.findUnique({
      where: { id: decodedToken.id },
    });
    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private hashData = async (data: string) => bcrypt.hash(data, CRYPT_SALT);

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async getTokens(id: string, login: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          login,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME'),
        },
      ),
      this.jwtService.signAsync(
        {
          id,
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

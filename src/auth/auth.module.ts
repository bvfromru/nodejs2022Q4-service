import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY, TOKEN_EXPIRE_TIME } from 'src/main';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { AccessTokenStrategy } from '../common/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '../common/strategies/refreshToken.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  imports: [
    UserModule,
    PrismaModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: TOKEN_EXPIRE_TIME },
    }),
  ],
})
export class AuthModule {}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupAuthDto: SignupAuthDto) {
    return this.authService.signup(signupAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('refresh')
  refresh(@Body() refreshAuthDto: RefreshAuthDto) {
    return this.authService.refresh(refreshAuthDto);
  }
}

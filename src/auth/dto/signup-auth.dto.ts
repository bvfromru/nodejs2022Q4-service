import { IsString } from 'class-validator';

export class SignupAuthDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}

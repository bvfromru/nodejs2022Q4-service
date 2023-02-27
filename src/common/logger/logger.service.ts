import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class CustomLogger implements LoggerService {
  private logLevel: number;

  constructor(private configService: ConfigService) {
    this.logLevel = configService.get<number>('LOGGER_LEVEL');
  }

  log(message: any, ...optionalParams: any[]) {
    console.log('\x1b[32m', message, '\x1b[37m');
  }

  error(message: any, ...optionalParams: any[]) {
    console.log('\x1b[31m', message, '\x1b[37m');
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log('\x1b[33m', message, '\x1b[37m');
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.log(message, '\x1b[37m');
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.log('\x1b[34m', message, '\x1b[37m');
  }

  // write(message: any) {
  //   console.log(message, type);
  // }
}

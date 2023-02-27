import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_LOGGER_LEVEL } from 'src/utils/constants';

export class CustomLogger implements LoggerService {
  private logLevel: number;

  constructor(private configService: ConfigService) {
    this.logLevel =
      configService.get<number>('LOGGER_LEVEL') || DEFAULT_LOGGER_LEVEL;
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 0) {
      console.log('\x1b[31m', message, '\x1b[37m');
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 1) {
      console.log('\x1b[33m', message, '\x1b[37m');
    }
  }

  log(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 2) {
      console.log('\x1b[32m', message, '\x1b[37m');
    }
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 4) {
      console.log(message, '\x1b[37m');
    }
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 5) {
      console.log('\x1b[34m', message, '\x1b[37m');
    }
  }

  // write(message: any) {
  //   console.log(message, type);
  // }
}

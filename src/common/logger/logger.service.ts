import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class CustomLogger implements LoggerService {
  private logLevel: number;

  constructor(private configService: ConfigService) {
    this.logLevel = configService.get<number>('LOGGER_LEVEL');
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    console.log(message);
  }
}

import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { appendFileSync, mkdirSync, renameSync, statSync } from 'fs';
import { join } from 'path';
import {
  DEFAULT_LOGGER_LEVEL,
  DEFAULT_MAX_FILE_SIZE_KB,
  LOG_DIR,
  LOG_ERR_DIR,
} from 'src/utils/constants';

export class CustomLogger implements LoggerService {
  private logLevel: number;
  private maxFileSize: number;
  private pathToLogs = join(process.cwd(), LOG_DIR);
  private pathToErrorLogs = join(process.cwd(), LOG_ERR_DIR);

  constructor(private configService: ConfigService) {
    this.logLevel =
      configService.get<number>('LOGGER_LEVEL') || DEFAULT_LOGGER_LEVEL;
    this.maxFileSize =
      configService.get<number>('MAX_FILE_SIZE_KB') * 1024 ||
      DEFAULT_MAX_FILE_SIZE_KB * 1024;
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 0) {
      console.log('\x1b[31m', message, '\x1b[37m');
      this.writeErrorLog(message);
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 1) {
      console.log('\x1b[33m', message, '\x1b[37m');
      this.writeLog(message);
    }
  }

  log(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 2) {
      console.log('\x1b[32m', message, '\x1b[37m');
      this.writeLog(message);
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

  private writeLog(message: string) {
    const formattedMessage = `${message}\n`;
    const filename = join(this.pathToLogs, 'log-current.log');
    mkdirSync(this.pathToLogs, { recursive: true });
    this.renameLogFile(filename);
    appendFileSync(filename, formattedMessage);
  }

  private writeErrorLog(message: string) {
    const formattedMessage = `${message}\n`;
    const filename = join(this.pathToErrorLogs, 'error-log-current.log');
    mkdirSync(this.pathToErrorLogs, { recursive: true });
    this.renameLogFile(filename);
    appendFileSync(filename, formattedMessage);
  }

  private renameLogFile(filename: string) {
    try {
      const stats = statSync(filename);
      if (stats.size > this.maxFileSize) {
        const newFilename = filename.replace(
          /current.log$/,
          `${new Date().getTime()}.log`,
        );
        renameSync(filename, newFilename);
      }
    } catch (err) {}
  }
}

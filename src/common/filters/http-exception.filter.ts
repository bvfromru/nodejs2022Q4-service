import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_MESSAGES } from 'src/utils/constants';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('ExceptionLogger');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = isHttpException
      ? exception.message
      : ERROR_MESSAGES.serverError;
    const path = request.url;
    const timestamp = new Date().toISOString();

    this.logger.error(
      `Time: ${timestamp}; Path: ${path}; Status code: ${status}; Message: ${message}`,
    );

    response.status(status).json({
      statusCode: status,
      message,
      timestamp,
      path,
    });
  }
}

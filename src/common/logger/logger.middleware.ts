import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('RequestLogger');

  use(req: Request, res: Response, next: NextFunction) {
    const { url, query, body, method } = req;
    if (body.password) {
      body.password = '***';
    }

    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      const time = new Date().getTime();
      const message = `Time: ${time}; Method: ${method}; URL: ${url}; Query: ${JSON.stringify(
        query,
      )}; Body: ${JSON.stringify(
        body,
      )}; Status code: ${statusCode}; Response: ${JSON.stringify(
        statusMessage,
      )}`;

      if (statusCode < 400) {
        this.logger.log(message);
      } else if (statusCode < 500) {
        this.logger.warn(message);
      } else {
        this.logger.error(message);
      }
    });

    next();
  }
}

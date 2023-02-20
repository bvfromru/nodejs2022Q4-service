import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class UserDateInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((user) => {
            const res = { ...user };
            if (user?.createdAt) {
              res.createdAt = user.createdAt.getTime();
            }
            if (user?.updatedAt) {
              res.updatedAt = user.updatedAt.getTime();
            }
            return res;
          });
        } else {
          const res = { ...data };
          if (data?.createdAt) {
            res.createdAt = data.createdAt.getTime();
          }
          if (data?.updatedAt) {
            res.updatedAt = data.updatedAt.getTime();
          }
          return res;
        }
      }),
    );
  }
}

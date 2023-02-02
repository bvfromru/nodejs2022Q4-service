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
export class UserPasswordInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((user) => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          });
        } else {
          const { password, ...dataWithoutPassword } = data;
          return dataWithoutPassword;
        }
      }),
    );
  }
}

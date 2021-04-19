import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  ok: boolean;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        let result;
        if (typeof data == 'string') {
          result = {
            ok: true,
            message: data,
            data: {},
          };
        } else {
          result = {
            ok: true,
            data,
          };
        }
        return result;
      }),
    );
  }
}

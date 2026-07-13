import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface ResponseFormat<T> {
  status: string;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const requestId = (req.headers['x-request-id'] as string) || '';

    return next.handle().pipe(
      map((data: T) => ({
        status: 'success',
        data,
        meta: {
          requestId,
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StructuredLogger } from '../services/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: StructuredLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const method = request.method;
    const url = request.url;

    this.logger.log(`Incoming request: ${method} ${url}`, 'HTTP');

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          this.logger.log(`Request completed successfully: ${method} ${url} - duration: ${duration}ms`, 'HTTP');
        },
        error: (err: any) => {
          const duration = Date.now() - start;
          this.logger.error(`Request failed: ${method} ${url} - duration: ${duration}ms`, err.stack || err.message, 'HTTP');
        }
      })
    );
  }
}

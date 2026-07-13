import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TelemetryService } from '../services/telemetry.service';

@Injectable()
export class TelemetryInterceptor implements NestInterceptor {
  constructor(private readonly telemetryService: TelemetryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = (Date.now() - start) / 1000;
          const method = request.method;
          const route = request.route?.path || request.url;
          this.telemetryService.increment('http_requests_total', 1, { method, route, status: '200' });
          this.telemetryService.recordHistogram('http_request_duration_seconds', duration, { method, route });
        },
        error: (err: any) => {
          const duration = (Date.now() - start) / 1000;
          const method = request.method;
          const route = request.route?.path || request.url;
          const status = err.status || '500';
          this.telemetryService.increment('http_requests_total', 1, { method, route, status: status.toString() });
          this.telemetryService.increment('http_errors_total', 1, { status: status.toString() });
          this.telemetryService.recordHistogram('http_request_duration_seconds', duration, { method, route });
        }
      })
    );
  }
}

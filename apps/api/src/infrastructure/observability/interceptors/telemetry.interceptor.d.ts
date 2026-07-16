import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TelemetryService } from '../services/telemetry.service';
export declare class TelemetryInterceptor implements NestInterceptor {
    private readonly telemetryService;
    constructor(telemetryService: TelemetryService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}

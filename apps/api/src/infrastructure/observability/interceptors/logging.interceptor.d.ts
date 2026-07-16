import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StructuredLogger } from '../services/logger.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly logger;
    constructor(logger: StructuredLogger);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}

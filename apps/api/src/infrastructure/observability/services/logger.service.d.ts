import { LoggerService } from '@nestjs/common';
import { CorrelationService } from './correlation.service';
export declare class StructuredLogger implements LoggerService {
    private readonly correlationService;
    constructor(correlationService: CorrelationService);
    log(message: any, context?: string): void;
    error(message: any, trace?: string, context?: string): void;
    warn(message: any, context?: string): void;
    debug?(message: any, context?: string): void;
    verbose?(message: any, context?: string): void;
    fatal(message: any, context?: string): void;
    private printLog;
}

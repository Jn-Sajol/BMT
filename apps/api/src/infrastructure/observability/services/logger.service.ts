import { Injectable, LoggerService } from '@nestjs/common';
import { CorrelationService } from './correlation.service';

@Injectable()
export class StructuredLogger implements LoggerService {
  constructor(private readonly correlationService: CorrelationService) {}

  log(message: any, context?: string) {
    this.printLog('INFO', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.printLog('ERROR', message, context, { stack: trace });
  }

  warn(message: any, context?: string) {
    this.printLog('WARN', message, context);
  }

  debug?(message: any, context?: string) {
    this.printLog('DEBUG', message, context);
  }

  verbose?(message: any, context?: string) {
    this.printLog('TRACE', message, context);
  }

  fatal(message: any, context?: string) {
    this.printLog('FATAL', message, context);
  }

  private printLog(level: string, message: any, context?: string, extraMetadata?: Record<string, any>) {
    const correlationId = this.correlationService.getCorrelationId();
    const workspaceId = this.correlationService.getWorkspaceId();
    const userId = this.correlationService.getUserId();
    const requestId = this.correlationService.getRequestId();

    const logPayload = {
      timestamp: new Date().toISOString(),
      level,
      service: 'bmt-api',
      module: context || 'Application',
      correlationId,
      workspaceId: workspaceId || null,
      userId: userId || null,
      requestId: requestId || null,
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      metadata: extraMetadata || {},
    };

    console.log(JSON.stringify(logPayload));
  }
}

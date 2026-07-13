import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '../exceptions/base.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = (request.headers['x-request-id'] as string) || '';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: any = [];

    if (exception instanceof BaseException) {
      status = exception.status;
      message = exception.message;
      code = exception.code;
      details = exception.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (responseBody && typeof responseBody === 'object') {
        const bodyObj = responseBody as any;
        message = bodyObj.message || message;
        code = bodyObj.error || code;
        details = bodyObj.message ? (Array.isArray(bodyObj.message) ? bodyObj.message : [bodyObj.message]) : [];
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      code = exception.name.toUpperCase();
    }

    console.error(`[Error] Request-ID: ${requestId} | Code: ${code} | Message: ${message}`, exception);

    response.status(status).json({
      status: 'error',
      error: {
        code,
        message,
        details,
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

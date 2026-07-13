import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';

export class NotFoundException extends BaseException {
  constructor(message = 'Resource not found', details: string[] = []) {
    super(message, ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}

export class BadRequestException extends BaseException {
  constructor(message = 'Bad request', details: string[] = []) {
    super(message, ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST, details);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message = 'Unauthorized access', details: string[] = []) {
    super(message, ErrorCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, details);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message = 'Access forbidden', details: string[] = []) {
    super(message, ErrorCode.FORBIDDEN, HttpStatus.FORBIDDEN, details);
  }
}

export class ConflictException extends BaseException {
  constructor(message = 'Conflict detected', details: string[] = []) {
    super(message, ErrorCode.CONFLICT, HttpStatus.CONFLICT, details);
  }
}

export class ValidationException extends BaseException {
  constructor(details: string[] = [], message = 'Validation failed') {
    super(message, ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST, details);
  }
}

export class LimitExceededException extends BaseException {
  constructor(message = 'Action limit exceeded', details: string[] = []) {
    super(message, ErrorCode.LIMIT_EXCEEDED, HttpStatus.TOO_MANY_REQUESTS, details);
  }
}

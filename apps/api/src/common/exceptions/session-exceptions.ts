import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';

export class SessionExpiredException extends BaseException {
  constructor() {
    super(
      `Session has expired`,
      ErrorCode.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED
    );
  }
}

export class SessionInvalidException extends BaseException {
  constructor() {
    super(
      `Session is invalid`,
      ErrorCode.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED
    );
  }
}

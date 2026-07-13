import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super(
      `Invalid email address or password credentials provided`,
      ErrorCode.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED
    );
  }
}

export class EmailNotVerifiedException extends BaseException {
  constructor() {
    super(
      `Your email address has not been verified yet`,
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message = 'Unauthorized access') {
    super(
      message,
      ErrorCode.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED
    );
  }
}

export class AccountSuspendedException extends BaseException {
  constructor() {
    super(
      `This account has been suspended or deactivated`,
      ErrorCode.FORBIDDEN,
      HttpStatus.FORBIDDEN
    );
  }
}

export class TokenInvalidException extends BaseException {
  constructor() {
    super(
      `Provided authentication token is invalid or corrupt`,
      ErrorCode.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED
    );
  }
}

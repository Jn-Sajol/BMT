import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';

export class AlreadyVerifiedException extends BaseException {
  constructor(email: string) {
    super(
      `Email '${email}' is already verified`,
      ErrorCode.CONFLICT,
      HttpStatus.CONFLICT
    );
  }
}

export class InvalidTokenException extends BaseException {
  constructor() {
    super(
      `Verification token is invalid`,
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class ExpiredTokenException extends BaseException {
  constructor() {
    super(
      `Verification token has expired`,
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class VerificationUserNotFoundException extends BaseException {
  constructor(userId: string) {
    super(
      `User associated with verification request '${userId}' was not found`,
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
}

import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';

export class ResetTokenExpiredException extends BaseException {
  constructor() {
    super(
      `Password reset token has expired`,
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class ResetTokenInvalidException extends BaseException {
  constructor() {
    super(
      `Password reset token is invalid or has already been used`,
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class PasswordResetUserNotFoundException extends BaseException {
  constructor(identifier: string) {
    super(
      `User associated with password reset request '${identifier}' was not found`,
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
}

export class PasswordReuseException extends BaseException {
  constructor() {
    super(
      `New password cannot be the same as your previous password`,
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

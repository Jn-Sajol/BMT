import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';

export class UserAlreadyExistsException extends BaseException {
  constructor(email: string) {
    super(
      `User with email '${email}' already exists`,
      ErrorCode.CONFLICT,
      HttpStatus.CONFLICT
    );
  }
}

export class InvalidInvitationException extends BaseException {
  constructor(message = 'Invitation token is invalid or has expired') {
    super(
      message,
      ErrorCode.VALIDATION_ERROR,
      HttpStatus.BAD_REQUEST
    );
  }
}

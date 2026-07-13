import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';

export class InvalidPasswordException extends BaseException {
  constructor(message = 'Password does not meet complexity requirements') {
    super(
      message,
      ErrorCode.VALIDATION_ERROR,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class InvalidEmailException extends BaseException {
  constructor(message = 'Email address is not in a valid format') {
    super(
      message,
      ErrorCode.VALIDATION_ERROR,
      HttpStatus.BAD_REQUEST
    );
  }
}

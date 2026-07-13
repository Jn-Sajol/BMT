import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-codes';

export class BaseException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    public readonly status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly details: string[] = [],
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

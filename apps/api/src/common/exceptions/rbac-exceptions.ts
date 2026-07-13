import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';

export class RoleAlreadyExistsException extends BaseException {
  constructor(name: string) {
    super(
      `Role '${name}' already exists`,
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class PermissionAlreadyExistsException extends BaseException {
  constructor(actionKey: string) {
    super(
      `Permission for '${actionKey}' already exists`,
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class RoleNotFoundException extends BaseException {
  constructor(name: string) {
    super(
      `Role '${name}' was not found`,
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
}

export class PermissionNotFoundException extends BaseException {
  constructor(actionKey: string) {
    super(
      `Permission for '${actionKey}' was not found`,
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
}

export class ForbiddenPermissionException extends BaseException {
  constructor(required: string) {
    super(
      `Forbidden: Missing required authorization permission '${required}'`,
      ErrorCode.FORBIDDEN,
      HttpStatus.FORBIDDEN
    );
  }
}

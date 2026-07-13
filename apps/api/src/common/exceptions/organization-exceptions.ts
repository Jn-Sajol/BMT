import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';

export class OrganizationNotFoundException extends BaseException {
  constructor(identifier: string) {
    super(
      `Organization not found with identifier '${identifier}'`,
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
}

export class DuplicateSlugException extends BaseException {
  constructor(slug: string) {
    super(
      `Organization slug '${slug}' is already taken`,
      ErrorCode.CONFLICT,
      HttpStatus.CONFLICT
    );
  }
}

export class OwnerNotFoundException extends BaseException {
  constructor(userId: string) {
    super(
      `Owner user with ID '${userId}' does not exist`,
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class OrganizationArchivedException extends BaseException {
  constructor(id: string) {
    super(
      `Organization '${id}' is archived and cannot be modified`,
      ErrorCode.UNPROCESSABLE_ENTITY,
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}

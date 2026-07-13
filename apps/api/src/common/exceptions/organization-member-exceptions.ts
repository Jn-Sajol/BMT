import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';

export class OrganizationMemberNotFoundException extends BaseException {
  constructor(orgId: string, userId: string) {
    super(
      `User '${userId}' is not a member of organization '${orgId}'`,
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
}

export class DuplicateMembershipException extends BaseException {
  constructor(orgId: string, userId: string) {
    super(
      `User '${userId}' is already a member of organization '${orgId}'`,
      ErrorCode.CONFLICT,
      HttpStatus.CONFLICT
    );
  }
}

export class InvalidStatusTransitionException extends BaseException {
  constructor(from: string, to: string) {
    super(
      `Cannot transition membership status from '${from}' to '${to}'`,
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class OwnerRemovalException extends BaseException {
  constructor(userId: string, orgId: string) {
    super(
      `Cannot remove or alter membership of user '${userId}' because they are the owner of organization '${orgId}'`,
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

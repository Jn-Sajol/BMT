import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';

export class WorkspaceNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `Workspace not found with ID '${id}'`,
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
}

export class DuplicateWorkspaceSlugException extends BaseException {
  constructor(slug: string, orgId: string) {
    super(
      `Workspace slug '${slug}' is already taken inside organization '${orgId}'`,
      ErrorCode.CONFLICT,
      HttpStatus.CONFLICT
    );
  }
}

export class WorkspaceArchivedException extends BaseException {
  constructor(id: string) {
    super(
      `Workspace '${id}' is archived and cannot be modified`,
      ErrorCode.UNPROCESSABLE_ENTITY,
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}

export class WorkspaceMemberAlreadyExistsException extends BaseException {
  constructor(workspaceId: string, userId: string) {
    super(
      `User '${userId}' is already a member of workspace '${workspaceId}'`,
      ErrorCode.CONFLICT,
      HttpStatus.CONFLICT
    );
  }
}

export class WorkspaceMemberNotFoundException extends BaseException {
  constructor(workspaceId: string, userId: string) {
    super(
      `User '${userId}' is not a member of workspace '${workspaceId}'`,
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
}

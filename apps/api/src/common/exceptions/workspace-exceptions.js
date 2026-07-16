"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceMemberNotFoundException = exports.WorkspaceMemberAlreadyExistsException = exports.WorkspaceArchivedException = exports.DuplicateWorkspaceSlugException = exports.WorkspaceNotFoundException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
const error_codes_1 = require("./error-codes");
class WorkspaceNotFoundException extends base_exception_1.BaseException {
    constructor(id) {
        super(`Workspace not found with ID '${id}'`, error_codes_1.ErrorCode.NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.WorkspaceNotFoundException = WorkspaceNotFoundException;
class DuplicateWorkspaceSlugException extends base_exception_1.BaseException {
    constructor(slug, orgId) {
        super(`Workspace slug '${slug}' is already taken inside organization '${orgId}'`, error_codes_1.ErrorCode.CONFLICT, common_1.HttpStatus.CONFLICT);
    }
}
exports.DuplicateWorkspaceSlugException = DuplicateWorkspaceSlugException;
class WorkspaceArchivedException extends base_exception_1.BaseException {
    constructor(id) {
        super(`Workspace '${id}' is archived and cannot be modified`, error_codes_1.ErrorCode.UNPROCESSABLE_ENTITY, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
exports.WorkspaceArchivedException = WorkspaceArchivedException;
class WorkspaceMemberAlreadyExistsException extends base_exception_1.BaseException {
    constructor(workspaceId, userId) {
        super(`User '${userId}' is already a member of workspace '${workspaceId}'`, error_codes_1.ErrorCode.CONFLICT, common_1.HttpStatus.CONFLICT);
    }
}
exports.WorkspaceMemberAlreadyExistsException = WorkspaceMemberAlreadyExistsException;
class WorkspaceMemberNotFoundException extends base_exception_1.BaseException {
    constructor(workspaceId, userId) {
        super(`User '${userId}' is not a member of workspace '${workspaceId}'`, error_codes_1.ErrorCode.NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.WorkspaceMemberNotFoundException = WorkspaceMemberNotFoundException;
//# sourceMappingURL=workspace-exceptions.js.map
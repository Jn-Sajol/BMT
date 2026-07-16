import { BaseException } from './base.exception';
export declare class WorkspaceNotFoundException extends BaseException {
    constructor(id: string);
}
export declare class DuplicateWorkspaceSlugException extends BaseException {
    constructor(slug: string, orgId: string);
}
export declare class WorkspaceArchivedException extends BaseException {
    constructor(id: string);
}
export declare class WorkspaceMemberAlreadyExistsException extends BaseException {
    constructor(workspaceId: string, userId: string);
}
export declare class WorkspaceMemberNotFoundException extends BaseException {
    constructor(workspaceId: string, userId: string);
}

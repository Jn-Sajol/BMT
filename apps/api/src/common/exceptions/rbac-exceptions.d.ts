import { BaseException } from './base.exception';
export declare class RoleAlreadyExistsException extends BaseException {
    constructor(name: string);
}
export declare class PermissionAlreadyExistsException extends BaseException {
    constructor(actionKey: string);
}
export declare class RoleNotFoundException extends BaseException {
    constructor(name: string);
}
export declare class PermissionNotFoundException extends BaseException {
    constructor(actionKey: string);
}
export declare class ForbiddenPermissionException extends BaseException {
    constructor(required: string);
}

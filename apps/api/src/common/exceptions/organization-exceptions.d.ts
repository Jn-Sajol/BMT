import { BaseException } from './base.exception';
export declare class OrganizationNotFoundException extends BaseException {
    constructor(identifier: string);
}
export declare class DuplicateSlugException extends BaseException {
    constructor(slug: string);
}
export declare class OwnerNotFoundException extends BaseException {
    constructor(userId: string);
}
export declare class OrganizationArchivedException extends BaseException {
    constructor(id: string);
}

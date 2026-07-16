import { BaseException } from './base.exception';
export declare class OrganizationMemberNotFoundException extends BaseException {
    constructor(orgId: string, userId: string);
}
export declare class DuplicateMembershipException extends BaseException {
    constructor(orgId: string, userId: string);
}
export declare class InvalidStatusTransitionException extends BaseException {
    constructor(from: string, to: string);
}
export declare class OwnerRemovalException extends BaseException {
    constructor(userId: string, orgId: string);
}

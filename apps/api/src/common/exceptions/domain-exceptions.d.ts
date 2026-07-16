import { BaseException } from './base.exception';
export declare class UserAlreadyExistsException extends BaseException {
    constructor(email: string);
}
export declare class InvalidInvitationException extends BaseException {
    constructor(message?: string);
}

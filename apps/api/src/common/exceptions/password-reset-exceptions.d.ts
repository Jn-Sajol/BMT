import { BaseException } from './base.exception';
export declare class ResetTokenExpiredException extends BaseException {
    constructor();
}
export declare class ResetTokenInvalidException extends BaseException {
    constructor();
}
export declare class PasswordResetUserNotFoundException extends BaseException {
    constructor(identifier: string);
}
export declare class PasswordReuseException extends BaseException {
    constructor();
}

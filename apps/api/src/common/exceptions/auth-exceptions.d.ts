import { BaseException } from './base.exception';
export declare class InvalidCredentialsException extends BaseException {
    constructor();
}
export declare class EmailNotVerifiedException extends BaseException {
    constructor();
}
export declare class UnauthorizedException extends BaseException {
    constructor(message?: string);
}
export declare class AccountSuspendedException extends BaseException {
    constructor();
}
export declare class TokenInvalidException extends BaseException {
    constructor();
}

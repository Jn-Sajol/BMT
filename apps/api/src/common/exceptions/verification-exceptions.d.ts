import { BaseException } from './base.exception';
export declare class AlreadyVerifiedException extends BaseException {
    constructor(email: string);
}
export declare class InvalidTokenException extends BaseException {
    constructor();
}
export declare class ExpiredTokenException extends BaseException {
    constructor();
}
export declare class VerificationUserNotFoundException extends BaseException {
    constructor(userId: string);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInvalidException = exports.AccountSuspendedException = exports.UnauthorizedException = exports.EmailNotVerifiedException = exports.InvalidCredentialsException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
const error_codes_1 = require("./error-codes");
class InvalidCredentialsException extends base_exception_1.BaseException {
    constructor() {
        super(`Invalid email address or password credentials provided`, error_codes_1.ErrorCode.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
class EmailNotVerifiedException extends base_exception_1.BaseException {
    constructor() {
        super(`Your email address has not been verified yet`, error_codes_1.ErrorCode.BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.EmailNotVerifiedException = EmailNotVerifiedException;
class UnauthorizedException extends base_exception_1.BaseException {
    constructor(message = 'Unauthorized access') {
        super(message, error_codes_1.ErrorCode.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class AccountSuspendedException extends base_exception_1.BaseException {
    constructor() {
        super(`This account has been suspended or deactivated`, error_codes_1.ErrorCode.FORBIDDEN, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.AccountSuspendedException = AccountSuspendedException;
class TokenInvalidException extends base_exception_1.BaseException {
    constructor() {
        super(`Provided authentication token is invalid or corrupt`, error_codes_1.ErrorCode.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.TokenInvalidException = TokenInvalidException;
//# sourceMappingURL=auth-exceptions.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordReuseException = exports.PasswordResetUserNotFoundException = exports.ResetTokenInvalidException = exports.ResetTokenExpiredException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
const error_codes_1 = require("./error-codes");
class ResetTokenExpiredException extends base_exception_1.BaseException {
    constructor() {
        super(`Password reset token has expired`, error_codes_1.ErrorCode.BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ResetTokenExpiredException = ResetTokenExpiredException;
class ResetTokenInvalidException extends base_exception_1.BaseException {
    constructor() {
        super(`Password reset token is invalid or has already been used`, error_codes_1.ErrorCode.BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ResetTokenInvalidException = ResetTokenInvalidException;
class PasswordResetUserNotFoundException extends base_exception_1.BaseException {
    constructor(identifier) {
        super(`User associated with password reset request '${identifier}' was not found`, error_codes_1.ErrorCode.NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.PasswordResetUserNotFoundException = PasswordResetUserNotFoundException;
class PasswordReuseException extends base_exception_1.BaseException {
    constructor() {
        super(`New password cannot be the same as your previous password`, error_codes_1.ErrorCode.BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.PasswordReuseException = PasswordReuseException;
//# sourceMappingURL=password-reset-exceptions.js.map
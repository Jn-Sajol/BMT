"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidInvitationException = exports.UserAlreadyExistsException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
const error_codes_1 = require("./error-codes");
class UserAlreadyExistsException extends base_exception_1.BaseException {
    constructor(email) {
        super(`User with email '${email}' already exists`, error_codes_1.ErrorCode.CONFLICT, common_1.HttpStatus.CONFLICT);
    }
}
exports.UserAlreadyExistsException = UserAlreadyExistsException;
class InvalidInvitationException extends base_exception_1.BaseException {
    constructor(message = 'Invitation token is invalid or has expired') {
        super(message, error_codes_1.ErrorCode.VALIDATION_ERROR, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidInvitationException = InvalidInvitationException;
//# sourceMappingURL=domain-exceptions.js.map
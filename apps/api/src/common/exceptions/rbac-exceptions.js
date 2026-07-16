"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenPermissionException = exports.PermissionNotFoundException = exports.RoleNotFoundException = exports.PermissionAlreadyExistsException = exports.RoleAlreadyExistsException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
const error_codes_1 = require("./error-codes");
class RoleAlreadyExistsException extends base_exception_1.BaseException {
    constructor(name) {
        super(`Role '${name}' already exists`, error_codes_1.ErrorCode.BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.RoleAlreadyExistsException = RoleAlreadyExistsException;
class PermissionAlreadyExistsException extends base_exception_1.BaseException {
    constructor(actionKey) {
        super(`Permission for '${actionKey}' already exists`, error_codes_1.ErrorCode.BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.PermissionAlreadyExistsException = PermissionAlreadyExistsException;
class RoleNotFoundException extends base_exception_1.BaseException {
    constructor(name) {
        super(`Role '${name}' was not found`, error_codes_1.ErrorCode.NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.RoleNotFoundException = RoleNotFoundException;
class PermissionNotFoundException extends base_exception_1.BaseException {
    constructor(actionKey) {
        super(`Permission for '${actionKey}' was not found`, error_codes_1.ErrorCode.NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.PermissionNotFoundException = PermissionNotFoundException;
class ForbiddenPermissionException extends base_exception_1.BaseException {
    constructor(required) {
        super(`Forbidden: Missing required authorization permission '${required}'`, error_codes_1.ErrorCode.FORBIDDEN, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.ForbiddenPermissionException = ForbiddenPermissionException;
//# sourceMappingURL=rbac-exceptions.js.map
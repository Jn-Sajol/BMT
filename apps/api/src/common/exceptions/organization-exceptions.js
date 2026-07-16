"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationArchivedException = exports.OwnerNotFoundException = exports.DuplicateSlugException = exports.OrganizationNotFoundException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
const error_codes_1 = require("./error-codes");
class OrganizationNotFoundException extends base_exception_1.BaseException {
    constructor(identifier) {
        super(`Organization not found with identifier '${identifier}'`, error_codes_1.ErrorCode.NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.OrganizationNotFoundException = OrganizationNotFoundException;
class DuplicateSlugException extends base_exception_1.BaseException {
    constructor(slug) {
        super(`Organization slug '${slug}' is already taken`, error_codes_1.ErrorCode.CONFLICT, common_1.HttpStatus.CONFLICT);
    }
}
exports.DuplicateSlugException = DuplicateSlugException;
class OwnerNotFoundException extends base_exception_1.BaseException {
    constructor(userId) {
        super(`Owner user with ID '${userId}' does not exist`, error_codes_1.ErrorCode.BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.OwnerNotFoundException = OwnerNotFoundException;
class OrganizationArchivedException extends base_exception_1.BaseException {
    constructor(id) {
        super(`Organization '${id}' is archived and cannot be modified`, error_codes_1.ErrorCode.UNPROCESSABLE_ENTITY, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
exports.OrganizationArchivedException = OrganizationArchivedException;
//# sourceMappingURL=organization-exceptions.js.map
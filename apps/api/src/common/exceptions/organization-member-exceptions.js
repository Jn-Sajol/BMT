"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerRemovalException = exports.InvalidStatusTransitionException = exports.DuplicateMembershipException = exports.OrganizationMemberNotFoundException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
const error_codes_1 = require("./error-codes");
class OrganizationMemberNotFoundException extends base_exception_1.BaseException {
    constructor(orgId, userId) {
        super(`User '${userId}' is not a member of organization '${orgId}'`, error_codes_1.ErrorCode.NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.OrganizationMemberNotFoundException = OrganizationMemberNotFoundException;
class DuplicateMembershipException extends base_exception_1.BaseException {
    constructor(orgId, userId) {
        super(`User '${userId}' is already a member of organization '${orgId}'`, error_codes_1.ErrorCode.CONFLICT, common_1.HttpStatus.CONFLICT);
    }
}
exports.DuplicateMembershipException = DuplicateMembershipException;
class InvalidStatusTransitionException extends base_exception_1.BaseException {
    constructor(from, to) {
        super(`Cannot transition membership status from '${from}' to '${to}'`, error_codes_1.ErrorCode.BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidStatusTransitionException = InvalidStatusTransitionException;
class OwnerRemovalException extends base_exception_1.BaseException {
    constructor(userId, orgId) {
        super(`Cannot remove or alter membership of user '${userId}' because they are the owner of organization '${orgId}'`, error_codes_1.ErrorCode.BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.OwnerRemovalException = OwnerRemovalException;
//# sourceMappingURL=organization-member-exceptions.js.map
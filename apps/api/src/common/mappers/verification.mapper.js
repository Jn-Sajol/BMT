"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationMapper = void 0;
class VerificationMapper {
    static toResponse(user) {
        return {
            userId: user.id,
            email: user.email,
            status: user.status,
            verifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : '',
        };
    }
}
exports.VerificationMapper = VerificationMapper;
//# sourceMappingURL=verification.mapper.js.map
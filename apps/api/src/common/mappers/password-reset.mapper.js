"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetMapper = void 0;
class PasswordResetMapper {
    static toResponse(user, tokenRecord, isValid) {
        return {
            userId: user.id,
            email: user.email,
            status: user.status,
            tokenHash: tokenRecord.tokenHash,
            isValid,
        };
    }
}
exports.PasswordResetMapper = PasswordResetMapper;
//# sourceMappingURL=password-reset.mapper.js.map
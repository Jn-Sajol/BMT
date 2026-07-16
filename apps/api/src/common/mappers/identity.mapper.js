"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityMapper = void 0;
class IdentityMapper {
    static toUserResponse(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            status: user.status,
            createdAt: user.createdAt.toISOString(),
        };
    }
}
exports.IdentityMapper = IdentityMapper;
//# sourceMappingURL=identity.mapper.js.map
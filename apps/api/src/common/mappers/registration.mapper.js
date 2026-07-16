"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationMapper = void 0;
class RegistrationMapper {
    static toResponse(user) {
        return {
            userId: user.id,
            email: user.email,
            status: user.status,
        };
    }
}
exports.RegistrationMapper = RegistrationMapper;
//# sourceMappingURL=registration.mapper.js.map
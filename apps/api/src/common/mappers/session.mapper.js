"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionMapper = void 0;
class SessionMapper {
    static toResponse(session) {
        return {
            id: session.id,
            userId: session.userId,
            tokenHash: session.tokenHash,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            device: session.device,
            browser: session.browser,
            os: session.os,
            country: session.country,
            city: session.city,
            lastActivityAt: session.lastActivityAt.toISOString(),
            expiresAt: session.expiresAt.toISOString(),
            createdAt: session.createdAt.toISOString(),
        };
    }
    static toResponseList(sessions) {
        return sessions.map(s => this.toResponse(s));
    }
}
exports.SessionMapper = SessionMapper;
//# sourceMappingURL=session.mapper.js.map
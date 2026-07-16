"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSessionService = void 0;
const common_1 = require("@nestjs/common");
let UserSessionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UserSessionService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UserSessionService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        sessionRepo;
        tokenGenerator;
        clockProvider;
        constructor(sessionRepo, tokenGenerator, clockProvider) {
            this.sessionRepo = sessionRepo;
            this.tokenGenerator = tokenGenerator;
            this.clockProvider = clockProvider;
        }
        async createSession(dto) {
            const tokenHash = dto.tokenHash || this.tokenGenerator.generate(48); // Generate secure session token
            const now = this.clockProvider.now();
            // Remember me: 30 days, Default: 24 hours
            const durationMs = dto.rememberMe
                ? 30 * 24 * 60 * 60 * 1000
                : 24 * 60 * 60 * 1000;
            const expiresAt = new Date(now.getTime() + durationMs);
            const session = {
                id: '',
                userId: dto.userId,
                tokenHash,
                ipAddress: dto.ipAddress || null,
                userAgent: dto.userAgent || null,
                device: dto.device || null,
                browser: dto.browser || null,
                os: dto.os || null,
                country: dto.country || null,
                city: dto.city || null,
                lastActivityAt: now,
                expiresAt,
                createdAt: now,
                updatedAt: now,
            };
            return await this.sessionRepo.save(session);
        }
        async validateSession(tokenHash) {
            const session = await this.sessionRepo.findByTokenHash(tokenHash);
            if (!session)
                return null;
            const now = this.clockProvider.now();
            if (session.expiresAt < now) {
                await this.sessionRepo.delete(session.id);
                return null;
            }
            // Update last activity audit timestamp on validation
            session.lastActivityAt = now;
            session.updatedAt = now;
            return await this.sessionRepo.save(session);
        }
        async revokeSession(id) {
            await this.sessionRepo.delete(id);
        }
        async revokeAllSessionsByUserId(userId) {
            await this.sessionRepo.deleteAllSessions(userId);
        }
        async getActiveSessions(userId) {
            return await this.sessionRepo.findActiveSessionsByUserId(userId);
        }
    };
    return UserSessionService = _classThis;
})();
exports.UserSessionService = UserSessionService;
//# sourceMappingURL=user-session.service.js.map
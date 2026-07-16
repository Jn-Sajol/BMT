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
exports.UserSessionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_error_mapper_1 = require("../prisma-error.mapper");
let UserSessionRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UserSessionRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UserSessionRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async findById(id) {
            try {
                return await this.prisma.userSession.findUnique({ where: { id } });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findByTokenHash(tokenHash) {
            try {
                return await this.prisma.userSession.findUnique({ where: { tokenHash } });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findActiveSessionsByUserId(userId) {
            try {
                return await this.prisma.userSession.findMany({
                    where: {
                        userId,
                        expiresAt: {
                            gt: new Date(),
                        },
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findAll() {
            try {
                return await this.prisma.userSession.findMany();
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async save(entity) {
            try {
                return await this.prisma.userSession.upsert({
                    where: { id: entity.id || '' },
                    update: {
                        tokenHash: entity.tokenHash,
                        ipAddress: entity.ipAddress,
                        userAgent: entity.userAgent,
                        device: entity.device,
                        browser: entity.browser,
                        os: entity.os,
                        country: entity.country,
                        city: entity.city,
                        lastActivityAt: entity.lastActivityAt,
                        expiresAt: entity.expiresAt,
                    },
                    create: {
                        userId: entity.userId,
                        tokenHash: entity.tokenHash,
                        ipAddress: entity.ipAddress,
                        userAgent: entity.userAgent,
                        device: entity.device,
                        browser: entity.browser,
                        os: entity.os,
                        country: entity.country,
                        city: entity.city,
                        lastActivityAt: entity.lastActivityAt,
                        expiresAt: entity.expiresAt,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async delete(id) {
            try {
                await this.prisma.userSession.delete({ where: { id } });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async deleteExpiredSessions(userId) {
            try {
                await this.prisma.userSession.deleteMany({
                    where: {
                        userId,
                        expiresAt: {
                            lt: new Date(),
                        },
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async deleteAllSessions(userId) {
            try {
                await this.prisma.userSession.deleteMany({
                    where: { userId },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
    };
    return UserSessionRepository = _classThis;
})();
exports.UserSessionRepository = UserSessionRepository;
//# sourceMappingURL=user-session.repository.js.map
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
exports.JobRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_error_mapper_1 = require("../prisma-error.mapper");
let JobRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var JobRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            JobRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async createJob(name, provider, payload, cron, correlationId, runAt) {
            try {
                return await this.prisma.job.create({
                    data: {
                        name,
                        provider,
                        payload,
                        cron,
                        correlationId,
                        runAt,
                        status: 'PENDING',
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findPendingJobs(now) {
            try {
                return await this.prisma.job.findMany({
                    where: {
                        status: 'PENDING',
                        runAt: { lte: now },
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async updateJobStatus(id, status, attempts, errorMessage, runAt, lastRunAt) {
            try {
                return await this.prisma.job.update({
                    where: { id },
                    data: {
                        status,
                        attempts,
                        errorMessage,
                        runAt,
                        lastRunAt,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async insertHistory(jobId, status, attempt, errorMessage, duration, startedAt, finishedAt) {
            try {
                return await this.prisma.jobHistory.create({
                    data: {
                        jobId,
                        status,
                        attempt,
                        errorMessage,
                        duration,
                        startedAt,
                        finishedAt,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async cancelJob(id) {
            try {
                return await this.prisma.job.update({
                    where: { id },
                    data: { status: 'CANCELLED' },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findById(id) {
            try {
                return await this.prisma.job.findUnique({
                    where: { id },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async acquireLock(lockKey, lockedBy, durationSeconds) {
            try {
                const now = new Date();
                const expiresAt = new Date(now.getTime() + durationSeconds * 1000);
                return await this.prisma.$transaction(async (tx) => {
                    const existing = await tx.distributedLock.findUnique({
                        where: { lockKey },
                    });
                    if (existing && existing.expiresAt > now) {
                        return false;
                    }
                    await tx.distributedLock.upsert({
                        where: { lockKey },
                        update: {
                            lockedBy,
                            expiresAt,
                        },
                        create: {
                            lockKey,
                            lockedBy,
                            expiresAt,
                        },
                    });
                    return true;
                });
            }
            catch (e) {
                return false;
            }
        }
        async releaseLock(lockKey, lockedBy) {
            try {
                await this.prisma.distributedLock.deleteMany({
                    where: {
                        lockKey,
                        lockedBy,
                    },
                });
            }
            catch (e) {
                // Ignore release errors
            }
        }
    };
    return JobRepository = _classThis;
})();
exports.JobRepository = JobRepository;
//# sourceMappingURL=job.repository.js.map
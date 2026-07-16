"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReliabilityController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ReliabilityController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Reliability Engine'), (0, common_1.Controller)('api/automation/reliability'), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getRetryQueue_decorators;
    let _getDeadLetters_decorators;
    let _getCircuitBreakers_decorators;
    let _triggerRetry_decorators;
    let _replayDeadLetter_decorators;
    let _resetBreaker_decorators;
    let _checkHealth_decorators;
    var ReliabilityController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getRetryQueue_decorators = [(0, common_1.Get)('retry-queue'), (0, swagger_1.ApiOperation)({ summary: 'Get current retry queue elements' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getDeadLetters_decorators = [(0, common_1.Get)('dead-letters'), (0, swagger_1.ApiOperation)({ summary: 'Get dead letter logs' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getCircuitBreakers_decorators = [(0, common_1.Get)('circuit-breakers'), (0, swagger_1.ApiOperation)({ summary: 'Get circuit breaker states' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _triggerRetry_decorators = [(0, common_1.Post)('retry'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Manually trigger retry schedule' })];
            _replayDeadLetter_decorators = [(0, common_1.Post)('replay'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Replay dead letter by record ID' })];
            _resetBreaker_decorators = [(0, common_1.Post)('reset-breaker'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Reset circuit breaker state' })];
            _checkHealth_decorators = [(0, common_1.Get)('health'), (0, swagger_1.ApiOperation)({ summary: 'Query health parameters depth, counts, ages' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            __esDecorate(this, null, _getRetryQueue_decorators, { kind: "method", name: "getRetryQueue", static: false, private: false, access: { has: obj => "getRetryQueue" in obj, get: obj => obj.getRetryQueue }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getDeadLetters_decorators, { kind: "method", name: "getDeadLetters", static: false, private: false, access: { has: obj => "getDeadLetters" in obj, get: obj => obj.getDeadLetters }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getCircuitBreakers_decorators, { kind: "method", name: "getCircuitBreakers", static: false, private: false, access: { has: obj => "getCircuitBreakers" in obj, get: obj => obj.getCircuitBreakers }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _triggerRetry_decorators, { kind: "method", name: "triggerRetry", static: false, private: false, access: { has: obj => "triggerRetry" in obj, get: obj => obj.triggerRetry }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _replayDeadLetter_decorators, { kind: "method", name: "replayDeadLetter", static: false, private: false, access: { has: obj => "replayDeadLetter" in obj, get: obj => obj.replayDeadLetter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _resetBreaker_decorators, { kind: "method", name: "resetBreaker", static: false, private: false, access: { has: obj => "resetBreaker" in obj, get: obj => obj.resetBreaker }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _checkHealth_decorators, { kind: "method", name: "checkHealth", static: false, private: false, access: { has: obj => "checkHealth" in obj, get: obj => obj.checkHealth }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ReliabilityController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        breaker = __runInitializers(this, _instanceExtraInitializers);
        dlq;
        queue;
        worker;
        prisma;
        constructor(breaker, dlq, queue, worker, prisma) {
            this.breaker = breaker;
            this.dlq = dlq;
            this.queue = queue;
            this.worker = worker;
            this.prisma = prisma;
        }
        async getRetryQueue(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.prisma.automationRetryQueue.findMany({
                where: { workspaceId },
                orderBy: { nextRetryAt: 'asc' },
            });
        }
        async getDeadLetters(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.prisma.automationDeadLetter.findMany({
                where: { workspaceId },
                orderBy: { createdAt: 'desc' },
            });
        }
        async getCircuitBreakers(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.prisma.automationCircuitBreaker.findMany({
                where: { workspaceId },
            });
        }
        async triggerRetry(idempotencyKey) {
            const item = await this.prisma.automationRetryQueue.findUnique({
                where: { idempotencyKey },
            });
            if (!item)
                return { success: false, reason: 'Retry key not found.' };
            await this.queue.enqueue({
                correlationId: item.correlationId,
                workspaceId: item.workspaceId,
                provider: item.provider,
                providerAccountId: item.providerAccountId,
                executionId: item.causationId,
                actionId: item.actionId || undefined,
                retryCount: item.retryCount + 1,
                maxRetries: item.maxRetries,
                firstFailureAt: item.createdAt,
                lastFailureAt: new Date(),
                retryPolicy: 'MANUAL',
                payload: item.payload,
            }, 'HIGH');
            return { success: true };
        }
        async replayDeadLetter(deadLetterId) {
            await this.dlq.replayDeadLetter(deadLetterId);
            return { success: true };
        }
        async resetBreaker(provider, providerAccountId, req) {
            const workspaceId = req.headers['x-workspace-id'];
            await this.breaker.resetBreaker(provider, providerAccountId, workspaceId);
            return { success: true };
        }
        async checkHealth(req) {
            const workspaceId = req.headers['x-workspace-id'];
            const queueDepth = await this.prisma.automationRetryQueue.count({
                where: { workspaceId, status: 'PENDING' },
            });
            const deadLetterCount = await this.prisma.automationDeadLetter.count({
                where: { workspaceId },
            });
            const oldestPending = await this.prisma.automationRetryQueue.findFirst({
                where: { workspaceId, status: 'PENDING' },
                orderBy: { nextRetryAt: 'asc' },
            });
            const oldestAgeMs = oldestPending
                ? Date.now() - oldestPending.nextRetryAt.getTime()
                : 0;
            const breakers = await this.prisma.automationCircuitBreaker.findMany({
                where: { workspaceId },
            });
            const breakerStates = breakers.map((b) => ({
                provider: b.provider,
                status: b.status,
            }));
            return {
                retryQueueDepth: queueDepth,
                deadLetterCount,
                oldestRetryAgeMs: oldestAgeMs,
                circuitBreakers: breakerStates,
                workerCount: 1,
                averageProcessingRate: 1.2,
                failureRate: 0.05,
            };
        }
    };
    return ReliabilityController = _classThis;
})();
exports.ReliabilityController = ReliabilityController;
//# sourceMappingURL=reliability.controller.js.map
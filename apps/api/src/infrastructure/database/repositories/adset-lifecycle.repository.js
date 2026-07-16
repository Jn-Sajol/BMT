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
exports.AdSetLifecycleRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_error_mapper_1 = require("../prisma-error.mapper");
let AdSetLifecycleRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdSetLifecycleRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdSetLifecycleRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async findById(id) {
            try {
                return await this.prisma.adSet.findUnique({
                    where: { id },
                    include: { campaign: true, statusDetail: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async updateAdSetStatus(adSetId, status, effectiveStatus, lastSyncedAt, rawResponse, updatedBy) {
            try {
                return await this.prisma.$transaction(async (tx) => {
                    const adset = await tx.adSet.update({
                        where: { id: adSetId },
                        data: {
                            status,
                            updatedBy,
                        },
                    });
                    await tx.adSetStatusDetail.upsert({
                        where: { adSetId },
                        update: {
                            effectiveStatus,
                            lastSyncedAt,
                            statusRawPayload: rawResponse,
                        },
                        create: {
                            adSetId,
                            effectiveStatus,
                            reviewStatus: 'APPROVED',
                            deliveryStatus: 'ACTIVE',
                            lastSyncedAt,
                            statusRawPayload: rawResponse,
                        },
                    });
                    return adset;
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async updateAdSetAttributes(adSetId, data) {
            try {
                const updateData = {};
                if (data.name !== undefined)
                    updateData.name = data.name;
                if (data.dailyBudget !== undefined)
                    updateData.dailyBudget = data.dailyBudget;
                if (data.lifetimeBudget !== undefined)
                    updateData.lifetimeBudget = data.lifetimeBudget;
                if (data.bidStrategy !== undefined)
                    updateData.bidStrategy = data.bidStrategy;
                if (data.optimizationGoal !== undefined)
                    updateData.optimizationGoal = data.optimizationGoal;
                if (data.billingEvent !== undefined)
                    updateData.billingEvent = data.billingEvent;
                if (data.startTime !== undefined)
                    updateData.startTime = data.startTime;
                if (data.endTime !== undefined)
                    updateData.endTime = data.endTime;
                if (data.targeting !== undefined)
                    updateData.targeting = data.targeting;
                updateData.updatedBy = data.updatedBy;
                return await this.prisma.adSet.update({
                    where: { id: adSetId },
                    data: updateData,
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async insertHistory(adSetId, action, beforeStatus, afterStatus, performedBy, performedAt, metaResponse) {
            try {
                return await this.prisma.adSetLifecycleHistory.create({
                    data: {
                        adSetId,
                        action,
                        beforeStatus,
                        afterStatus,
                        performedBy,
                        performedAt,
                        metaResponse,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
    };
    return AdSetLifecycleRepository = _classThis;
})();
exports.AdSetLifecycleRepository = AdSetLifecycleRepository;
//# sourceMappingURL=adset-lifecycle.repository.js.map
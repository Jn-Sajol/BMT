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
exports.AdLifecycleRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_error_mapper_1 = require("../prisma-error.mapper");
let AdLifecycleRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdLifecycleRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdLifecycleRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async findById(id) {
            try {
                return await this.prisma.ad.findUnique({
                    where: { id },
                    include: { statusDetail: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findByExternalAdId(externalAdId) {
            try {
                return await this.prisma.ad.findFirst({
                    where: { externalAdId, deletedAt: null },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async updateAdStatus(adId, status, effectiveStatus, lastSyncedAt, rawResponse, updatedBy) {
            try {
                return await this.prisma.$transaction(async (tx) => {
                    const ad = await tx.ad.update({
                        where: { id: adId },
                        data: {
                            status,
                            updatedBy,
                        },
                    });
                    await tx.adStatusDetail.upsert({
                        where: { adId },
                        update: {
                            effectiveStatus,
                            lastSyncedAt,
                            statusRawPayload: rawResponse,
                        },
                        create: {
                            adId,
                            effectiveStatus,
                            reviewStatus: 'PENDING_REVIEW',
                            deliveryStatus: 'INACTIVE',
                            lastSyncedAt,
                            statusRawPayload: rawResponse,
                        },
                    });
                    return ad;
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async updateAdAttributes(adId, data) {
            try {
                const updateData = {};
                if (data.name !== undefined)
                    updateData.name = data.name;
                if (data.creativeId !== undefined)
                    updateData.creativeId = data.creativeId;
                if (data.trackingSpecs !== undefined)
                    updateData.trackingSpecs = data.trackingSpecs;
                updateData.updatedBy = data.updatedBy;
                return await this.prisma.ad.update({
                    where: { id: adId },
                    data: updateData,
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async insertHistory(adId, action, beforeStatus, afterStatus, performedBy, performedAt, metaResponse) {
            try {
                return await this.prisma.adLifecycleHistory.create({
                    data: {
                        adId,
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
    return AdLifecycleRepository = _classThis;
})();
exports.AdLifecycleRepository = AdLifecycleRepository;
//# sourceMappingURL=ad-lifecycle.repository.js.map
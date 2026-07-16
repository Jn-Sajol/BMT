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
exports.AdSetRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_error_mapper_1 = require("../prisma-error.mapper");
let AdSetRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdSetRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdSetRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async findById(id) {
            try {
                return await this.prisma.adSet.findFirst({
                    where: { id, deletedAt: null },
                    include: { labels: true, tags: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findByCampaignId(campaignId) {
            try {
                return await this.prisma.adSet.findMany({
                    where: { campaignId, deletedAt: null },
                    include: { labels: true, tags: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async save(entity, labels = [], tags = []) {
            try {
                return await this.prisma.$transaction(async (tx) => {
                    const saved = await tx.adSet.upsert({
                        where: { id: entity.id || '' },
                        update: {
                            name: entity.name,
                            status: entity.status,
                            optimizationGoal: entity.optimizationGoal,
                            billingEvent: entity.billingEvent,
                            bidStrategy: entity.bidStrategy,
                            dailyBudget: entity.dailyBudget,
                            lifetimeBudget: entity.lifetimeBudget,
                            startTime: entity.startTime,
                            endTime: entity.endTime,
                            attributionSetting: entity.attributionSetting,
                            targeting: entity.targeting,
                            promotedObject: entity.promotedObject || undefined,
                            metaPixelId: entity.metaPixelId,
                            instagramAccountId: entity.instagramAccountId,
                            facebookPageId: entity.facebookPageId,
                            draftVersion: entity.draftVersion,
                            updatedBy: entity.updatedBy,
                            deletedAt: entity.deletedAt,
                            publishedAt: entity.publishedAt,
                            publishedBy: entity.publishedBy,
                            externalAdSetId: entity.externalAdSetId,
                            publishResponse: entity.publishResponse || undefined,
                        },
                        create: {
                            campaignId: entity.campaignId,
                            name: entity.name,
                            status: entity.status,
                            optimizationGoal: entity.optimizationGoal,
                            billingEvent: entity.billingEvent,
                            bidStrategy: entity.bidStrategy,
                            dailyBudget: entity.dailyBudget,
                            lifetimeBudget: entity.lifetimeBudget,
                            startTime: entity.startTime,
                            endTime: entity.endTime,
                            attributionSetting: entity.attributionSetting,
                            targeting: entity.targeting,
                            promotedObject: entity.promotedObject || undefined,
                            metaPixelId: entity.metaPixelId,
                            instagramAccountId: entity.instagramAccountId,
                            facebookPageId: entity.facebookPageId,
                            draftVersion: entity.draftVersion,
                            createdBy: entity.createdBy,
                            updatedBy: entity.updatedBy,
                            deletedAt: entity.deletedAt,
                            publishedAt: entity.publishedAt,
                            publishedBy: entity.publishedBy,
                            externalAdSetId: entity.externalAdSetId,
                            publishResponse: entity.publishResponse || undefined,
                        },
                    });
                    // Re-create labels
                    await tx.adSetLabel.deleteMany({ where: { adsetId: saved.id } });
                    if (labels.length > 0) {
                        await tx.adSetLabel.createMany({
                            data: labels.map((name) => ({ adsetId: saved.id, name })),
                        });
                    }
                    // Re-create tags
                    await tx.adSetTag.deleteMany({ where: { adsetId: saved.id } });
                    if (tags.length > 0) {
                        await tx.adSetTag.createMany({
                            data: tags.map((name) => ({ adsetId: saved.id, name })),
                        });
                    }
                    return await tx.adSet.findFirstOrThrow({
                        where: { id: saved.id },
                        include: { labels: true, tags: true },
                    });
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async saveHistory(history) {
            try {
                return await this.prisma.adSetHistory.create({
                    data: {
                        adsetId: history.adsetId,
                        version: history.version,
                        snapshot: history.snapshot,
                        authorId: history.authorId,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findHistoryByAdSetId(adsetId) {
            try {
                return await this.prisma.adSetHistory.findMany({
                    where: { adsetId },
                    orderBy: { version: 'desc' },
                    include: { author: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findHistoryByAdSetIdAndVersion(adsetId, version) {
            try {
                return await this.prisma.adSetHistory.findFirst({
                    where: { adsetId, version },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
    };
    return AdSetRepository = _classThis;
})();
exports.AdSetRepository = AdSetRepository;
//# sourceMappingURL=ad-set.repository.js.map
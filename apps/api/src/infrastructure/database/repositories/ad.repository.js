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
exports.AdRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_error_mapper_1 = require("../prisma-error.mapper");
let AdRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async findById(id) {
            try {
                return await this.prisma.ad.findFirst({
                    where: { id, deletedAt: null },
                    include: { labels: true, tags: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findByWorkspaceId(workspaceId) {
            try {
                return await this.prisma.ad.findMany({
                    where: { workspaceId, deletedAt: null },
                    include: { labels: true, tags: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findByCampaignId(campaignId) {
            try {
                return await this.prisma.ad.findMany({
                    where: { campaignId, deletedAt: null },
                    include: { labels: true, tags: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findByAdSetId(adSetId) {
            try {
                return await this.prisma.ad.findMany({
                    where: { adSetId, deletedAt: null },
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
                    const saved = await tx.ad.upsert({
                        where: { id: entity.id || '' },
                        update: {
                            name: entity.name,
                            status: entity.status,
                            draftVersion: entity.draftVersion,
                            updatedBy: entity.updatedBy,
                            deletedAt: entity.deletedAt,
                            publishedAt: entity.publishedAt,
                            publishedBy: entity.publishedBy,
                            externalAdId: entity.externalAdId,
                            publishResponse: entity.publishResponse || undefined,
                            trackingSpecs: entity.trackingSpecs,
                            displayStatus: entity.displayStatus,
                            reviewStatus: entity.reviewStatus,
                        },
                        create: {
                            workspaceId: entity.workspaceId,
                            campaignId: entity.campaignId,
                            adSetId: entity.adSetId,
                            creativeId: entity.creativeId,
                            name: entity.name,
                            status: entity.status,
                            draftVersion: entity.draftVersion,
                            createdBy: entity.createdBy,
                            updatedBy: entity.updatedBy,
                            deletedAt: entity.deletedAt,
                            publishedAt: entity.publishedAt,
                            publishedBy: entity.publishedBy,
                            externalAdId: entity.externalAdId,
                            publishResponse: entity.publishResponse || undefined,
                            trackingSpecs: entity.trackingSpecs,
                            displayStatus: entity.displayStatus,
                            reviewStatus: entity.reviewStatus,
                        },
                    });
                    await tx.adLabel.deleteMany({ where: { adId: saved.id } });
                    if (labels.length > 0) {
                        await tx.adLabel.createMany({
                            data: labels.map((name) => ({ adId: saved.id, name })),
                        });
                    }
                    await tx.adTag.deleteMany({ where: { adId: saved.id } });
                    if (tags.length > 0) {
                        await tx.adTag.createMany({
                            data: tags.map((name) => ({ adId: saved.id, name })),
                        });
                    }
                    return await tx.ad.findFirstOrThrow({
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
                return await this.prisma.adHistory.create({
                    data: {
                        adId: history.adId,
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
        async findHistoryByAdId(adId) {
            try {
                return await this.prisma.adHistory.findMany({
                    where: { adId },
                    orderBy: { version: 'desc' },
                    include: { author: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findHistoryByAdIdAndVersion(adId, version) {
            try {
                return await this.prisma.adHistory.findFirst({
                    where: { adId, version },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
    };
    return AdRepository = _classThis;
})();
exports.AdRepository = AdRepository;
//# sourceMappingURL=ad.repository.js.map
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
exports.AdService = void 0;
const common_1 = require("@nestjs/common");
const ad_mapper_1 = require("../common/ad.mapper");
let AdService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        adRepo;
        campaignRepo;
        validationService;
        historyService;
        clockProvider;
        constructor(adRepo, campaignRepo, validationService, historyService, clockProvider) {
            this.adRepo = adRepo;
            this.campaignRepo = campaignRepo;
            this.validationService = validationService;
            this.historyService = historyService;
            this.clockProvider = clockProvider;
        }
        async create(dto, workspaceId, userId) {
            await this.validationService.validateCreate(dto, workspaceId);
            const now = this.clockProvider.now();
            const ad = {
                id: '',
                workspaceId,
                campaignId: dto.campaignId,
                adSetId: dto.adSetId,
                creativeId: dto.creativeId,
                name: dto.name,
                status: 'DRAFT',
                draftVersion: 1,
                externalAdId: null,
                publishedAt: null,
                publishedBy: null,
                publishResponse: null,
                trackingSpecs: dto.trackingSpecs || {},
                displayStatus: 'DRAFT',
                reviewStatus: 'PENDING_REVIEW',
                createdBy: userId,
                updatedBy: userId,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
            };
            const saved = await this.adRepo.save(ad, dto.labels || [], dto.tags || []);
            await this.historyService.createSnapshot(saved, userId);
            return ad_mapper_1.AdMapper.toResponse(saved);
        }
        async update(id, dto, workspaceId, userId) {
            await this.validationService.validateUpdate(dto);
            const ad = await this.adRepo.findById(id);
            if (!ad || ad.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad not found');
            }
            const now = this.clockProvider.now();
            const updated = {
                ...ad,
                name: dto.name !== undefined ? dto.name : ad.name,
                trackingSpecs: dto.trackingSpecs !== undefined ? dto.trackingSpecs : ad.trackingSpecs,
                status: dto.status !== undefined ? dto.status : ad.status,
                draftVersion: ad.draftVersion + 1,
                updatedBy: userId,
                updatedAt: now,
            };
            const currentLabels = ad.labels ? ad.labels.map((l) => l.name) : [];
            const currentTags = ad.tags ? ad.tags.map((t) => t.name) : [];
            const labels = dto.labels !== undefined ? dto.labels : currentLabels;
            const tags = dto.tags !== undefined ? dto.tags : currentTags;
            const saved = await this.adRepo.save(updated, labels, tags);
            await this.historyService.createSnapshot(saved, userId);
            return ad_mapper_1.AdMapper.toResponse(saved);
        }
        async findOne(id, workspaceId) {
            const ad = await this.adRepo.findById(id);
            if (!ad || ad.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad not found');
            }
            return ad_mapper_1.AdMapper.toResponse(ad);
        }
        async findByCampaignId(campaignId, workspaceId) {
            const campaign = await this.campaignRepo.findById(campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Campaign not found');
            }
            const ads = await this.adRepo.findByCampaignId(campaignId);
            return ads.map(ad_mapper_1.AdMapper.toResponse);
        }
        async findByAdSetId(adSetId, workspaceId) {
            const ads = await this.adRepo.findByAdSetId(adSetId);
            const filtered = ads.filter((a) => a.workspaceId === workspaceId);
            return filtered.map(ad_mapper_1.AdMapper.toResponse);
        }
        async delete(id, workspaceId, userId) {
            const ad = await this.adRepo.findById(id);
            if (!ad || ad.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad not found');
            }
            const now = this.clockProvider.now();
            const softDeleted = {
                ...ad,
                deletedAt: now,
                updatedBy: userId,
                updatedAt: now,
            };
            const currentLabels = ad.labels ? ad.labels.map((l) => l.name) : [];
            const currentTags = ad.tags ? ad.tags.map((t) => t.name) : [];
            await this.adRepo.save(softDeleted, currentLabels, currentTags);
        }
        async duplicate(id, workspaceId, userId) {
            const ad = await this.adRepo.findById(id);
            if (!ad || ad.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad not found');
            }
            const now = this.clockProvider.now();
            const duplicated = {
                ...ad,
                id: '',
                name: `${ad.name} (Copy)`,
                status: 'DRAFT',
                draftVersion: 1,
                externalAdId: null,
                publishedAt: null,
                publishedBy: null,
                publishResponse: null,
                createdBy: userId,
                updatedBy: userId,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
            };
            const currentLabels = ad.labels ? ad.labels.map((l) => l.name) : [];
            const currentTags = ad.tags ? ad.tags.map((t) => t.name) : [];
            const saved = await this.adRepo.save(duplicated, currentLabels, currentTags);
            await this.historyService.createSnapshot(saved, userId);
            return ad_mapper_1.AdMapper.toResponse(saved);
        }
        async restore(id, version, workspaceId, userId) {
            const ad = await this.adRepo.findById(id);
            if (!ad || ad.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad not found');
            }
            const snapshotRecord = await this.historyService.getSnapshot(id, version);
            if (!snapshotRecord) {
                throw new common_1.BadRequestException('Requested Ad version snapshot not found');
            }
            const snapshot = snapshotRecord.snapshot;
            const now = this.clockProvider.now();
            const restored = {
                ...ad,
                name: snapshot.name,
                trackingSpecs: snapshot.trackingSpecs,
                status: 'DRAFT',
                draftVersion: ad.draftVersion + 1,
                updatedBy: userId,
                updatedAt: now,
            };
            const labels = snapshot.labels ? snapshot.labels.map((l) => l.name) : [];
            const tags = snapshot.tags ? snapshot.tags.map((t) => t.name) : [];
            const saved = await this.adRepo.save(restored, labels, tags);
            await this.historyService.createSnapshot(saved, userId);
            return ad_mapper_1.AdMapper.toResponse(saved);
        }
    };
    return AdService = _classThis;
})();
exports.AdService = AdService;
//# sourceMappingURL=ad.service.js.map
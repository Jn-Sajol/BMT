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
exports.AdSetService = void 0;
const common_1 = require("@nestjs/common");
const adset_mapper_1 = require("../common/adset.mapper");
let AdSetService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdSetService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdSetService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        adSetRepo;
        campaignRepo;
        validationService;
        historyService;
        clockProvider;
        constructor(adSetRepo, campaignRepo, validationService, historyService, clockProvider) {
            this.adSetRepo = adSetRepo;
            this.campaignRepo = campaignRepo;
            this.validationService = validationService;
            this.historyService = historyService;
            this.clockProvider = clockProvider;
        }
        async create(dto, workspaceId, userId) {
            await this.validationService.validateCreate(dto, workspaceId);
            const now = this.clockProvider.now();
            const adSet = {
                id: '',
                campaignId: dto.campaignId,
                name: dto.name,
                status: 'DRAFT',
                optimizationGoal: dto.optimizationGoal,
                billingEvent: dto.billingEvent,
                bidStrategy: dto.bidStrategy || null,
                dailyBudget: dto.dailyBudget || null,
                lifetimeBudget: dto.lifetimeBudget || null,
                startTime: new Date(dto.startTime),
                endTime: dto.endTime ? new Date(dto.endTime) : null,
                attributionSetting: dto.attributionSetting || null,
                targeting: dto.targeting,
                promotedObject: dto.promotedObject || null,
                metaPixelId: dto.metaPixelId || null,
                instagramAccountId: dto.instagramAccountId || null,
                facebookPageId: dto.facebookPageId || null,
                draftVersion: 1,
                createdBy: userId,
                updatedBy: userId,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                publishedAt: null,
                publishedBy: null,
                externalAdSetId: null,
                publishResponse: null,
            };
            const saved = await this.adSetRepo.save(adSet, dto.labels || [], dto.tags || []);
            await this.historyService.createSnapshot(saved, userId);
            return adset_mapper_1.AdSetMapper.toResponse(saved);
        }
        async update(id, dto, workspaceId, userId) {
            await this.validationService.validateUpdate(dto, workspaceId);
            const adSet = await this.adSetRepo.findById(id);
            if (!adSet) {
                throw new common_1.NotFoundException('Ad Set not found');
            }
            const campaign = await this.campaignRepo.findById(adSet.campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad Set not found');
            }
            const now = this.clockProvider.now();
            const updated = {
                ...adSet,
                name: dto.name !== undefined ? dto.name : adSet.name,
                status: dto.status !== undefined ? dto.status : adSet.status,
                optimizationGoal: dto.optimizationGoal !== undefined ? dto.optimizationGoal : adSet.optimizationGoal,
                billingEvent: dto.billingEvent !== undefined ? dto.billingEvent : adSet.billingEvent,
                bidStrategy: dto.bidStrategy !== undefined ? dto.bidStrategy : adSet.bidStrategy,
                dailyBudget: dto.dailyBudget !== undefined ? dto.dailyBudget : adSet.dailyBudget,
                lifetimeBudget: dto.lifetimeBudget !== undefined ? dto.lifetimeBudget : adSet.lifetimeBudget,
                startTime: dto.startTime !== undefined ? new Date(dto.startTime) : adSet.startTime,
                endTime: dto.endTime !== undefined ? (dto.endTime ? new Date(dto.endTime) : null) : adSet.endTime,
                attributionSetting: dto.attributionSetting !== undefined ? dto.attributionSetting : adSet.attributionSetting,
                targeting: dto.targeting !== undefined ? dto.targeting : adSet.targeting,
                promotedObject: dto.promotedObject !== undefined ? dto.promotedObject : adSet.promotedObject,
                metaPixelId: dto.metaPixelId !== undefined ? dto.metaPixelId : adSet.metaPixelId,
                instagramAccountId: dto.instagramAccountId !== undefined ? dto.instagramAccountId : adSet.instagramAccountId,
                facebookPageId: dto.facebookPageId !== undefined ? dto.facebookPageId : adSet.facebookPageId,
                draftVersion: adSet.draftVersion + 1,
                updatedBy: userId,
                updatedAt: now,
            };
            const currentLabels = adSet.labels ? adSet.labels.map((l) => l.name) : [];
            const currentTags = adSet.tags ? adSet.tags.map((t) => t.name) : [];
            const labels = dto.labels !== undefined ? dto.labels : currentLabels;
            const tags = dto.tags !== undefined ? dto.tags : currentTags;
            const saved = await this.adSetRepo.save(updated, labels, tags);
            await this.historyService.createSnapshot(saved, userId);
            return adset_mapper_1.AdSetMapper.toResponse(saved);
        }
        async findOne(id, workspaceId) {
            const adSet = await this.adSetRepo.findById(id);
            if (!adSet) {
                throw new common_1.NotFoundException('Ad Set not found');
            }
            const campaign = await this.campaignRepo.findById(adSet.campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad Set not found');
            }
            return adset_mapper_1.AdSetMapper.toResponse(adSet);
        }
        async findByCampaignId(campaignId, workspaceId) {
            const campaign = await this.campaignRepo.findById(campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Campaign not found');
            }
            const adSets = await this.adSetRepo.findByCampaignId(campaignId);
            return adSets.map(adset_mapper_1.AdSetMapper.toResponse);
        }
        async delete(id, workspaceId, userId) {
            const adSet = await this.adSetRepo.findById(id);
            if (!adSet) {
                throw new common_1.NotFoundException('Ad Set not found');
            }
            const campaign = await this.campaignRepo.findById(adSet.campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad Set not found');
            }
            const now = this.clockProvider.now();
            const softDeleted = {
                ...adSet,
                deletedAt: now,
                updatedBy: userId,
                updatedAt: now,
            };
            const currentLabels = adSet.labels ? adSet.labels.map((l) => l.name) : [];
            const currentTags = adSet.tags ? adSet.tags.map((t) => t.name) : [];
            await this.adSetRepo.save(softDeleted, currentLabels, currentTags);
        }
        async restore(id, version, workspaceId, userId) {
            const adSet = await this.adSetRepo.findById(id);
            if (!adSet) {
                throw new common_1.NotFoundException('Ad Set not found');
            }
            const campaign = await this.campaignRepo.findById(adSet.campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad Set not found');
            }
            const snapshotRecord = await this.historyService.getSnapshot(id, version);
            if (!snapshotRecord) {
                throw new common_1.BadRequestException('Requested Ad Set version snapshot not found');
            }
            const snapshot = snapshotRecord.snapshot;
            const now = this.clockProvider.now();
            const restored = {
                ...adSet,
                name: snapshot.name,
                status: 'DRAFT',
                optimizationGoal: snapshot.optimizationGoal,
                billingEvent: snapshot.billingEvent,
                bidStrategy: snapshot.bidStrategy,
                dailyBudget: snapshot.dailyBudget,
                lifetimeBudget: snapshot.lifetimeBudget,
                startTime: new Date(snapshot.startTime),
                endTime: snapshot.endTime ? new Date(snapshot.endTime) : null,
                attributionSetting: snapshot.attributionSetting,
                targeting: snapshot.targeting,
                promotedObject: snapshot.promotedObject,
                metaPixelId: snapshot.metaPixelId,
                instagramAccountId: snapshot.instagramAccountId,
                facebookPageId: snapshot.facebookPageId,
                draftVersion: adSet.draftVersion + 1,
                updatedBy: userId,
                updatedAt: now,
            };
            const labels = snapshot.labels ? snapshot.labels.map((l) => l.name) : [];
            const tags = snapshot.tags ? snapshot.tags.map((t) => t.name) : [];
            const saved = await this.adSetRepo.save(restored, labels, tags);
            await this.historyService.createSnapshot(saved, userId);
            return adset_mapper_1.AdSetMapper.toResponse(saved);
        }
    };
    return AdSetService = _classThis;
})();
exports.AdSetService = AdSetService;
//# sourceMappingURL=adset.service.js.map
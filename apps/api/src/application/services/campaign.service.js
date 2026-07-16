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
exports.CampaignService = void 0;
const common_1 = require("@nestjs/common");
const campaign_mapper_1 = require("../../common/mappers/campaign.mapper");
let CampaignService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CampaignService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CampaignService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        campaignRepo;
        validationService;
        historyService;
        clockProvider;
        constructor(campaignRepo, validationService, historyService, clockProvider) {
            this.campaignRepo = campaignRepo;
            this.validationService = validationService;
            this.historyService = historyService;
            this.clockProvider = clockProvider;
        }
        async create(dto, workspaceId, organizationId, userId) {
            await this.validationService.validateCreate(dto, workspaceId);
            const now = this.clockProvider.now();
            const campaign = {
                id: '',
                workspaceId,
                organizationId,
                metaBusinessId: dto.metaBusinessId,
                metaAdAccountId: dto.metaAdAccountId,
                name: dto.name,
                objective: dto.objective,
                buyingType: dto.buyingType || 'AUCTION',
                specialAdCategory: dto.specialAdCategory || 'NONE',
                status: 'DRAFT',
                draftVersion: 1,
                publishedVersion: 0,
                isPublished: false,
                createdBy: userId,
                updatedBy: userId,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                externalCampaignId: null,
                publishedAt: null,
                publishedBy: null,
                publishResponse: null,
            };
            const saved = await this.campaignRepo.save(campaign, dto.labels || [], dto.tags || []);
            await this.historyService.createSnapshot(saved, userId);
            return campaign_mapper_1.CampaignMapper.toResponse(saved);
        }
        async update(id, dto, workspaceId, userId) {
            await this.validationService.validateUpdate(dto);
            const campaign = await this.campaignRepo.findById(id);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Campaign not found');
            }
            const now = this.clockProvider.now();
            const updatedCampaign = {
                ...campaign,
                name: dto.name !== undefined ? dto.name : campaign.name,
                objective: dto.objective !== undefined ? dto.objective : campaign.objective,
                buyingType: dto.buyingType !== undefined ? dto.buyingType : campaign.buyingType,
                specialAdCategory: dto.specialAdCategory !== undefined ? dto.specialAdCategory : campaign.specialAdCategory,
                status: dto.status !== undefined ? dto.status : campaign.status,
                draftVersion: campaign.draftVersion + 1,
                updatedBy: userId,
                updatedAt: now,
            };
            const currentLabels = campaign.labels ? campaign.labels.map((l) => l.name) : [];
            const currentTags = campaign.tags ? campaign.tags.map((t) => t.name) : [];
            const labels = dto.labels !== undefined ? dto.labels : currentLabels;
            const tags = dto.tags !== undefined ? dto.tags : currentTags;
            const saved = await this.campaignRepo.save(updatedCampaign, labels, tags);
            await this.historyService.createSnapshot(saved, userId);
            return campaign_mapper_1.CampaignMapper.toResponse(saved);
        }
        async findOne(id, workspaceId) {
            const campaign = await this.campaignRepo.findById(id);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Campaign not found');
            }
            return campaign_mapper_1.CampaignMapper.toResponse(campaign);
        }
        async findAll(workspaceId) {
            const campaigns = await this.campaignRepo.findByWorkspaceId(workspaceId);
            return campaigns.map(campaign_mapper_1.CampaignMapper.toResponse);
        }
        async delete(id, workspaceId, userId) {
            const campaign = await this.campaignRepo.findById(id);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Campaign not found');
            }
            const now = this.clockProvider.now();
            const softDeleted = {
                ...campaign,
                deletedAt: now,
                updatedBy: userId,
                updatedAt: now,
            };
            const currentLabels = campaign.labels ? campaign.labels.map((l) => l.name) : [];
            const currentTags = campaign.tags ? campaign.tags.map((t) => t.name) : [];
            await this.campaignRepo.save(softDeleted, currentLabels, currentTags);
        }
        async duplicate(id, workspaceId, userId) {
            const campaign = await this.campaignRepo.findById(id);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Campaign not found');
            }
            const now = this.clockProvider.now();
            const duplicated = {
                id: '',
                workspaceId,
                organizationId: campaign.organizationId,
                metaBusinessId: campaign.metaBusinessId,
                metaAdAccountId: campaign.metaAdAccountId,
                name: `${campaign.name} (Copy)`,
                objective: campaign.objective,
                buyingType: campaign.buyingType,
                specialAdCategory: campaign.specialAdCategory,
                status: 'DRAFT',
                draftVersion: 1,
                publishedVersion: 0,
                isPublished: false,
                createdBy: userId,
                updatedBy: userId,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                externalCampaignId: null,
                publishedAt: null,
                publishedBy: null,
                publishResponse: null,
            };
            const currentLabels = campaign.labels ? campaign.labels.map((l) => l.name) : [];
            const currentTags = campaign.tags ? campaign.tags.map((t) => t.name) : [];
            const saved = await this.campaignRepo.save(duplicated, currentLabels, currentTags);
            await this.historyService.createSnapshot(saved, userId);
            return campaign_mapper_1.CampaignMapper.toResponse(saved);
        }
        async restore(id, version, workspaceId, userId) {
            const campaign = await this.campaignRepo.findById(id);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Campaign not found');
            }
            const snapshotRecord = await this.historyService.getSnapshot(id, version);
            if (!snapshotRecord) {
                throw new common_1.BadRequestException('Requested campaign version snapshot not found');
            }
            const snapshot = snapshotRecord.snapshot;
            const now = this.clockProvider.now();
            const restored = {
                ...campaign,
                name: snapshot.name,
                objective: snapshot.objective,
                buyingType: snapshot.buyingType,
                specialAdCategory: snapshot.specialAdCategory,
                status: 'DRAFT',
                draftVersion: campaign.draftVersion + 1,
                updatedBy: userId,
                updatedAt: now,
            };
            const labels = snapshot.labels ? snapshot.labels.map((l) => l.name) : [];
            const tags = snapshot.tags ? snapshot.tags.map((t) => t.name) : [];
            const saved = await this.campaignRepo.save(restored, labels, tags);
            await this.historyService.createSnapshot(saved, userId);
            return campaign_mapper_1.CampaignMapper.toResponse(saved);
        }
    };
    return CampaignService = _classThis;
})();
exports.CampaignService = CampaignService;
//# sourceMappingURL=campaign.service.js.map
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
exports.AdCreativeService = void 0;
const common_1 = require("@nestjs/common");
const adcreative_mapper_1 = require("../common/adcreative.mapper");
let AdCreativeService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdCreativeService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdCreativeService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        adCreativeRepo;
        campaignRepo;
        validationService;
        historyService;
        clockProvider;
        constructor(adCreativeRepo, campaignRepo, validationService, historyService, clockProvider) {
            this.adCreativeRepo = adCreativeRepo;
            this.campaignRepo = campaignRepo;
            this.validationService = validationService;
            this.historyService = historyService;
            this.clockProvider = clockProvider;
        }
        async create(dto, workspaceId, userId) {
            await this.validationService.validateCreate(dto, workspaceId);
            const now = this.clockProvider.now();
            const adCreative = {
                id: '',
                campaignId: dto.campaignId,
                creativeType: dto.creativeType,
                name: dto.name,
                primaryText: dto.primaryText,
                headline: dto.headline,
                description: dto.description || null,
                callToAction: dto.callToAction,
                destinationUrl: dto.destinationUrl,
                displayLink: dto.displayLink || null,
                caption: dto.caption || null,
                linkDescription: dto.linkDescription || null,
                facebookPageId: dto.facebookPageId || null,
                instagramAccountId: dto.instagramAccountId || null,
                mediaType: dto.mediaType || null,
                mediaAssetId: dto.mediaAssetId || null,
                thumbnailAssetId: dto.thumbnailAssetId || null,
                pixelId: dto.pixelId || null,
                trackingParameters: dto.trackingParameters || {},
                creativeSpec: dto.creativeSpec || {},
                status: 'DRAFT',
                draftVersion: 1,
                externalCreativeId: null,
                publishedAt: null,
                publishedBy: null,
                publishResponse: null,
                createdBy: userId,
                updatedBy: userId,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
            };
            const saved = await this.adCreativeRepo.save(adCreative, dto.labels || [], dto.tags || []);
            await this.historyService.createSnapshot(saved, userId);
            return adcreative_mapper_1.AdCreativeMapper.toResponse(saved);
        }
        async update(id, dto, workspaceId, userId) {
            await this.validationService.validateUpdate(dto, workspaceId);
            const adCreative = await this.adCreativeRepo.findById(id);
            if (!adCreative) {
                throw new common_1.NotFoundException('Ad Creative not found');
            }
            const campaign = await this.campaignRepo.findById(adCreative.campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad Creative not found');
            }
            const now = this.clockProvider.now();
            const updated = {
                ...adCreative,
                creativeType: dto.creativeType !== undefined ? dto.creativeType : adCreative.creativeType,
                name: dto.name !== undefined ? dto.name : adCreative.name,
                primaryText: dto.primaryText !== undefined ? dto.primaryText : adCreative.primaryText,
                headline: dto.headline !== undefined ? dto.headline : adCreative.headline,
                description: dto.description !== undefined ? dto.description : adCreative.description,
                callToAction: dto.callToAction !== undefined ? dto.callToAction : adCreative.callToAction,
                destinationUrl: dto.destinationUrl !== undefined ? dto.destinationUrl : adCreative.destinationUrl,
                displayLink: dto.displayLink !== undefined ? dto.displayLink : adCreative.displayLink,
                caption: dto.caption !== undefined ? dto.caption : adCreative.caption,
                linkDescription: dto.linkDescription !== undefined ? dto.linkDescription : adCreative.linkDescription,
                facebookPageId: dto.facebookPageId !== undefined ? dto.facebookPageId : adCreative.facebookPageId,
                instagramAccountId: dto.instagramAccountId !== undefined ? dto.instagramAccountId : adCreative.instagramAccountId,
                mediaType: dto.mediaType !== undefined ? dto.mediaType : adCreative.mediaType,
                mediaAssetId: dto.mediaAssetId !== undefined ? dto.mediaAssetId : adCreative.mediaAssetId,
                thumbnailAssetId: dto.thumbnailAssetId !== undefined ? dto.thumbnailAssetId : adCreative.thumbnailAssetId,
                pixelId: dto.pixelId !== undefined ? dto.pixelId : adCreative.pixelId,
                trackingParameters: dto.trackingParameters !== undefined ? dto.trackingParameters : adCreative.trackingParameters,
                creativeSpec: dto.creativeSpec !== undefined ? dto.creativeSpec : adCreative.creativeSpec,
                status: dto.status !== undefined ? dto.status : adCreative.status,
                draftVersion: adCreative.draftVersion + 1,
                updatedBy: userId,
                updatedAt: now,
            };
            const currentLabels = adCreative.labels ? adCreative.labels.map((l) => l.name) : [];
            const currentTags = adCreative.tags ? adCreative.tags.map((t) => t.name) : [];
            const labels = dto.labels !== undefined ? dto.labels : currentLabels;
            const tags = dto.tags !== undefined ? dto.tags : currentTags;
            const saved = await this.adCreativeRepo.save(updated, labels, tags);
            await this.historyService.createSnapshot(saved, userId);
            return adcreative_mapper_1.AdCreativeMapper.toResponse(saved);
        }
        async findOne(id, workspaceId) {
            const adCreative = await this.adCreativeRepo.findById(id);
            if (!adCreative) {
                throw new common_1.NotFoundException('Ad Creative not found');
            }
            const campaign = await this.campaignRepo.findById(adCreative.campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad Creative not found');
            }
            return adcreative_mapper_1.AdCreativeMapper.toResponse(adCreative);
        }
        async findByCampaignId(campaignId, workspaceId) {
            const campaign = await this.campaignRepo.findById(campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Campaign not found');
            }
            const creatives = await this.adCreativeRepo.findByCampaignId(campaignId);
            return creatives.map(adcreative_mapper_1.AdCreativeMapper.toResponse);
        }
        async delete(id, workspaceId, userId) {
            const adCreative = await this.adCreativeRepo.findById(id);
            if (!adCreative) {
                throw new common_1.NotFoundException('Ad Creative not found');
            }
            const campaign = await this.campaignRepo.findById(adCreative.campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad Creative not found');
            }
            const now = this.clockProvider.now();
            const softDeleted = {
                ...adCreative,
                deletedAt: now,
                updatedBy: userId,
                updatedAt: now,
            };
            const currentLabels = adCreative.labels ? adCreative.labels.map((l) => l.name) : [];
            const currentTags = adCreative.tags ? adCreative.tags.map((t) => t.name) : [];
            await this.adCreativeRepo.save(softDeleted, currentLabels, currentTags);
        }
        async restore(id, version, workspaceId, userId) {
            const adCreative = await this.adCreativeRepo.findById(id);
            if (!adCreative) {
                throw new common_1.NotFoundException('Ad Creative not found');
            }
            const campaign = await this.campaignRepo.findById(adCreative.campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad Creative not found');
            }
            const snapshotRecord = await this.historyService.getSnapshot(id, version);
            if (!snapshotRecord) {
                throw new common_1.BadRequestException('Requested Ad Creative version snapshot not found');
            }
            const snapshot = snapshotRecord.snapshot;
            const now = this.clockProvider.now();
            const restored = {
                ...adCreative,
                creativeType: snapshot.creativeType,
                name: snapshot.name,
                primaryText: snapshot.primaryText,
                headline: snapshot.headline,
                description: snapshot.description,
                callToAction: snapshot.callToAction,
                destinationUrl: snapshot.destinationUrl,
                displayLink: snapshot.displayLink,
                caption: snapshot.caption,
                linkDescription: snapshot.linkDescription,
                facebookPageId: snapshot.facebookPageId,
                instagramAccountId: snapshot.instagramAccountId,
                mediaType: snapshot.mediaType,
                mediaAssetId: snapshot.mediaAssetId,
                thumbnailAssetId: snapshot.thumbnailAssetId,
                pixelId: snapshot.pixelId,
                trackingParameters: snapshot.trackingParameters,
                creativeSpec: snapshot.creativeSpec,
                status: 'DRAFT',
                draftVersion: adCreative.draftVersion + 1,
                updatedBy: userId,
                updatedAt: now,
            };
            const labels = snapshot.labels ? snapshot.labels.map((l) => l.name) : [];
            const tags = snapshot.tags ? snapshot.tags.map((t) => t.name) : [];
            const saved = await this.adCreativeRepo.save(restored, labels, tags);
            await this.historyService.createSnapshot(saved, userId);
            return adcreative_mapper_1.AdCreativeMapper.toResponse(saved);
        }
    };
    return AdCreativeService = _classThis;
})();
exports.AdCreativeService = AdCreativeService;
//# sourceMappingURL=adcreative.service.js.map
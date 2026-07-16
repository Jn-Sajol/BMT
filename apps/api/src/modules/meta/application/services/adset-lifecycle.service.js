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
exports.AdSetLifecycleService = void 0;
const common_1 = require("@nestjs/common");
const adset_lifecycle_mapper_1 = require("./adset-lifecycle.mapper");
const adset_lifecycle_exceptions_1 = require("../../../../common/exceptions/adset-lifecycle.exceptions");
const client_1 = require("@prisma/client");
let AdSetLifecycleService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdSetLifecycleService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdSetLifecycleService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lifecycleRepo;
        connectionRepo;
        publisher;
        clockProvider;
        encryptionService;
        constructor(lifecycleRepo, connectionRepo, publisher, clockProvider, encryptionService) {
            this.lifecycleRepo = lifecycleRepo;
            this.connectionRepo = connectionRepo;
            this.publisher = publisher;
            this.clockProvider = clockProvider;
            this.encryptionService = encryptionService;
        }
        async updateAdSet(adSetId, workspaceId, userId, dto) {
            const adset = await this.loadAndValidateAdSet(adSetId, workspaceId);
            if (dto.dailyBudget !== undefined && dto.dailyBudget <= 0) {
                throw new common_1.BadRequestException('Daily budget must be greater than 0.');
            }
            if (dto.lifetimeBudget !== undefined && dto.lifetimeBudget <= 0) {
                throw new common_1.BadRequestException('Lifetime budget must be greater than 0.');
            }
            const start = dto.startTime ? new Date(dto.startTime) : adset.startTime;
            const end = dto.endTime ? new Date(dto.endTime) : adset.endTime;
            if (end && start && end.getTime() <= start.getTime()) {
                throw new common_1.BadRequestException('End time must be greater than start time.');
            }
            const accessToken = await this.getAccessToken(workspaceId);
            try {
                const response = await this.publisher.updateAdSet(adset.externalAdSetId, {
                    ...dto,
                    startTime: dto.startTime ? new Date(dto.startTime) : undefined,
                    endTime: dto.endTime ? new Date(dto.endTime) : undefined,
                }, accessToken);
                await this.lifecycleRepo.updateAdSetAttributes(adSetId, {
                    name: dto.name,
                    dailyBudget: dto.dailyBudget,
                    lifetimeBudget: dto.lifetimeBudget,
                    bidStrategy: dto.bidStrategy,
                    optimizationGoal: dto.optimizationGoal,
                    billingEvent: dto.billingEvent,
                    startTime: dto.startTime ? new Date(dto.startTime) : undefined,
                    endTime: dto.endTime ? new Date(dto.endTime) : undefined,
                    targeting: dto.targeting,
                    updatedBy: userId,
                });
                const history = await this.lifecycleRepo.insertHistory(adSetId, 'UPDATE', adset.status, adset.status, userId, this.clockProvider.now(), response);
                return adset_lifecycle_mapper_1.AdSetLifecycleMapper.toHistoryDto(history);
            }
            catch (err) {
                throw new adset_lifecycle_exceptions_1.MetaOperationFailedException(err.message);
            }
        }
        async pauseAdSet(adSetId, workspaceId, userId) {
            const adset = await this.loadAndValidateAdSet(adSetId, workspaceId);
            const currentEffective = adset.statusDetail?.effectiveStatus || 'ACTIVE';
            if (adset.status === client_1.CampaignStatus.ARCHIVED) {
                throw new adset_lifecycle_exceptions_1.AdSetArchivedException(adSetId);
            }
            if (currentEffective === 'PAUSED' || currentEffective === 'ADSET_PAUSED') {
                throw new adset_lifecycle_exceptions_1.AdSetAlreadyPausedException(adSetId);
            }
            const accessToken = await this.getAccessToken(workspaceId);
            try {
                const response = await this.publisher.pauseAdSet(adset.externalAdSetId, accessToken);
                await this.lifecycleRepo.updateAdSetStatus(adSetId, client_1.CampaignStatus.PUBLISHED, 'PAUSED', this.clockProvider.now(), response, userId);
                const history = await this.lifecycleRepo.insertHistory(adSetId, 'PAUSE', currentEffective, 'PAUSED', userId, this.clockProvider.now(), response);
                return adset_lifecycle_mapper_1.AdSetLifecycleMapper.toHistoryDto(history);
            }
            catch (err) {
                throw new adset_lifecycle_exceptions_1.MetaOperationFailedException(err.message);
            }
        }
        async resumeAdSet(adSetId, workspaceId, userId) {
            const adset = await this.loadAndValidateAdSet(adSetId, workspaceId);
            const currentEffective = adset.statusDetail?.effectiveStatus || 'PAUSED';
            if (adset.status === client_1.CampaignStatus.ARCHIVED) {
                throw new adset_lifecycle_exceptions_1.AdSetArchivedException(adSetId);
            }
            if (currentEffective === 'ACTIVE') {
                throw new adset_lifecycle_exceptions_1.AdSetAlreadyActiveException(adSetId);
            }
            const accessToken = await this.getAccessToken(workspaceId);
            try {
                const response = await this.publisher.resumeAdSet(adset.externalAdSetId, accessToken);
                await this.lifecycleRepo.updateAdSetStatus(adSetId, client_1.CampaignStatus.PUBLISHED, 'ACTIVE', this.clockProvider.now(), response, userId);
                const history = await this.lifecycleRepo.insertHistory(adSetId, 'RESUME', currentEffective, 'ACTIVE', userId, this.clockProvider.now(), response);
                return adset_lifecycle_mapper_1.AdSetLifecycleMapper.toHistoryDto(history);
            }
            catch (err) {
                throw new adset_lifecycle_exceptions_1.MetaOperationFailedException(err.message);
            }
        }
        async archiveAdSet(adSetId, workspaceId, userId) {
            const adset = await this.loadAndValidateAdSet(adSetId, workspaceId);
            const currentEffective = adset.statusDetail?.effectiveStatus || 'ACTIVE';
            if (adset.status === client_1.CampaignStatus.ARCHIVED) {
                throw new adset_lifecycle_exceptions_1.AdSetArchivedException(adSetId);
            }
            const accessToken = await this.getAccessToken(workspaceId);
            try {
                const response = await this.publisher.archiveAdSet(adset.externalAdSetId, accessToken);
                await this.lifecycleRepo.updateAdSetStatus(adSetId, client_1.CampaignStatus.ARCHIVED, 'ARCHIVED', this.clockProvider.now(), response, userId);
                const history = await this.lifecycleRepo.insertHistory(adSetId, 'ARCHIVE', currentEffective, 'ARCHIVED', userId, this.clockProvider.now(), response);
                return adset_lifecycle_mapper_1.AdSetLifecycleMapper.toHistoryDto(history);
            }
            catch (err) {
                throw new adset_lifecycle_exceptions_1.MetaOperationFailedException(err.message);
            }
        }
        async loadAndValidateAdSet(adSetId, workspaceId) {
            const adset = await this.lifecycleRepo.findById(adSetId);
            if (!adset || adset.campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad Set not found.');
            }
            if (!adset.campaign.isPublished || !adset.campaign.externalCampaignId) {
                throw new common_1.BadRequestException('Parent Campaign is not published.');
            }
            if (!adset.externalAdSetId) {
                throw new adset_lifecycle_exceptions_1.AdSetNotPublishedException(adSetId);
            }
            if (adset.status === client_1.CampaignStatus.ARCHIVED) {
                throw new adset_lifecycle_exceptions_1.AdSetArchivedException(adSetId);
            }
            return adset;
        }
        async getAccessToken(workspaceId) {
            const connection = await this.connectionRepo.findByWorkspaceId(workspaceId);
            if (!connection || connection.status !== 'ACTIVE') {
                throw new common_1.NotFoundException('Active Meta Connection not found for workspace.');
            }
            const decrypted = this.encryptionService.decrypt(connection.encryptedAccessToken);
            if (!decrypted) {
                throw new Error('Failed to decrypt Meta connection token.');
            }
            return decrypted;
        }
    };
    return AdSetLifecycleService = _classThis;
})();
exports.AdSetLifecycleService = AdSetLifecycleService;
//# sourceMappingURL=adset-lifecycle.service.js.map
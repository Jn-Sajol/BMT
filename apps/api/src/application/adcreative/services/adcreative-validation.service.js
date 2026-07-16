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
exports.AdCreativeValidationService = void 0;
const common_1 = require("@nestjs/common");
let AdCreativeValidationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdCreativeValidationService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdCreativeValidationService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        campaignRepo;
        pageRepo;
        instagramRepo;
        pixelRepo;
        constructor(campaignRepo, pageRepo, instagramRepo, pixelRepo) {
            this.campaignRepo = campaignRepo;
            this.pageRepo = pageRepo;
            this.instagramRepo = instagramRepo;
            this.pixelRepo = pixelRepo;
        }
        async validateCreate(dto, workspaceId) {
            if (!dto.campaignId) {
                throw new common_1.BadRequestException('Campaign ID is required');
            }
            const campaign = await this.campaignRepo.findById(dto.campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new common_1.BadRequestException('Associated Campaign does not exist in current workspace context');
            }
            if (!dto.name || dto.name.trim().length === 0) {
                throw new common_1.BadRequestException('Ad Creative name is required');
            }
            if (!dto.creativeType) {
                throw new common_1.BadRequestException('Creative type is required');
            }
            const validTypes = ['IMAGE', 'VIDEO', 'CAROUSEL', 'COLLECTION', 'EXISTING_POST'];
            if (!validTypes.includes(dto.creativeType)) {
                throw new common_1.BadRequestException(`Invalid creative type. Supported: ${validTypes.join(', ')}`);
            }
            if (!dto.primaryText || dto.primaryText.trim().length === 0) {
                throw new common_1.BadRequestException('Primary text is required');
            }
            if (!dto.headline || dto.headline.trim().length === 0) {
                throw new common_1.BadRequestException('Headline is required');
            }
            if (!dto.callToAction || dto.callToAction.trim().length === 0) {
                throw new common_1.BadRequestException('Call to Action (CTA) is required');
            }
            if (!dto.destinationUrl || dto.destinationUrl.trim().length === 0) {
                throw new common_1.BadRequestException('Destination URL is required');
            }
            try {
                new URL(dto.destinationUrl);
            }
            catch {
                throw new common_1.BadRequestException('Destination URL must be a valid absolute HTTP/HTTPS URL');
            }
            if (dto.creativeType === 'IMAGE' && !dto.mediaAssetId) {
                throw new common_1.BadRequestException('Media asset ID (image) is required for IMAGE creative type');
            }
            if (dto.creativeType === 'VIDEO' && !dto.mediaAssetId) {
                throw new common_1.BadRequestException('Media asset ID (video) is required for VIDEO creative type');
            }
            if (dto.creativeType === 'CAROUSEL') {
                const spec = dto.creativeSpec;
                if (!spec || !Array.isArray(spec.cards) || spec.cards.length < 2 || spec.cards.length > 10) {
                    throw new common_1.BadRequestException('CAROUSEL creative type requires a creativeSpec containing between 2 and 10 cards');
                }
            }
            if (dto.facebookPageId) {
                const pages = await this.pageRepo.findByWorkspaceId(workspaceId);
                const hasPage = pages.some((p) => p.id === dto.facebookPageId);
                if (!hasPage) {
                    throw new common_1.BadRequestException('Facebook Page does not exist in current workspace context');
                }
            }
            if (dto.instagramAccountId) {
                const instagrams = await this.instagramRepo.findByWorkspaceId(workspaceId);
                const hasInsta = instagrams.some((i) => i.id === dto.instagramAccountId);
                if (!hasInsta) {
                    throw new common_1.BadRequestException('Instagram Account does not exist in current workspace context');
                }
            }
            if (dto.pixelId) {
                const pixels = await this.pixelRepo.findByWorkspaceId(workspaceId);
                const hasPixel = pixels.some((p) => p.id === dto.pixelId);
                if (!hasPixel) {
                    throw new common_1.BadRequestException('Meta Pixel does not exist in current workspace context');
                }
            }
        }
        async validateUpdate(dto, workspaceId) {
            if (dto.name !== undefined && dto.name.trim().length === 0) {
                throw new common_1.BadRequestException('Ad Creative name cannot be empty');
            }
            if (dto.creativeType !== undefined) {
                const validTypes = ['IMAGE', 'VIDEO', 'CAROUSEL', 'COLLECTION', 'EXISTING_POST'];
                if (!validTypes.includes(dto.creativeType)) {
                    throw new common_1.BadRequestException(`Invalid creative type. Supported: ${validTypes.join(', ')}`);
                }
            }
            if (dto.destinationUrl !== undefined) {
                try {
                    new URL(dto.destinationUrl);
                }
                catch {
                    throw new common_1.BadRequestException('Destination URL must be a valid absolute HTTP/HTTPS URL');
                }
            }
            if (dto.facebookPageId) {
                const pages = await this.pageRepo.findByWorkspaceId(workspaceId);
                const hasPage = pages.some((p) => p.id === dto.facebookPageId);
                if (!hasPage) {
                    throw new common_1.BadRequestException('Facebook Page does not exist in current workspace context');
                }
            }
            if (dto.instagramAccountId) {
                const instagrams = await this.instagramRepo.findByWorkspaceId(workspaceId);
                const hasInsta = instagrams.some((i) => i.id === dto.instagramAccountId);
                if (!hasInsta) {
                    throw new common_1.BadRequestException('Instagram Account does not exist in current workspace context');
                }
            }
            if (dto.pixelId) {
                const pixels = await this.pixelRepo.findByWorkspaceId(workspaceId);
                const hasPixel = pixels.some((p) => p.id === dto.pixelId);
                if (!hasPixel) {
                    throw new common_1.BadRequestException('Meta Pixel does not exist in current workspace context');
                }
            }
        }
    };
    return AdCreativeValidationService = _classThis;
})();
exports.AdCreativeValidationService = AdCreativeValidationService;
//# sourceMappingURL=adcreative-validation.service.js.map
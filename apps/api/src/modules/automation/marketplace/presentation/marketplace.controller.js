"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let MarketplaceController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Automation Marketplace & Template Hub'), (0, common_1.Controller)('api/automation/marketplace'), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getTemplates_decorators;
    let _getCategories_decorators;
    let _getTags_decorators;
    let _getFeatured_decorators;
    let _getPopular_decorators;
    let _getRecommended_decorators;
    let _searchTemplates_decorators;
    let _getTemplate_decorators;
    let _publishTemplate_decorators;
    let _updateTemplate_decorators;
    let _installTemplate_decorators;
    let _rollbackInstallation_decorators;
    let _createReview_decorators;
    let _deleteReview_decorators;
    let _getAnalytics_decorators;
    var MarketplaceController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getTemplates_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Browse all templates' })];
            _getCategories_decorators = [(0, common_1.Get)('categories'), (0, swagger_1.ApiOperation)({ summary: 'List categories' })];
            _getTags_decorators = [(0, common_1.Get)('tags'), (0, swagger_1.ApiOperation)({ summary: 'List tags' })];
            _getFeatured_decorators = [(0, common_1.Get)('featured'), (0, swagger_1.ApiOperation)({ summary: 'Get featured official templates list' })];
            _getPopular_decorators = [(0, common_1.Get)('popular'), (0, swagger_1.ApiOperation)({ summary: 'Get popular templates list' })];
            _getRecommended_decorators = [(0, common_1.Get)('recommended'), (0, swagger_1.ApiOperation)({ summary: 'Get AI recommended templates list' })];
            _searchTemplates_decorators = [(0, common_1.Get)('search'), (0, swagger_1.ApiOperation)({ summary: 'Search and filter marketplace templates' })];
            _getTemplate_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get template details and changelog version history' })];
            _publishTemplate_decorators = [(0, common_1.Post)('publish'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Publish template version details' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _updateTemplate_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update master template descriptions' })];
            _installTemplate_decorators = [(0, common_1.Post)(':id/install'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Install template workflow package' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _rollbackInstallation_decorators = [(0, common_1.Post)(':id/rollback'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Rollback installed workflow version' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _createReview_decorators = [(0, common_1.Post)(':id/review'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Post templates feedback review' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _deleteReview_decorators = [(0, common_1.Delete)(':id/review'), (0, swagger_1.ApiOperation)({ summary: 'Delete template feedback review' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getAnalytics_decorators = [(0, common_1.Get)(':id/analytics'), (0, swagger_1.ApiOperation)({ summary: 'Fetch template execution analytics data' })];
            __esDecorate(this, null, _getTemplates_decorators, { kind: "method", name: "getTemplates", static: false, private: false, access: { has: obj => "getTemplates" in obj, get: obj => obj.getTemplates }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getCategories_decorators, { kind: "method", name: "getCategories", static: false, private: false, access: { has: obj => "getCategories" in obj, get: obj => obj.getCategories }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getTags_decorators, { kind: "method", name: "getTags", static: false, private: false, access: { has: obj => "getTags" in obj, get: obj => obj.getTags }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getFeatured_decorators, { kind: "method", name: "getFeatured", static: false, private: false, access: { has: obj => "getFeatured" in obj, get: obj => obj.getFeatured }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPopular_decorators, { kind: "method", name: "getPopular", static: false, private: false, access: { has: obj => "getPopular" in obj, get: obj => obj.getPopular }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRecommended_decorators, { kind: "method", name: "getRecommended", static: false, private: false, access: { has: obj => "getRecommended" in obj, get: obj => obj.getRecommended }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _searchTemplates_decorators, { kind: "method", name: "searchTemplates", static: false, private: false, access: { has: obj => "searchTemplates" in obj, get: obj => obj.searchTemplates }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getTemplate_decorators, { kind: "method", name: "getTemplate", static: false, private: false, access: { has: obj => "getTemplate" in obj, get: obj => obj.getTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _publishTemplate_decorators, { kind: "method", name: "publishTemplate", static: false, private: false, access: { has: obj => "publishTemplate" in obj, get: obj => obj.publishTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateTemplate_decorators, { kind: "method", name: "updateTemplate", static: false, private: false, access: { has: obj => "updateTemplate" in obj, get: obj => obj.updateTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _installTemplate_decorators, { kind: "method", name: "installTemplate", static: false, private: false, access: { has: obj => "installTemplate" in obj, get: obj => obj.installTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _rollbackInstallation_decorators, { kind: "method", name: "rollbackInstallation", static: false, private: false, access: { has: obj => "rollbackInstallation" in obj, get: obj => obj.rollbackInstallation }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createReview_decorators, { kind: "method", name: "createReview", static: false, private: false, access: { has: obj => "createReview" in obj, get: obj => obj.createReview }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteReview_decorators, { kind: "method", name: "deleteReview", static: false, private: false, access: { has: obj => "deleteReview" in obj, get: obj => obj.deleteReview }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAnalytics_decorators, { kind: "method", name: "getAnalytics", static: false, private: false, access: { has: obj => "getAnalytics" in obj, get: obj => obj.getAnalytics }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MarketplaceController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        marketplaceService = __runInitializers(this, _instanceExtraInitializers);
        searchService;
        publisherService;
        installerService;
        reviewService;
        prisma;
        constructor(marketplaceService, searchService, publisherService, installerService, reviewService, prisma) {
            this.marketplaceService = marketplaceService;
            this.searchService = searchService;
            this.publisherService = publisherService;
            this.installerService = installerService;
            this.reviewService = reviewService;
            this.prisma = prisma;
        }
        async getTemplates() {
            return await this.prisma.automationTemplate.findMany({
                include: { versions: true },
            });
        }
        async getCategories() {
            return await this.marketplaceService.getCategories();
        }
        async getTags() {
            return await this.marketplaceService.getTags();
        }
        async getFeatured() {
            return await this.marketplaceService.getFeatured();
        }
        async getPopular() {
            return await this.marketplaceService.getPopular();
        }
        async getRecommended() {
            return await this.marketplaceService.getRecommended();
        }
        async searchTemplates(query, category, visibility) {
            return await this.searchService.search(query, { category, visibility });
        }
        async getTemplate(id) {
            const template = await this.prisma.automationTemplate.findUnique({
                where: { id },
                include: { versions: true, reviews: true },
            });
            if (!template) {
                throw new common_1.NotFoundException(`Template ${id} not found.`);
            }
            return template;
        }
        async publishTemplate(name, description, canvasJson, visibility, version, changelog, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const authorId = req.user?.id || '00000000-0000-0000-0000-000000000000';
            return await this.publisherService.publish(workspaceId, authorId, name, description, canvasJson, visibility, version, changelog);
        }
        async updateTemplate(id, description) {
            return await this.prisma.automationTemplate.update({
                where: { id },
                data: { description },
            });
        }
        async installTemplate(id, version, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';
            return await this.installerService.install(workspaceId, id, version, userId);
        }
        async rollbackInstallation(installationId, version, req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.installerService.rollback(workspaceId, installationId, version);
        }
        async createReview(id, rating, comment, req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.reviewService.createReview(workspaceId, id, rating, comment);
        }
        async deleteReview(reviewId, req) {
            const workspaceId = req.headers['x-workspace-id'];
            await this.reviewService.deleteReview(workspaceId, reviewId);
            return { success: true };
        }
        async getAnalytics(templateId) {
            const record = await this.prisma.automationTemplateAnalytics.findFirst({
                where: { templateId },
            });
            if (!record) {
                return {
                    installs: 0,
                    clones: 0,
                    executions: 0,
                    successRate: 1.0,
                    averageRoi: 0.0,
                };
            }
            return record;
        }
    };
    return MarketplaceController = _classThis;
})();
exports.MarketplaceController = MarketplaceController;
//# sourceMappingURL=marketplace.controller.js.map
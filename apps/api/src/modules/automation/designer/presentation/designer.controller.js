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
exports.DesignerController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let DesignerController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Visual Automation Workflow Designer'), (0, common_1.Controller)('api/automation/workflows'), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getWorkflows_decorators;
    let _getTemplates_decorators;
    let _getWorkflow_decorators;
    let _saveDraft_decorators;
    let _publishWorkflow_decorators;
    let _rollbackWorkflow_decorators;
    let _validateWorkflow_decorators;
    let _importWorkflow_decorators;
    let _exportWorkflow_decorators;
    var DesignerController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getWorkflows_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'List workflows inside current workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getTemplates_decorators = [(0, common_1.Get)('templates'), (0, swagger_1.ApiOperation)({ summary: 'Get templates catalog' })];
            _getWorkflow_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get workflow details and versions list' })];
            _saveDraft_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Save canvas nodes draft configuration' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _publishWorkflow_decorators = [(0, common_1.Post)(':id/publish'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Compile, validate, and publish canvas design' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _rollbackWorkflow_decorators = [(0, common_1.Post)(':id/rollback'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Rollback to a previously published version configuration' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _validateWorkflow_decorators = [(0, common_1.Post)(':id/validate'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Validate canvas layout structure edges and loops' })];
            _importWorkflow_decorators = [(0, common_1.Post)('import'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Import workflow template' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _exportWorkflow_decorators = [(0, common_1.Get)(':id/export'), (0, swagger_1.ApiOperation)({ summary: 'Export workflow template details' })];
            __esDecorate(this, null, _getWorkflows_decorators, { kind: "method", name: "getWorkflows", static: false, private: false, access: { has: obj => "getWorkflows" in obj, get: obj => obj.getWorkflows }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getTemplates_decorators, { kind: "method", name: "getTemplates", static: false, private: false, access: { has: obj => "getTemplates" in obj, get: obj => obj.getTemplates }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getWorkflow_decorators, { kind: "method", name: "getWorkflow", static: false, private: false, access: { has: obj => "getWorkflow" in obj, get: obj => obj.getWorkflow }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _saveDraft_decorators, { kind: "method", name: "saveDraft", static: false, private: false, access: { has: obj => "saveDraft" in obj, get: obj => obj.saveDraft }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _publishWorkflow_decorators, { kind: "method", name: "publishWorkflow", static: false, private: false, access: { has: obj => "publishWorkflow" in obj, get: obj => obj.publishWorkflow }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _rollbackWorkflow_decorators, { kind: "method", name: "rollbackWorkflow", static: false, private: false, access: { has: obj => "rollbackWorkflow" in obj, get: obj => obj.rollbackWorkflow }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _validateWorkflow_decorators, { kind: "method", name: "validateWorkflow", static: false, private: false, access: { has: obj => "validateWorkflow" in obj, get: obj => obj.validateWorkflow }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _importWorkflow_decorators, { kind: "method", name: "importWorkflow", static: false, private: false, access: { has: obj => "importWorkflow" in obj, get: obj => obj.importWorkflow }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _exportWorkflow_decorators, { kind: "method", name: "exportWorkflow", static: false, private: false, access: { has: obj => "exportWorkflow" in obj, get: obj => obj.exportWorkflow }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DesignerController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        managementService = __runInitializers(this, _instanceExtraInitializers);
        validationService;
        prisma;
        constructor(managementService, validationService, prisma) {
            this.managementService = managementService;
            this.validationService = validationService;
            this.prisma = prisma;
        }
        async getWorkflows(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.prisma.automationWorkflow.findMany({
                where: { workspaceId },
                include: { versions: true },
            });
        }
        async getTemplates() {
            return await this.prisma.automationWorkflowTemplate.findMany();
        }
        async getWorkflow(id) {
            const workflow = await this.prisma.automationWorkflow.findUnique({
                where: { id },
                include: { versions: true },
            });
            if (!workflow) {
                throw new common_1.NotFoundException(`Workflow ${id} not found.`);
            }
            return workflow;
        }
        async saveDraft(id, name, canvasJson, req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.managementService.saveDraft(workspaceId, id, name, canvasJson);
        }
        async publishWorkflow(id, notes, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const authorId = req.user?.id || '00000000-0000-0000-0000-000000000000';
            return await this.managementService.publishWorkflow(workspaceId, id, authorId, notes);
        }
        async rollbackWorkflow(id, version, req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.managementService.rollbackWorkflow(workspaceId, id, version);
        }
        async validateWorkflow(id) {
            const draft = await this.prisma.automationWorkflowVersion.findUnique({
                where: {
                    workflowId_version: { workflowId: id, version: 1 },
                },
            });
            if (!draft) {
                throw new common_1.NotFoundException(`Draft version for workflow ${id} not found.`);
            }
            return await this.validationService.validate(draft.canvasJson);
        }
        async importWorkflow(id, name, canvasJson, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const workflow = await this.managementService.saveDraft(workspaceId, id, name, canvasJson);
            return { success: true, workflowId: workflow.id };
        }
        async exportWorkflow(id) {
            const draft = await this.prisma.automationWorkflowVersion.findUnique({
                where: {
                    workflowId_version: { workflowId: id, version: 1 },
                },
            });
            if (!draft) {
                throw new common_1.NotFoundException(`Draft version for workflow ${id} not found.`);
            }
            return {
                workflowId: id,
                canvasJson: draft.canvasJson,
            };
        }
    };
    return DesignerController = _classThis;
})();
exports.DesignerController = DesignerController;
//# sourceMappingURL=designer.controller.js.map
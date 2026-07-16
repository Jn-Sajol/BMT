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
exports.AutomationController = void 0;
const common_1 = require("@nestjs/common");
const automation_rule_dto_1 = require("../application/dto/automation-rule.dto");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let AutomationController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Automation Rule Engine'), (0, common_1.Controller)({ path: 'automation/rules', version: '1' }), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createRule_decorators;
    let _listRules_decorators;
    let _getRule_decorators;
    let _updateRule_decorators;
    let _publishRule_decorators;
    let _activateRule_decorators;
    let _disableRule_decorators;
    let _archiveRule_decorators;
    let _executeRule_decorators;
    var AutomationController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createRule_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Create a new automation rule draft' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }), (0, swagger_1.ApiBody)({ type: automation_rule_dto_1.CreateAutomationRuleDto })];
            _listRules_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'List all automation rules for workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getRule_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get details of a specific automation rule' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _updateRule_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update an automation rule (creates new draft version)' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }), (0, swagger_1.ApiBody)({ type: automation_rule_dto_1.UpdateAutomationRuleDto })];
            _publishRule_decorators = [(0, common_1.Post)(':id/publish'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Publish the latest draft rule version' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _activateRule_decorators = [(0, common_1.Post)(':id/activate'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Activate a published automation rule' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _disableRule_decorators = [(0, common_1.Post)(':id/disable'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Disable an active automation rule' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _archiveRule_decorators = [(0, common_1.Delete)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Archive an automation rule' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _executeRule_decorators = [(0, common_1.Post)(':id/execute'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Manually execute an automation rule' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            __esDecorate(this, null, _createRule_decorators, { kind: "method", name: "createRule", static: false, private: false, access: { has: obj => "createRule" in obj, get: obj => obj.createRule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _listRules_decorators, { kind: "method", name: "listRules", static: false, private: false, access: { has: obj => "listRules" in obj, get: obj => obj.listRules }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRule_decorators, { kind: "method", name: "getRule", static: false, private: false, access: { has: obj => "getRule" in obj, get: obj => obj.getRule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateRule_decorators, { kind: "method", name: "updateRule", static: false, private: false, access: { has: obj => "updateRule" in obj, get: obj => obj.updateRule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _publishRule_decorators, { kind: "method", name: "publishRule", static: false, private: false, access: { has: obj => "publishRule" in obj, get: obj => obj.publishRule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _activateRule_decorators, { kind: "method", name: "activateRule", static: false, private: false, access: { has: obj => "activateRule" in obj, get: obj => obj.activateRule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _disableRule_decorators, { kind: "method", name: "disableRule", static: false, private: false, access: { has: obj => "disableRule" in obj, get: obj => obj.disableRule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _archiveRule_decorators, { kind: "method", name: "archiveRule", static: false, private: false, access: { has: obj => "archiveRule" in obj, get: obj => obj.archiveRule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _executeRule_decorators, { kind: "method", name: "executeRule", static: false, private: false, access: { has: obj => "executeRule" in obj, get: obj => obj.executeRule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AutomationController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        ruleService = __runInitializers(this, _instanceExtraInitializers);
        executionEngine;
        mapper;
        constructor(ruleService, executionEngine, mapper) {
            this.ruleService = ruleService;
            this.executionEngine = executionEngine;
            this.mapper = mapper;
        }
        async createRule(dto, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            const rule = await this.ruleService.createRule(workspaceId, dto, userId);
            return this.mapper.toResponse(rule);
        }
        async listRules(req) {
            const workspaceId = req.headers['x-workspace-id'];
            const rules = await this.ruleService.listRules(workspaceId);
            return this.mapper.toResponseList(rules);
        }
        async getRule(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const rule = await this.ruleService.getRule(id, workspaceId);
            return this.mapper.toResponse(rule);
        }
        async updateRule(id, dto, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            const rule = await this.ruleService.updateRule(id, workspaceId, dto, userId);
            return this.mapper.toResponse(rule);
        }
        async publishRule(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const rule = await this.ruleService.publishRule(id, workspaceId);
            return this.mapper.toResponse(rule);
        }
        async activateRule(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const rule = await this.ruleService.activateRule(id, workspaceId);
            return this.mapper.toResponse(rule);
        }
        async disableRule(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const rule = await this.ruleService.disableRule(id, workspaceId);
            return this.mapper.toResponse(rule);
        }
        async archiveRule(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const rule = await this.ruleService.archiveRule(id, workspaceId);
            return this.mapper.toResponse(rule);
        }
        async executeRule(id, body, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            const dryRun = body.dryRun === true;
            return await this.executionEngine.executeRuleManually(id, workspaceId, body.payload || {}, userId, dryRun);
        }
    };
    return AutomationController = _classThis;
})();
exports.AutomationController = AutomationController;
//# sourceMappingURL=automation.controller.js.map
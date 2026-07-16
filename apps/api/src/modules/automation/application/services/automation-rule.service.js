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
exports.AutomationRuleService = void 0;
const common_1 = require("@nestjs/common");
let AutomationRuleService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AutomationRuleService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AutomationRuleService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        ruleRepo;
        validator;
        constructor(ruleRepo, validator) {
            this.ruleRepo = ruleRepo;
            this.validator = validator;
        }
        async createRule(workspaceId, dto, createdBy) {
            const existing = await this.ruleRepo.findRuleByName(dto.name, workspaceId);
            if (existing) {
                throw new common_1.BadRequestException(`Automation rule with name "${dto.name}" already exists in this workspace.`);
            }
            const schemaVersion = dto.schemaVersion || 1;
            const { ast } = this.validator.validateAndCompile(dto.trigger, dto.conditions, dto.actions, schemaVersion);
            return await this.ruleRepo.createRule(workspaceId, dto.name, dto.description || null, dto.trigger, dto.conditions || null, dto.actions, ast, schemaVersion, createdBy);
        }
        async updateRule(id, workspaceId, dto, updatedBy) {
            const rule = await this.ruleRepo.findRuleById(id, workspaceId);
            if (!rule) {
                throw new common_1.NotFoundException(`Automation rule not found.`);
            }
            const latest = rule.versions[0];
            if (!latest) {
                throw new common_1.BadRequestException('No rule version exists for this rule.');
            }
            const mergedTrigger = dto.trigger !== undefined ? dto.trigger : latest.trigger;
            const mergedConditions = dto.conditions !== undefined ? dto.conditions : latest.conditions;
            const mergedActions = (dto.actions !== undefined ? dto.actions : latest.actions);
            const { ast } = this.validator.validateAndCompile(mergedTrigger, mergedConditions, mergedActions, rule.schemaVersion);
            const nextVersionNumber = latest.version + 1;
            await this.ruleRepo.createNewVersion(id, workspaceId, nextVersionNumber, mergedTrigger, mergedConditions, mergedActions, ast, 'DRAFT', updatedBy);
            await this.ruleRepo.updateRule(id, workspaceId, {
                name: dto.name,
                description: dto.description,
                status: 'DRAFT',
            });
            const updatedRule = await this.ruleRepo.findRuleById(id, workspaceId);
            if (!updatedRule) {
                throw new common_1.NotFoundException('Updated rule could not be loaded.');
            }
            return updatedRule;
        }
        async publishRule(id, workspaceId) {
            const rule = await this.ruleRepo.findRuleById(id, workspaceId);
            if (!rule) {
                throw new common_1.NotFoundException(`Automation rule not found.`);
            }
            const latest = rule.versions[0];
            if (!latest) {
                throw new common_1.BadRequestException('No draft version exists to publish.');
            }
            await this.ruleRepo.updateRuleVersionStatus(id, latest.id, workspaceId, 'PUBLISHED');
            await this.ruleRepo.updateRule(id, workspaceId, { status: 'PUBLISHED' });
            const updated = await this.ruleRepo.findRuleById(id, workspaceId);
            if (!updated)
                throw new common_1.NotFoundException('Published rule could not be loaded.');
            return updated;
        }
        async activateRule(id, workspaceId) {
            const rule = await this.ruleRepo.findRuleById(id, workspaceId);
            if (!rule) {
                throw new common_1.NotFoundException(`Automation rule not found.`);
            }
            const latest = rule.versions[0];
            if (!latest || latest.status === 'DRAFT') {
                throw new common_1.BadRequestException('Rule must be published before activation.');
            }
            await this.ruleRepo.updateRuleVersionStatus(id, latest.id, workspaceId, 'ACTIVE');
            await this.ruleRepo.updateRule(id, workspaceId, { status: 'ACTIVE' });
            const updated = await this.ruleRepo.findRuleById(id, workspaceId);
            if (!updated)
                throw new common_1.NotFoundException('Activated rule could not be loaded.');
            return updated;
        }
        async disableRule(id, workspaceId) {
            const rule = await this.ruleRepo.findRuleById(id, workspaceId);
            if (!rule) {
                throw new common_1.NotFoundException(`Automation rule not found.`);
            }
            const latest = rule.versions[0];
            if (!latest)
                throw new common_1.BadRequestException('No version exists.');
            await this.ruleRepo.updateRuleVersionStatus(id, latest.id, workspaceId, 'DISABLED');
            await this.ruleRepo.updateRule(id, workspaceId, { status: 'DISABLED' });
            const updated = await this.ruleRepo.findRuleById(id, workspaceId);
            if (!updated)
                throw new common_1.NotFoundException('Disabled rule could not be loaded.');
            return updated;
        }
        async archiveRule(id, workspaceId) {
            const rule = await this.ruleRepo.findRuleById(id, workspaceId);
            if (!rule) {
                throw new common_1.NotFoundException(`Automation rule not found.`);
            }
            const latest = rule.versions[0];
            if (latest) {
                await this.ruleRepo.updateRuleVersionStatus(id, latest.id, workspaceId, 'ARCHIVED');
            }
            await this.ruleRepo.updateRule(id, workspaceId, { status: 'ARCHIVED' });
            const updated = await this.ruleRepo.findRuleById(id, workspaceId);
            if (!updated)
                throw new common_1.NotFoundException('Archived rule could not be loaded.');
            return updated;
        }
        async getRule(id, workspaceId) {
            const rule = await this.ruleRepo.findRuleById(id, workspaceId);
            if (!rule) {
                throw new common_1.NotFoundException(`Automation rule not found.`);
            }
            return rule;
        }
        async listRules(workspaceId) {
            return await this.ruleRepo.findRulesByWorkspace(workspaceId);
        }
    };
    return AutomationRuleService = _classThis;
})();
exports.AutomationRuleService = AutomationRuleService;
//# sourceMappingURL=automation-rule.service.js.map
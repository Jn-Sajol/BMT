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
exports.AutomationRuleRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_error_mapper_1 = require("../prisma-error.mapper");
let AutomationRuleRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AutomationRuleRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AutomationRuleRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async createRule(workspaceId, name, description, trigger, conditions, actions, ast, schemaVersion, createdBy) {
            try {
                return await this.prisma.$transaction(async (tx) => {
                    const rule = await tx.automationRule.create({
                        data: {
                            workspaceId,
                            name,
                            description,
                            status: 'DRAFT',
                            schemaVersion,
                            createdBy,
                        },
                    });
                    const version = await tx.automationRuleVersion.create({
                        data: {
                            ruleId: rule.id,
                            version: 1,
                            trigger,
                            conditions: conditions || {},
                            actions,
                            ast,
                            status: 'DRAFT',
                            createdBy,
                        },
                    });
                    return { ...rule, versions: [version] };
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async createNewVersion(ruleId, workspaceId, versionNumber, trigger, conditions, actions, ast, status, createdBy) {
            try {
                return await this.prisma.$transaction(async (tx) => {
                    const rule = await tx.automationRule.findFirst({
                        where: { id: ruleId, workspaceId },
                    });
                    if (!rule) {
                        throw new Error('Automation rule access denied or not found.');
                    }
                    return await tx.automationRuleVersion.create({
                        data: {
                            ruleId,
                            version: versionNumber,
                            trigger,
                            conditions: conditions || {},
                            actions,
                            ast,
                            status,
                            createdBy,
                        },
                    });
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async updateRule(id, workspaceId, data) {
            try {
                return await this.prisma.automationRule.update({
                    where: { id, workspaceId },
                    data,
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async updateRuleVersionStatus(ruleId, versionId, workspaceId, status) {
            try {
                return await this.prisma.$transaction(async (tx) => {
                    const rule = await tx.automationRule.findFirst({
                        where: { id: ruleId, workspaceId },
                    });
                    if (!rule) {
                        throw new Error('Access denied or rule not found.');
                    }
                    return await tx.automationRuleVersion.update({
                        where: { id: versionId, ruleId },
                        data: { status },
                    });
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findRuleById(id, workspaceId) {
            try {
                return await this.prisma.automationRule.findFirst({
                    where: { id, workspaceId },
                    include: { versions: { orderBy: { version: 'desc' } } },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findRuleByName(name, workspaceId) {
            try {
                return await this.prisma.automationRule.findUnique({
                    where: { workspaceId_name: { workspaceId, name } },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findRulesByWorkspace(workspaceId) {
            try {
                return await this.prisma.automationRule.findMany({
                    where: { workspaceId },
                    include: { versions: { orderBy: { version: 'desc' } } },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findLatestVersion(ruleId, workspaceId) {
            try {
                const rule = await this.prisma.automationRule.findFirst({
                    where: { id: ruleId, workspaceId },
                });
                if (!rule)
                    return null;
                return await this.prisma.automationRuleVersion.findFirst({
                    where: { ruleId },
                    orderBy: { version: 'desc' },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findActiveRulesByTriggerType(triggerType, workspaceId) {
            try {
                return await this.prisma.automationRule.findMany({
                    where: {
                        workspaceId,
                        status: 'ACTIVE',
                        versions: {
                            some: {
                                status: 'ACTIVE',
                                trigger: {
                                    path: ['type'],
                                    equals: triggerType,
                                },
                            },
                        },
                    },
                    include: {
                        versions: {
                            where: { status: 'ACTIVE' },
                            orderBy: { version: 'desc' },
                        },
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async createAuditLog(ruleId, versionId, workspaceId, contextId, executionStatus, triggerEvaluated, conditionsMatched, actionsTaken, errorMessage, ruleSnapshot, idempotencyKey, explainability, durationMs) {
            try {
                return await this.prisma.automationAuditLog.create({
                    data: {
                        ruleId,
                        versionId,
                        workspaceId,
                        contextId,
                        idempotencyKey: idempotencyKey || null,
                        executionStatus,
                        triggerEvaluated,
                        conditionsMatched,
                        actionsTaken,
                        errorMessage,
                        ruleSnapshot,
                        explainability: explainability || null,
                        durationMs: durationMs || null,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
    };
    return AutomationRuleRepository = _classThis;
})();
exports.AutomationRuleRepository = AutomationRuleRepository;
//# sourceMappingURL=automation-rule.repository.js.map
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
exports.WorkflowManagementService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let WorkflowManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WorkflowManagementService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            WorkflowManagementService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        compiler;
        validator;
        eventBus;
        prisma;
        constructor(compiler, validator, eventBus, prisma) {
            this.compiler = compiler;
            this.validator = validator;
            this.eventBus = eventBus;
            this.prisma = prisma;
        }
        async saveDraft(workspaceId, id, name, canvasJson) {
            const existing = await this.prisma.automationWorkflow.findUnique({
                where: { id },
            });
            if (!existing) {
                const workflow = await this.prisma.automationWorkflow.create({
                    data: {
                        id,
                        workspaceId,
                        name,
                        status: 'DRAFT',
                        activeVersion: 1,
                    },
                });
                await this.prisma.automationWorkflowVersion.create({
                    data: {
                        workflowId: id,
                        version: 1,
                        canvasJson: canvasJson || {},
                        definitionJson: {},
                        checksum: 'draft',
                        authorId: (0, crypto_1.randomUUID)(),
                    },
                });
                await this.publishEvent('Workflow Created', workspaceId, id, { workflowId: id });
                return workflow;
            }
            await this.prisma.automationWorkflow.update({
                where: { id },
                data: { name, updatedAt: new Date() },
            });
            await this.prisma.automationWorkflowVersion.upsert({
                where: {
                    workflowId_version: { workflowId: id, version: 1 },
                },
                update: {
                    canvasJson: canvasJson || {},
                },
                create: {
                    workflowId: id,
                    version: 1,
                    canvasJson: canvasJson || {},
                    definitionJson: {},
                    checksum: 'draft',
                    authorId: (0, crypto_1.randomUUID)(),
                },
            });
            await this.publishEvent('Workflow Updated', workspaceId, id, { workflowId: id });
            return existing;
        }
        async publishWorkflow(workspaceId, id, authorId, notes) {
            const workflow = await this.prisma.automationWorkflow.findUnique({
                where: { id },
            });
            if (!workflow) {
                throw new common_1.NotFoundException(`Workflow ${id} not found.`);
            }
            const draft = await this.prisma.automationWorkflowVersion.findUnique({
                where: {
                    workflowId_version: { workflowId: id, version: 1 },
                },
            });
            if (!draft) {
                throw new common_1.BadRequestException('Draft version 1 not found.');
            }
            const valResult = await this.validator.validate(draft.canvasJson);
            if (!valResult.isValid) {
                throw new common_1.BadRequestException(`Workflow compilation failed validation rules: ${valResult.issues[0]?.message}`);
            }
            const compResult = await this.compiler.compile(draft.canvasJson);
            const maxVer = await this.prisma.automationWorkflowVersion.aggregate({
                where: { workflowId: id },
                _max: { version: true },
            });
            const nextVer = (maxVer._max.version || 1) + 1;
            const publishedVersion = await this.prisma.automationWorkflowVersion.create({
                data: {
                    workflowId: id,
                    version: nextVer,
                    canvasJson: draft.canvasJson,
                    definitionJson: compResult.definitionJson,
                    checksum: compResult.checksum,
                    authorId,
                    publishNotes: notes || '',
                },
            });
            await this.prisma.automationWorkflow.update({
                where: { id },
                data: {
                    status: 'PUBLISHED',
                    activeVersion: nextVer,
                },
            });
            await this.publishEvent('Workflow Published', workspaceId, id, { workflowId: id, version: nextVer, checksum: compResult.checksum });
            return publishedVersion;
        }
        async rollbackWorkflow(workspaceId, id, targetVersion) {
            const target = await this.prisma.automationWorkflowVersion.findUnique({
                where: {
                    workflowId_version: { workflowId: id, version: targetVersion },
                },
            });
            if (!target || targetVersion === 1) {
                throw new common_1.NotFoundException(`Published version ${targetVersion} not found.`);
            }
            await this.prisma.automationWorkflowVersion.update({
                where: {
                    workflowId_version: { workflowId: id, version: 1 },
                },
                data: {
                    canvasJson: target.canvasJson,
                },
            });
            await this.prisma.automationWorkflow.update({
                where: { id },
                data: {
                    activeVersion: targetVersion,
                    status: 'PUBLISHED',
                },
            });
            await this.publishEvent('Workflow Rolled Back', workspaceId, id, { workflowId: id, targetVersion });
            return target;
        }
        async publishEvent(name, workspaceId, causationId, payload) {
            const event = {
                id: (0, crypto_1.randomUUID)(),
                name,
                workspaceId,
                payload: {
                    entityId: causationId,
                    ...payload,
                },
                triggerVersion: '1.0',
                source: 'Workflow Designer',
                correlationId: (0, crypto_1.randomUUID)(),
                causationId,
                occurredAt: new Date(),
                receivedAt: new Date(),
                processedAt: new Date(),
                timestamp: new Date(),
            };
            await this.eventBus.publish(event);
        }
    };
    return WorkflowManagementService = _classThis;
})();
exports.WorkflowManagementService = WorkflowManagementService;
//# sourceMappingURL=workflow-management.service.js.map
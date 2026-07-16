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
exports.TemplateInstallerService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let TemplateInstallerService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TemplateInstallerService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TemplateInstallerService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        verifier;
        prisma;
        eventBus;
        constructor(verifier, prisma, eventBus) {
            this.verifier = verifier;
            this.prisma = prisma;
            this.eventBus = eventBus;
        }
        async install(workspaceId, templateId, version, userId) {
            const template = await this.prisma.automationTemplate.findUnique({
                where: { id: templateId },
            });
            if (!template) {
                throw new common_1.NotFoundException(`Template ${templateId} not found.`);
            }
            const templateVersion = await this.prisma.automationTemplateVersion.findUnique({
                where: {
                    templateId_version: { templateId, version },
                },
            });
            if (!templateVersion) {
                throw new common_1.NotFoundException(`Template version ${version} not found.`);
            }
            const verified = await this.verifier.verify(templateVersion.canvasJson, templateVersion.signature, templateVersion.checksum);
            if (!verified) {
                await this.publishEvent('TemplateInstallationFailed', workspaceId, templateId, {
                    reason: 'Signature verification failed (package tampered or invalid signature key).',
                });
                throw new common_1.BadRequestException('Security validation failed: Invalid template signature or checksum mismatch.');
            }
            const workflowId = (0, crypto_1.randomUUID)();
            await this.prisma.automationWorkflow.create({
                data: {
                    id: workflowId,
                    workspaceId,
                    name: `Installed: ${template.name}`,
                    status: 'DRAFT',
                    activeVersion: 1,
                },
            });
            await this.prisma.automationWorkflowVersion.create({
                data: {
                    workflowId,
                    version: 1,
                    canvasJson: templateVersion.canvasJson,
                    definitionJson: {},
                    checksum: 'installed-draft',
                    authorId: userId,
                },
            });
            const installation = await this.prisma.automationTemplateInstallation.create({
                data: {
                    templateId,
                    workspaceId,
                    installedVersion: version,
                    status: 'ACTIVE',
                },
            });
            await this.publishEvent('TemplateInstalled', workspaceId, installation.id, {
                templateId,
                installedVersion: version,
                workflowId,
            });
            return installation;
        }
        async rollback(workspaceId, installationId, targetVersion) {
            const installation = await this.prisma.automationTemplateInstallation.findUnique({
                where: { id: installationId },
            });
            if (!installation || installation.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException(`Installation record ${installationId} not found.`);
            }
            const templateVer = await this.prisma.automationTemplateVersion.findUnique({
                where: {
                    templateId_version: { templateId: installation.templateId, version: targetVersion },
                },
            });
            if (!templateVer) {
                throw new common_1.NotFoundException(`Rollback target version ${targetVersion} not found.`);
            }
            const updated = await this.prisma.automationTemplateInstallation.update({
                where: { id: installationId },
                data: {
                    installedVersion: targetVersion,
                },
            });
            await this.publishEvent('TemplateRollbackCompleted', workspaceId, installationId, {
                templateId: installation.templateId,
                targetVersion,
            });
            return updated;
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
                source: 'Template Installer',
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
    return TemplateInstallerService = _classThis;
})();
exports.TemplateInstallerService = TemplateInstallerService;
//# sourceMappingURL=template-installer.service.js.map
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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let NotificationController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Automation Notification Engine'), (0, common_1.Controller)('api/automation/notifications'), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getNotifications_decorators;
    let _getHistory_decorators;
    let _getTemplates_decorators;
    let _createTemplate_decorators;
    let _updateTemplate_decorators;
    let _deleteTemplate_decorators;
    let _getPreferences_decorators;
    let _updatePreferences_decorators;
    let _getProviders_decorators;
    let _createProvider_decorators;
    let _updateProvider_decorators;
    let _testNotification_decorators;
    let _checkHealth_decorators;
    var NotificationController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getNotifications_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'List recent notification logs' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getHistory_decorators = [(0, common_1.Get)('history'), (0, swagger_1.ApiOperation)({ summary: 'List delivery logs' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getTemplates_decorators = [(0, common_1.Get)('templates'), (0, swagger_1.ApiOperation)({ summary: 'List template definitions' })];
            _createTemplate_decorators = [(0, common_1.Post)('templates'), (0, swagger_1.ApiOperation)({ summary: 'Create alert template' })];
            _updateTemplate_decorators = [(0, common_1.Put)('templates/:id'), (0, swagger_1.ApiOperation)({ summary: 'Update alert template' })];
            _deleteTemplate_decorators = [(0, common_1.Delete)('templates/:id'), (0, swagger_1.ApiOperation)({ summary: 'Delete alert template' })];
            _getPreferences_decorators = [(0, common_1.Get)('preferences'), (0, swagger_1.ApiOperation)({ summary: 'List workspace alert settings' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _updatePreferences_decorators = [(0, common_1.Put)('preferences'), (0, swagger_1.ApiOperation)({ summary: 'Update channel preference configuration' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getProviders_decorators = [(0, common_1.Get)('providers'), (0, swagger_1.ApiOperation)({ summary: 'List active notification providers' })];
            _createProvider_decorators = [(0, common_1.Post)('providers'), (0, swagger_1.ApiOperation)({ summary: 'Add provider connection' })];
            _updateProvider_decorators = [(0, common_1.Put)('providers/:id'), (0, swagger_1.ApiOperation)({ summary: 'Update provider configurations' })];
            _testNotification_decorators = [(0, common_1.Post)('test'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Dispatch test notification alert' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _checkHealth_decorators = [(0, common_1.Get)('health'), (0, swagger_1.ApiOperation)({ summary: 'Query engine parameters queue depths and failures' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            __esDecorate(this, null, _getNotifications_decorators, { kind: "method", name: "getNotifications", static: false, private: false, access: { has: obj => "getNotifications" in obj, get: obj => obj.getNotifications }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: obj => "getHistory" in obj, get: obj => obj.getHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getTemplates_decorators, { kind: "method", name: "getTemplates", static: false, private: false, access: { has: obj => "getTemplates" in obj, get: obj => obj.getTemplates }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createTemplate_decorators, { kind: "method", name: "createTemplate", static: false, private: false, access: { has: obj => "createTemplate" in obj, get: obj => obj.createTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateTemplate_decorators, { kind: "method", name: "updateTemplate", static: false, private: false, access: { has: obj => "updateTemplate" in obj, get: obj => obj.updateTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteTemplate_decorators, { kind: "method", name: "deleteTemplate", static: false, private: false, access: { has: obj => "deleteTemplate" in obj, get: obj => obj.deleteTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPreferences_decorators, { kind: "method", name: "getPreferences", static: false, private: false, access: { has: obj => "getPreferences" in obj, get: obj => obj.getPreferences }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updatePreferences_decorators, { kind: "method", name: "updatePreferences", static: false, private: false, access: { has: obj => "updatePreferences" in obj, get: obj => obj.updatePreferences }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getProviders_decorators, { kind: "method", name: "getProviders", static: false, private: false, access: { has: obj => "getProviders" in obj, get: obj => obj.getProviders }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createProvider_decorators, { kind: "method", name: "createProvider", static: false, private: false, access: { has: obj => "createProvider" in obj, get: obj => obj.createProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateProvider_decorators, { kind: "method", name: "updateProvider", static: false, private: false, access: { has: obj => "updateProvider" in obj, get: obj => obj.updateProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _testNotification_decorators, { kind: "method", name: "testNotification", static: false, private: false, access: { has: obj => "testNotification" in obj, get: obj => obj.testNotification }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _checkHealth_decorators, { kind: "method", name: "checkHealth", static: false, private: false, access: { has: obj => "checkHealth" in obj, get: obj => obj.checkHealth }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NotificationController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma = __runInitializers(this, _instanceExtraInitializers);
        constructor(prisma) {
            this.prisma = prisma;
        }
        async getNotifications(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.prisma.automationNotification.findMany({
                where: { workspaceId },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });
        }
        async getHistory(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.prisma.automationNotificationDelivery.findMany({
                where: {
                    notification: { workspaceId },
                },
                include: { notification: true },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });
        }
        async getTemplates() {
            return await this.prisma.automationNotificationTemplate.findMany();
        }
        async createTemplate(name, subject, body) {
            return await this.prisma.automationNotificationTemplate.create({
                data: { name, subject, body },
            });
        }
        async updateTemplate(id, subject, body) {
            return await this.prisma.automationNotificationTemplate.update({
                where: { id },
                data: { subject, body, version: { increment: 1 } },
            });
        }
        async deleteTemplate(id) {
            await this.prisma.automationNotificationTemplate.delete({
                where: { id },
            });
            return { success: true };
        }
        async getPreferences(req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';
            return await this.prisma.automationNotificationPreference.findMany({
                where: { workspaceId, userId },
            });
        }
        async updatePreferences(channel, enabled, severityLevel, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';
            return await this.prisma.automationNotificationPreference.upsert({
                where: {
                    workspaceId_userId_channel: { workspaceId, userId, channel: channel.toUpperCase() },
                },
                update: { enabled, severityLevel },
                create: { workspaceId, userId, channel: channel.toUpperCase(), enabled, severityLevel },
            });
        }
        async getProviders() {
            return await this.prisma.automationNotificationProvider.findMany();
        }
        async createProvider(name, config) {
            return await this.prisma.automationNotificationProvider.create({
                data: { name: name.toUpperCase(), config: config || {}, enabled: true },
            });
        }
        async updateProvider(id, config, enabled) {
            return await this.prisma.automationNotificationProvider.update({
                where: { id },
                data: { config, enabled },
            });
        }
        async testNotification(channel, recipient, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const notification = await this.prisma.automationNotification.create({
                data: {
                    workspaceId,
                    eventName: 'Test Notification Triggered',
                    payload: { channel, recipient },
                    severity: 'INFO',
                },
            });
            const delivery = await this.prisma.automationNotificationDelivery.create({
                data: {
                    notificationId: notification.id,
                    channel: channel.toUpperCase(),
                    recipient,
                    status: 'PENDING',
                },
            });
            return { success: true, notificationId: notification.id, deliveryId: delivery.id };
        }
        async checkHealth(req) {
            const workspaceId = req.headers['x-workspace-id'];
            const pendingCount = await this.prisma.automationNotificationDelivery.count({
                where: {
                    status: 'PENDING',
                    notification: { workspaceId },
                },
            });
            const failedCount = await this.prisma.automationNotificationDelivery.count({
                where: {
                    status: 'FAILED',
                    notification: { workspaceId },
                },
            });
            const sentCount = await this.prisma.automationNotificationDelivery.count({
                where: {
                    status: 'SENT',
                    notification: { workspaceId },
                },
            });
            return {
                status: 'HEALTHY',
                pendingDeliveries: pendingCount,
                failedDeliveries: failedCount,
                deliveredNotifications: sentCount,
                activeChannels: ['EMAIL', 'WEBHOOK', 'IN_APP', 'SLACK'],
            };
        }
    };
    return NotificationController = _classThis;
})();
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map
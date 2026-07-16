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
exports.NotificationPipelineService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let NotificationPipelineService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NotificationPipelineService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NotificationPipelineService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        eventBus;
        templates;
        providers;
        preferences;
        prisma;
        workerTimer;
        isShuttingDown = false;
        constructor(eventBus, templates, providers, preferences, prisma) {
            this.eventBus = eventBus;
            this.templates = templates;
            this.providers = providers;
            this.preferences = preferences;
            this.prisma = prisma;
        }
        onModuleInit() {
            this.eventBus.subscribe('*', this.handleEvent.bind(this));
        }
        onApplicationBootstrap() {
            this.isShuttingDown = false;
            this.workerTimer = setInterval(() => this.processPendingDeliveries(), 5000);
        }
        onApplicationShutdown() {
            this.isShuttingDown = true;
            if (this.workerTimer)
                clearInterval(this.workerTimer);
        }
        async handleEvent(event) {
            const targetNames = [
                'Workflow Published', 'Workflow Failed', 'Workflow Validated',
                'Rule Triggered', 'Rule Failed', 'Action Completed', 'Action Failed',
                'Insights Sync Completed', 'Insights Sync Failed', 'Scheduler Triggered',
                'Circuit Breaker Opened', 'Retry Exhausted', 'Dead Letter Created',
                'Provider Connected', 'Provider Disconnected',
            ];
            if (!targetNames.includes(event.name)) {
                return;
            }
            try {
                const severity = event.name.toLowerCase().includes('failed') || event.name.toLowerCase().includes('opened') ? 'ERROR' : 'INFO';
                const payload = event.payload || {};
                const notification = await this.prisma.automationNotification.create({
                    data: {
                        workspaceId: event.workspaceId,
                        eventName: event.name,
                        payload: payload,
                        severity,
                    },
                });
                await this.publishEvent('Notification Created', event.workspaceId, notification.id, { notificationId: notification.id });
                const userId = payload.userId || '00000000-0000-0000-0000-000000000000';
                const channels = this.providers.getChannels();
                for (const channel of channels) {
                    const allowed = await this.preferences.isChannelAllowed(event.workspaceId, userId, channel, severity);
                    if (!allowed)
                        continue;
                    let template = await this.prisma.automationNotificationTemplate.findFirst({
                        where: { name: event.name },
                    });
                    if (!template) {
                        template = await this.prisma.automationNotificationTemplate.create({
                            data: {
                                name: event.name,
                                subject: `BMT Notification: ${event.name}`,
                                body: `Event {{eventName}} occurred inside workspace {{workspaceId}}.`,
                            },
                        });
                    }
                    const vars = {
                        eventName: event.name,
                        workspaceId: event.workspaceId,
                        details: JSON.stringify(payload),
                    };
                    const renderedBody = this.templates.render(template.body, vars);
                    const delivery = await this.prisma.automationNotificationDelivery.create({
                        data: {
                            notificationId: notification.id,
                            channel,
                            recipient: payload.recipient || (channel === 'EMAIL' ? 'recipient@bmt.io' : 'webhook-url-or-slack-webhook'),
                            status: 'PENDING',
                        },
                    });
                    await this.publishEvent('Notification Queued', event.workspaceId, delivery.id, { deliveryId: delivery.id });
                }
            }
            catch (err) {
                console.error('Notification Pipeline error processing event:', err);
            }
        }
        async processPendingDeliveries() {
            if (this.isShuttingDown)
                return;
            try {
                const pending = await this.prisma.automationNotificationDelivery.findMany({
                    where: { status: 'PENDING' },
                    take: 10,
                });
                for (const delivery of pending) {
                    const updated = await this.prisma.automationNotificationDelivery.updateMany({
                        where: { id: delivery.id, status: 'PENDING' },
                        data: { status: 'PROCESSING' },
                    });
                    if (updated.count === 0)
                        continue;
                    const parent = await this.prisma.automationNotification.findUnique({
                        where: { id: delivery.notificationId },
                    });
                    const provider = this.providers.resolve(delivery.channel);
                    if (!provider || !parent) {
                        await this.prisma.automationNotificationDelivery.update({
                            where: { id: delivery.id },
                            data: { status: 'FAILED', error: 'No compatible channel provider registered.' },
                        });
                        await this.publishEvent('Notification Failed', parent?.workspaceId || 'global', delivery.id, { deliveryId: delivery.id, error: 'No compatible channel provider registered.' });
                        continue;
                    }
                    try {
                        const result = await provider.send({
                            recipient: delivery.recipient,
                            subject: `Alert: ${parent.eventName}`,
                            body: `Alert context: ${JSON.stringify(parent.payload)}`,
                        });
                        if (result.success) {
                            await this.prisma.automationNotificationDelivery.update({
                                where: { id: delivery.id },
                                data: { status: 'SENT' },
                            });
                            await this.publishEvent('Notification Delivered', parent.workspaceId, delivery.id, { deliveryId: delivery.id });
                        }
                        else {
                            throw new Error(result.error || 'Delivery failed.');
                        }
                    }
                    catch (err) {
                        const newRetryCount = delivery.retryCount + 1;
                        if (newRetryCount >= 5) {
                            await this.prisma.automationNotificationDelivery.update({
                                where: { id: delivery.id },
                                data: { status: 'DEAD_LETTERED', error: err.message },
                            });
                            await this.publishEvent('Notification Dead Letter', parent.workspaceId, delivery.id, { deliveryId: delivery.id, error: err.message });
                        }
                        else {
                            await this.prisma.automationNotificationDelivery.update({
                                where: { id: delivery.id },
                                data: { status: 'PENDING', retryCount: newRetryCount, error: err.message },
                            });
                            await this.publishEvent('Notification Retried', parent.workspaceId, delivery.id, { deliveryId: delivery.id, attempt: newRetryCount });
                        }
                    }
                }
            }
            catch {
                // Resilient pass
            }
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
                source: 'Notification Engine',
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
    return NotificationPipelineService = _classThis;
})();
exports.NotificationPipelineService = NotificationPipelineService;
//# sourceMappingURL=notification-pipeline.service.js.map
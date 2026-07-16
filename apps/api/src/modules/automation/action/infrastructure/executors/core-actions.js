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
exports.SendNotificationExecutor = exports.CallWebhookExecutor = exports.ResumeAdExecutor = exports.PauseAdExecutor = exports.ResumeAdSetExecutor = exports.PauseAdSetExecutor = exports.ResumeCampaignExecutor = exports.PauseCampaignExecutor = void 0;
const common_1 = require("@nestjs/common");
function classifyRetryable(err) {
    const errMsg = String(err.message || '').toLowerCase();
    return (errMsg.includes('lock') ||
        errMsg.includes('timeout') ||
        errMsg.includes('429') ||
        errMsg.includes('throttled') ||
        errMsg.includes('network') ||
        errMsg.includes('hang up'));
}
let PauseCampaignExecutor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PauseCampaignExecutor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PauseCampaignExecutor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lifecycle;
        actionType = 'Pause Campaign';
        constructor(lifecycle) {
            this.lifecycle = lifecycle;
        }
        async execute(params, context) {
            const startedAt = new Date();
            if (!params.campaignId) {
                throw new common_1.BadRequestException('campaignId parameter is required.');
            }
            try {
                const result = context.dryRun
                    ? { dryRun: true }
                    : await this.lifecycle.pauseCampaign(params.campaignId, context.workspaceId, context.userId);
                return {
                    actionId: context.actionId,
                    executorName: 'PauseCampaignExecutor',
                    status: 'SUCCESS',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: false,
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params, result },
                };
            }
            catch (err) {
                return {
                    actionId: context.actionId,
                    executorName: 'PauseCampaignExecutor',
                    status: 'FAILED',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: classifyRetryable(err),
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params },
                    error: err.message,
                };
            }
        }
    };
    return PauseCampaignExecutor = _classThis;
})();
exports.PauseCampaignExecutor = PauseCampaignExecutor;
let ResumeCampaignExecutor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ResumeCampaignExecutor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ResumeCampaignExecutor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lifecycle;
        actionType = 'Resume Campaign';
        constructor(lifecycle) {
            this.lifecycle = lifecycle;
        }
        async execute(params, context) {
            const startedAt = new Date();
            if (!params.campaignId) {
                throw new common_1.BadRequestException('campaignId parameter is required.');
            }
            try {
                const result = context.dryRun
                    ? { dryRun: true }
                    : await this.lifecycle.resumeCampaign(params.campaignId, context.workspaceId, context.userId);
                return {
                    actionId: context.actionId,
                    executorName: 'ResumeCampaignExecutor',
                    status: 'SUCCESS',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: false,
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params, result },
                };
            }
            catch (err) {
                return {
                    actionId: context.actionId,
                    executorName: 'ResumeCampaignExecutor',
                    status: 'FAILED',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: classifyRetryable(err),
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params },
                    error: err.message,
                };
            }
        }
    };
    return ResumeCampaignExecutor = _classThis;
})();
exports.ResumeCampaignExecutor = ResumeCampaignExecutor;
let PauseAdSetExecutor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PauseAdSetExecutor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PauseAdSetExecutor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lifecycle;
        actionType = 'Pause AdSet';
        constructor(lifecycle) {
            this.lifecycle = lifecycle;
        }
        async execute(params, context) {
            const startedAt = new Date();
            if (!params.adSetId) {
                throw new common_1.BadRequestException('adSetId parameter is required.');
            }
            try {
                const result = context.dryRun
                    ? { dryRun: true }
                    : await this.lifecycle.pauseAdSet(params.adSetId, context.workspaceId, context.userId);
                return {
                    actionId: context.actionId,
                    executorName: 'PauseAdSetExecutor',
                    status: 'SUCCESS',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: false,
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params, result },
                };
            }
            catch (err) {
                return {
                    actionId: context.actionId,
                    executorName: 'PauseAdSetExecutor',
                    status: 'FAILED',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: classifyRetryable(err),
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params },
                    error: err.message,
                };
            }
        }
    };
    return PauseAdSetExecutor = _classThis;
})();
exports.PauseAdSetExecutor = PauseAdSetExecutor;
let ResumeAdSetExecutor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ResumeAdSetExecutor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ResumeAdSetExecutor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lifecycle;
        actionType = 'Resume AdSet';
        constructor(lifecycle) {
            this.lifecycle = lifecycle;
        }
        async execute(params, context) {
            const startedAt = new Date();
            if (!params.adSetId) {
                throw new common_1.BadRequestException('adSetId parameter is required.');
            }
            try {
                const result = context.dryRun
                    ? { dryRun: true }
                    : await this.lifecycle.resumeAdSet(params.adSetId, context.workspaceId, context.userId);
                return {
                    actionId: context.actionId,
                    executorName: 'ResumeAdSetExecutor',
                    status: 'SUCCESS',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: false,
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params, result },
                };
            }
            catch (err) {
                return {
                    actionId: context.actionId,
                    executorName: 'ResumeAdSetExecutor',
                    status: 'FAILED',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: classifyRetryable(err),
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params },
                    error: err.message,
                };
            }
        }
    };
    return ResumeAdSetExecutor = _classThis;
})();
exports.ResumeAdSetExecutor = ResumeAdSetExecutor;
let PauseAdExecutor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PauseAdExecutor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PauseAdExecutor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lifecycle;
        actionType = 'Pause Ad';
        constructor(lifecycle) {
            this.lifecycle = lifecycle;
        }
        async execute(params, context) {
            const startedAt = new Date();
            if (!params.adId) {
                throw new common_1.BadRequestException('adId parameter is required.');
            }
            try {
                const result = context.dryRun
                    ? { dryRun: true }
                    : await this.lifecycle.pauseAd(params.adId, context.workspaceId, context.userId);
                return {
                    actionId: context.actionId,
                    executorName: 'PauseAdExecutor',
                    status: 'SUCCESS',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: false,
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params, result },
                };
            }
            catch (err) {
                return {
                    actionId: context.actionId,
                    executorName: 'PauseAdExecutor',
                    status: 'FAILED',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: classifyRetryable(err),
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params },
                    error: err.message,
                };
            }
        }
    };
    return PauseAdExecutor = _classThis;
})();
exports.PauseAdExecutor = PauseAdExecutor;
let ResumeAdExecutor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ResumeAdExecutor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ResumeAdExecutor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lifecycle;
        actionType = 'Resume Ad';
        constructor(lifecycle) {
            this.lifecycle = lifecycle;
        }
        async execute(params, context) {
            const startedAt = new Date();
            if (!params.adId) {
                throw new common_1.BadRequestException('adId parameter is required.');
            }
            try {
                const result = context.dryRun
                    ? { dryRun: true }
                    : await this.lifecycle.resumeAd(params.adId, context.workspaceId, context.userId);
                return {
                    actionId: context.actionId,
                    executorName: 'ResumeAdExecutor',
                    status: 'SUCCESS',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: false,
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params, result },
                };
            }
            catch (err) {
                return {
                    actionId: context.actionId,
                    executorName: 'ResumeAdExecutor',
                    status: 'FAILED',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: classifyRetryable(err),
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params },
                    error: err.message,
                };
            }
        }
    };
    return ResumeAdExecutor = _classThis;
})();
exports.ResumeAdExecutor = ResumeAdExecutor;
let CallWebhookExecutor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CallWebhookExecutor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CallWebhookExecutor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        actionType = 'Call Webhook';
        async execute(params, context) {
            const startedAt = new Date();
            if (!params.url) {
                throw new common_1.BadRequestException('url parameter is required.');
            }
            try {
                let result;
                if (context.dryRun) {
                    result = { dryRun: true };
                }
                else {
                    const method = params.method || 'POST';
                    const headers = params.headers || {};
                    const response = await fetch(params.url, {
                        method,
                        headers: { 'Content-Type': 'application/json', ...headers },
                        body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(params.payload || {}) : undefined,
                    });
                    const resText = await response.text();
                    let resData;
                    try {
                        resData = JSON.parse(resText);
                    }
                    catch {
                        resData = resText;
                    }
                    result = { statusCode: response.status, data: resData };
                }
                return {
                    actionId: context.actionId,
                    executorName: 'CallWebhookExecutor',
                    status: 'SUCCESS',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: false,
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params, result },
                };
            }
            catch (err) {
                return {
                    actionId: context.actionId,
                    executorName: 'CallWebhookExecutor',
                    status: 'FAILED',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: classifyRetryable(err),
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params },
                    error: err.message,
                };
            }
        }
    };
    return CallWebhookExecutor = _classThis;
})();
exports.CallWebhookExecutor = CallWebhookExecutor;
let SendNotificationExecutor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SendNotificationExecutor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SendNotificationExecutor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        actionType = 'Send Notification';
        async execute(params, context) {
            const startedAt = new Date();
            try {
                const result = { status: 'NOTIFICATION_SENT', channel: params.channel || 'email', recipient: params.recipient };
                return {
                    actionId: context.actionId,
                    executorName: 'SendNotificationExecutor',
                    status: 'SUCCESS',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: false,
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params, result },
                };
            }
            catch (err) {
                return {
                    actionId: context.actionId,
                    executorName: 'SendNotificationExecutor',
                    status: 'FAILED',
                    startedAt,
                    completedAt: new Date(),
                    duration: Date.now() - startedAt.getTime(),
                    retryable: false,
                    correlationId: context.correlationId,
                    explainability: { action: this.actionType, params },
                    error: err.message,
                };
            }
        }
    };
    return SendNotificationExecutor = _classThis;
})();
exports.SendNotificationExecutor = SendNotificationExecutor;
//# sourceMappingURL=core-actions.js.map
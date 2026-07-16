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
exports.AutomationDispatcher = void 0;
const common_1 = require("@nestjs/common");
let AutomationDispatcher = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AutomationDispatcher = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AutomationDispatcher = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        campaignLifecycle;
        adSetLifecycle;
        adLifecycle;
        constructor(campaignLifecycle, adSetLifecycle, adLifecycle) {
            this.campaignLifecycle = campaignLifecycle;
            this.adSetLifecycle = adSetLifecycle;
            this.adLifecycle = adLifecycle;
        }
        async dispatch(action, workspaceId, userId, dryRun) {
            const actionType = action.type;
            const params = action.params || {};
            if (dryRun) {
                return { dryRun: true, status: 'SKIPPED_DISPATCH', actionType, params };
            }
            switch (actionType) {
                case 'Pause Campaign':
                    if (!params.campaignId)
                        throw new common_1.BadRequestException('campaignId parameter is required.');
                    return await this.campaignLifecycle.pauseCampaign(params.campaignId, workspaceId, userId);
                case 'Resume Campaign':
                    if (!params.campaignId)
                        throw new common_1.BadRequestException('campaignId parameter is required.');
                    return await this.campaignLifecycle.resumeCampaign(params.campaignId, workspaceId, userId);
                case 'Pause AdSet':
                    if (!params.adSetId)
                        throw new common_1.BadRequestException('adSetId parameter is required.');
                    return await this.adSetLifecycle.pauseAdSet(params.adSetId, workspaceId, userId);
                case 'Resume AdSet':
                    if (!params.adSetId)
                        throw new common_1.BadRequestException('adSetId parameter is required.');
                    return await this.adSetLifecycle.resumeAdSet(params.adSetId, workspaceId, userId);
                case 'Pause Ad':
                    if (!params.adId)
                        throw new common_1.BadRequestException('adId parameter is required.');
                    return await this.adLifecycle.pauseAd(params.adId, workspaceId, userId);
                case 'Resume Ad':
                    if (!params.adId)
                        throw new common_1.BadRequestException('adId parameter is required.');
                    return await this.adLifecycle.resumeAd(params.adId, workspaceId, userId);
                case 'Call Webhook':
                    if (!params.url)
                        throw new common_1.BadRequestException('url parameter is required.');
                    const method = params.method || 'POST';
                    const headers = params.headers || {};
                    const response = await fetch(params.url, {
                        method,
                        headers: {
                            'Content-Type': 'application/json',
                            ...headers,
                        },
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
                    return { statusCode: response.status, data: resData };
                case 'Send Notification':
                    return { status: 'NOTIFICATION_SENT', channel: params.channel || 'email', recipient: params.recipient };
                case 'Future AI Action Placeholder':
                    return { status: 'AI_PLACEHOLDER_SKIPPED' };
                default:
                    throw new common_1.BadRequestException(`Unsupported action: ${actionType}`);
            }
        }
    };
    return AutomationDispatcher = _classThis;
})();
exports.AutomationDispatcher = AutomationDispatcher;
//# sourceMappingURL=automation-dispatcher.service.js.map
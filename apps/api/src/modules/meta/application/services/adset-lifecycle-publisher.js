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
exports.AdSetLifecyclePublisher = void 0;
const common_1 = require("@nestjs/common");
let AdSetLifecyclePublisher = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdSetLifecyclePublisher = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdSetLifecyclePublisher = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        baseUrl = 'https://graph.facebook.com/v18.0';
        async updateAdSet(facebookAdSetId, params, accessToken) {
            const body = {};
            if (params.name)
                body.name = params.name;
            if (params.dailyBudget !== undefined)
                body.daily_budget = params.dailyBudget;
            if (params.lifetimeBudget !== undefined)
                body.lifetime_budget = params.lifetimeBudget;
            if (params.bidAmount !== undefined)
                body.bid_amount = params.bidAmount;
            if (params.bidStrategy)
                body.bid_strategy = params.bidStrategy;
            if (params.optimizationGoal)
                body.optimization_goal = params.optimizationGoal;
            if (params.billingEvent)
                body.billing_event = params.billingEvent;
            if (params.startTime)
                body.start_time = Math.round(params.startTime.getTime() / 1000);
            if (params.endTime)
                body.end_time = Math.round(params.endTime.getTime() / 1000);
            if (params.targeting)
                body.targeting = JSON.stringify(params.targeting);
            return await this.postObject(facebookAdSetId, body, accessToken);
        }
        async pauseAdSet(facebookAdSetId, accessToken) {
            return await this.postObject(facebookAdSetId, { status: 'PAUSED' }, accessToken);
        }
        async resumeAdSet(facebookAdSetId, accessToken) {
            return await this.postObject(facebookAdSetId, { status: 'ACTIVE' }, accessToken);
        }
        async archiveAdSet(facebookAdSetId, accessToken) {
            return await this.postObject(facebookAdSetId, { status: 'ARCHIVED' }, accessToken);
        }
        async updateBudget(facebookAdSetId, dailyBudget, lifetimeBudget, accessToken) {
            const body = {};
            if (dailyBudget !== undefined)
                body.daily_budget = dailyBudget;
            if (lifetimeBudget !== undefined)
                body.lifetime_budget = lifetimeBudget;
            return await this.postObject(facebookAdSetId, body, accessToken || '');
        }
        async duplicateAdSet(facebookAdSetId, name, accessToken) {
            const body = {};
            if (name)
                body.name = name;
            return await this.postObject(`${facebookAdSetId}/duplicate`, body, accessToken || '');
        }
        async renameAdSet(facebookAdSetId, name, accessToken) {
            return await this.postObject(facebookAdSetId, { name }, accessToken || '');
        }
        async schedulePause(facebookAdSetId, pauseTime, accessToken) {
            return { success: true, message: `Scheduled pause for ${pauseTime.toISOString()}` };
        }
        async scheduleResume(facebookAdSetId, resumeTime, accessToken) {
            return { success: true, message: `Scheduled resume for ${resumeTime.toISOString()}` };
        }
        async updateTargeting(facebookAdSetId, targeting, accessToken) {
            return await this.postObject(facebookAdSetId, { targeting: JSON.stringify(targeting) }, accessToken || '');
        }
        async postObject(path, body, accessToken) {
            const url = new URL(`${this.baseUrl}/${path}`);
            url.searchParams.append('access_token', accessToken);
            const res = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const errBody = await res.text();
                throw new Error(`Meta Graph API Update failed: ${res.statusText} - ${errBody}`);
            }
            return await res.json();
        }
    };
    return AdSetLifecyclePublisher = _classThis;
})();
exports.AdSetLifecyclePublisher = AdSetLifecyclePublisher;
//# sourceMappingURL=adset-lifecycle-publisher.js.map
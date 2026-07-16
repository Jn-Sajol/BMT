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
exports.AdSetPublisher = void 0;
const common_1 = require("@nestjs/common");
const adset_publish_exceptions_1 = require("../../../../common/exceptions/adset-publish.exceptions");
let AdSetPublisher = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdSetPublisher = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdSetPublisher = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        graphClient;
        constructor(graphClient) {
            this.graphClient = graphClient;
        }
        async publish(adSet, externalCampaignId, accessToken, adAccountExternalId) {
            try {
                const cleanAdAccountId = adAccountExternalId.startsWith('act_')
                    ? adAccountExternalId
                    : `act_${adAccountExternalId}`;
                const payload = {
                    campaign_id: externalCampaignId,
                    name: adSet.name,
                    optimization_goal: adSet.optimizationGoal,
                    billing_event: adSet.billingEvent,
                    status: 'PAUSED',
                    targeting: JSON.stringify(adSet.targeting),
                    start_time: adSet.startTime.toISOString(),
                };
                if (adSet.bidStrategy) {
                    payload.bid_strategy = adSet.bidStrategy;
                }
                if (adSet.dailyBudget) {
                    payload.daily_budget = adSet.dailyBudget * 100;
                }
                else if (adSet.lifetimeBudget) {
                    payload.lifetime_budget = adSet.lifetimeBudget * 100;
                }
                if (adSet.endTime) {
                    payload.end_time = adSet.endTime.toISOString();
                }
                if (adSet.promotedObject) {
                    payload.promoted_object = JSON.stringify(adSet.promotedObject);
                }
                if (adSet.attributionSetting) {
                    payload.attribution_spec = JSON.stringify({
                        attribution_window: adSet.attributionSetting,
                    });
                }
                const response = await this.graphClient.post(`${cleanAdAccountId}/adsets`, accessToken, payload);
                if (!response || !response.id) {
                    throw new adset_publish_exceptions_1.AdSetPublishException('Invalid empty Ad Set response received from Meta Graph API');
                }
                return {
                    externalAdSetId: response.id,
                    rawResponse: response,
                };
            }
            catch (e) {
                throw new adset_publish_exceptions_1.AdSetPublishException(e.message || 'Error occurred during Graph API publish operation', e.response?.data);
            }
        }
    };
    return AdSetPublisher = _classThis;
})();
exports.AdSetPublisher = AdSetPublisher;
//# sourceMappingURL=adset-publisher.js.map
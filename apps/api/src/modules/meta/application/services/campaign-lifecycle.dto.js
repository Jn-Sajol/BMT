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
exports.CampaignLifecycleHistoryDto = exports.UpdateCampaignDto = void 0;
const class_validator_1 = require("class-validator");
let UpdateCampaignDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _specialAdCategories_decorators;
    let _specialAdCategories_initializers = [];
    let _specialAdCategories_extraInitializers = [];
    let _buyingType_decorators;
    let _buyingType_initializers = [];
    let _buyingType_extraInitializers = [];
    let _dailyBudget_decorators;
    let _dailyBudget_initializers = [];
    let _dailyBudget_extraInitializers = [];
    let _lifetimeBudget_decorators;
    let _lifetimeBudget_initializers = [];
    let _lifetimeBudget_extraInitializers = [];
    return class UpdateCampaignDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _specialAdCategories_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _buyingType_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _dailyBudget_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _lifetimeBudget_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _specialAdCategories_decorators, { kind: "field", name: "specialAdCategories", static: false, private: false, access: { has: obj => "specialAdCategories" in obj, get: obj => obj.specialAdCategories, set: (obj, value) => { obj.specialAdCategories = value; } }, metadata: _metadata }, _specialAdCategories_initializers, _specialAdCategories_extraInitializers);
            __esDecorate(null, null, _buyingType_decorators, { kind: "field", name: "buyingType", static: false, private: false, access: { has: obj => "buyingType" in obj, get: obj => obj.buyingType, set: (obj, value) => { obj.buyingType = value; } }, metadata: _metadata }, _buyingType_initializers, _buyingType_extraInitializers);
            __esDecorate(null, null, _dailyBudget_decorators, { kind: "field", name: "dailyBudget", static: false, private: false, access: { has: obj => "dailyBudget" in obj, get: obj => obj.dailyBudget, set: (obj, value) => { obj.dailyBudget = value; } }, metadata: _metadata }, _dailyBudget_initializers, _dailyBudget_extraInitializers);
            __esDecorate(null, null, _lifetimeBudget_decorators, { kind: "field", name: "lifetimeBudget", static: false, private: false, access: { has: obj => "lifetimeBudget" in obj, get: obj => obj.lifetimeBudget, set: (obj, value) => { obj.lifetimeBudget = value; } }, metadata: _metadata }, _lifetimeBudget_initializers, _lifetimeBudget_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        specialAdCategories = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _specialAdCategories_initializers, void 0));
        buyingType = (__runInitializers(this, _specialAdCategories_extraInitializers), __runInitializers(this, _buyingType_initializers, void 0));
        dailyBudget = (__runInitializers(this, _buyingType_extraInitializers), __runInitializers(this, _dailyBudget_initializers, void 0));
        lifetimeBudget = (__runInitializers(this, _dailyBudget_extraInitializers), __runInitializers(this, _lifetimeBudget_initializers, void 0));
        constructor() {
            __runInitializers(this, _lifetimeBudget_extraInitializers);
        }
    };
})();
exports.UpdateCampaignDto = UpdateCampaignDto;
class CampaignLifecycleHistoryDto {
    id;
    campaignId;
    action;
    beforeStatus;
    afterStatus;
    performedBy;
    performedAt;
    metaResponse;
}
exports.CampaignLifecycleHistoryDto = CampaignLifecycleHistoryDto;
//# sourceMappingURL=campaign-lifecycle.dto.js.map
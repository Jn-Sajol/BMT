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
exports.AdSetLifecycleHistoryDto = exports.UpdateAdSetDto = void 0;
const class_validator_1 = require("class-validator");
let UpdateAdSetDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _dailyBudget_decorators;
    let _dailyBudget_initializers = [];
    let _dailyBudget_extraInitializers = [];
    let _lifetimeBudget_decorators;
    let _lifetimeBudget_initializers = [];
    let _lifetimeBudget_extraInitializers = [];
    let _bidAmount_decorators;
    let _bidAmount_initializers = [];
    let _bidAmount_extraInitializers = [];
    let _bidStrategy_decorators;
    let _bidStrategy_initializers = [];
    let _bidStrategy_extraInitializers = [];
    let _optimizationGoal_decorators;
    let _optimizationGoal_initializers = [];
    let _optimizationGoal_extraInitializers = [];
    let _billingEvent_decorators;
    let _billingEvent_initializers = [];
    let _billingEvent_extraInitializers = [];
    let _startTime_decorators;
    let _startTime_initializers = [];
    let _startTime_extraInitializers = [];
    let _endTime_decorators;
    let _endTime_initializers = [];
    let _endTime_extraInitializers = [];
    let _targeting_decorators;
    let _targeting_initializers = [];
    let _targeting_extraInitializers = [];
    return class UpdateAdSetDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _dailyBudget_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _lifetimeBudget_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _bidAmount_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _bidStrategy_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _optimizationGoal_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _billingEvent_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _startTime_decorators = [(0, class_validator_1.IsDateString)(), (0, class_validator_1.IsOptional)()];
            _endTime_decorators = [(0, class_validator_1.IsDateString)(), (0, class_validator_1.IsOptional)()];
            _targeting_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _dailyBudget_decorators, { kind: "field", name: "dailyBudget", static: false, private: false, access: { has: obj => "dailyBudget" in obj, get: obj => obj.dailyBudget, set: (obj, value) => { obj.dailyBudget = value; } }, metadata: _metadata }, _dailyBudget_initializers, _dailyBudget_extraInitializers);
            __esDecorate(null, null, _lifetimeBudget_decorators, { kind: "field", name: "lifetimeBudget", static: false, private: false, access: { has: obj => "lifetimeBudget" in obj, get: obj => obj.lifetimeBudget, set: (obj, value) => { obj.lifetimeBudget = value; } }, metadata: _metadata }, _lifetimeBudget_initializers, _lifetimeBudget_extraInitializers);
            __esDecorate(null, null, _bidAmount_decorators, { kind: "field", name: "bidAmount", static: false, private: false, access: { has: obj => "bidAmount" in obj, get: obj => obj.bidAmount, set: (obj, value) => { obj.bidAmount = value; } }, metadata: _metadata }, _bidAmount_initializers, _bidAmount_extraInitializers);
            __esDecorate(null, null, _bidStrategy_decorators, { kind: "field", name: "bidStrategy", static: false, private: false, access: { has: obj => "bidStrategy" in obj, get: obj => obj.bidStrategy, set: (obj, value) => { obj.bidStrategy = value; } }, metadata: _metadata }, _bidStrategy_initializers, _bidStrategy_extraInitializers);
            __esDecorate(null, null, _optimizationGoal_decorators, { kind: "field", name: "optimizationGoal", static: false, private: false, access: { has: obj => "optimizationGoal" in obj, get: obj => obj.optimizationGoal, set: (obj, value) => { obj.optimizationGoal = value; } }, metadata: _metadata }, _optimizationGoal_initializers, _optimizationGoal_extraInitializers);
            __esDecorate(null, null, _billingEvent_decorators, { kind: "field", name: "billingEvent", static: false, private: false, access: { has: obj => "billingEvent" in obj, get: obj => obj.billingEvent, set: (obj, value) => { obj.billingEvent = value; } }, metadata: _metadata }, _billingEvent_initializers, _billingEvent_extraInitializers);
            __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: obj => "startTime" in obj, get: obj => obj.startTime, set: (obj, value) => { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
            __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: obj => "endTime" in obj, get: obj => obj.endTime, set: (obj, value) => { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
            __esDecorate(null, null, _targeting_decorators, { kind: "field", name: "targeting", static: false, private: false, access: { has: obj => "targeting" in obj, get: obj => obj.targeting, set: (obj, value) => { obj.targeting = value; } }, metadata: _metadata }, _targeting_initializers, _targeting_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        dailyBudget = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _dailyBudget_initializers, void 0));
        lifetimeBudget = (__runInitializers(this, _dailyBudget_extraInitializers), __runInitializers(this, _lifetimeBudget_initializers, void 0));
        bidAmount = (__runInitializers(this, _lifetimeBudget_extraInitializers), __runInitializers(this, _bidAmount_initializers, void 0));
        bidStrategy = (__runInitializers(this, _bidAmount_extraInitializers), __runInitializers(this, _bidStrategy_initializers, void 0));
        optimizationGoal = (__runInitializers(this, _bidStrategy_extraInitializers), __runInitializers(this, _optimizationGoal_initializers, void 0));
        billingEvent = (__runInitializers(this, _optimizationGoal_extraInitializers), __runInitializers(this, _billingEvent_initializers, void 0));
        startTime = (__runInitializers(this, _billingEvent_extraInitializers), __runInitializers(this, _startTime_initializers, void 0));
        endTime = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _endTime_initializers, void 0));
        targeting = (__runInitializers(this, _endTime_extraInitializers), __runInitializers(this, _targeting_initializers, void 0));
        constructor() {
            __runInitializers(this, _targeting_extraInitializers);
        }
    };
})();
exports.UpdateAdSetDto = UpdateAdSetDto;
class AdSetLifecycleHistoryDto {
    id;
    adSetId;
    action;
    beforeStatus;
    afterStatus;
    performedBy;
    performedAt;
    metaResponse;
}
exports.AdSetLifecycleHistoryDto = AdSetLifecycleHistoryDto;
//# sourceMappingURL=adset-lifecycle.dto.js.map
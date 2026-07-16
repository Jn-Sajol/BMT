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
exports.AdLifecycleHistoryDto = exports.UpdateAdDto = void 0;
const class_validator_1 = require("class-validator");
let UpdateAdDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _creativeId_decorators;
    let _creativeId_initializers = [];
    let _creativeId_extraInitializers = [];
    let _trackingSpecs_decorators;
    let _trackingSpecs_initializers = [];
    let _trackingSpecs_extraInitializers = [];
    return class UpdateAdDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _creativeId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _trackingSpecs_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _creativeId_decorators, { kind: "field", name: "creativeId", static: false, private: false, access: { has: obj => "creativeId" in obj, get: obj => obj.creativeId, set: (obj, value) => { obj.creativeId = value; } }, metadata: _metadata }, _creativeId_initializers, _creativeId_extraInitializers);
            __esDecorate(null, null, _trackingSpecs_decorators, { kind: "field", name: "trackingSpecs", static: false, private: false, access: { has: obj => "trackingSpecs" in obj, get: obj => obj.trackingSpecs, set: (obj, value) => { obj.trackingSpecs = value; } }, metadata: _metadata }, _trackingSpecs_initializers, _trackingSpecs_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        creativeId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _creativeId_initializers, void 0));
        trackingSpecs = (__runInitializers(this, _creativeId_extraInitializers), __runInitializers(this, _trackingSpecs_initializers, void 0));
        constructor() {
            __runInitializers(this, _trackingSpecs_extraInitializers);
        }
    };
})();
exports.UpdateAdDto = UpdateAdDto;
class AdLifecycleHistoryDto {
    id;
    adId;
    action;
    beforeStatus;
    afterStatus;
    performedBy;
    performedAt;
    metaResponse;
}
exports.AdLifecycleHistoryDto = AdLifecycleHistoryDto;
//# sourceMappingURL=ad-lifecycle.dto.js.map
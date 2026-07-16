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
exports.AdCreativeLifecycleHistoryDto = exports.UpdateAdCreativeDto = void 0;
const class_validator_1 = require("class-validator");
let UpdateAdCreativeDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _primaryText_decorators;
    let _primaryText_initializers = [];
    let _primaryText_extraInitializers = [];
    let _headline_decorators;
    let _headline_initializers = [];
    let _headline_extraInitializers = [];
    let _destinationUrl_decorators;
    let _destinationUrl_initializers = [];
    let _destinationUrl_extraInitializers = [];
    return class UpdateAdCreativeDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _primaryText_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _headline_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _destinationUrl_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _primaryText_decorators, { kind: "field", name: "primaryText", static: false, private: false, access: { has: obj => "primaryText" in obj, get: obj => obj.primaryText, set: (obj, value) => { obj.primaryText = value; } }, metadata: _metadata }, _primaryText_initializers, _primaryText_extraInitializers);
            __esDecorate(null, null, _headline_decorators, { kind: "field", name: "headline", static: false, private: false, access: { has: obj => "headline" in obj, get: obj => obj.headline, set: (obj, value) => { obj.headline = value; } }, metadata: _metadata }, _headline_initializers, _headline_extraInitializers);
            __esDecorate(null, null, _destinationUrl_decorators, { kind: "field", name: "destinationUrl", static: false, private: false, access: { has: obj => "destinationUrl" in obj, get: obj => obj.destinationUrl, set: (obj, value) => { obj.destinationUrl = value; } }, metadata: _metadata }, _destinationUrl_initializers, _destinationUrl_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        primaryText = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _primaryText_initializers, void 0));
        headline = (__runInitializers(this, _primaryText_extraInitializers), __runInitializers(this, _headline_initializers, void 0));
        destinationUrl = (__runInitializers(this, _headline_extraInitializers), __runInitializers(this, _destinationUrl_initializers, void 0));
        constructor() {
            __runInitializers(this, _destinationUrl_extraInitializers);
        }
    };
})();
exports.UpdateAdCreativeDto = UpdateAdCreativeDto;
class AdCreativeLifecycleHistoryDto {
    id;
    creativeId;
    action;
    beforeStatus;
    afterStatus;
    performedBy;
    performedAt;
    metaResponse;
}
exports.AdCreativeLifecycleHistoryDto = AdCreativeLifecycleHistoryDto;
//# sourceMappingURL=adcreative-lifecycle.dto.js.map
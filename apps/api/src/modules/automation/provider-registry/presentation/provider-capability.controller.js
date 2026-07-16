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
exports.ProviderCapabilityController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../../../common/guards/auth.guard");
let ProviderCapabilityController = (() => {
    let _classDecorators = [(0, common_1.Controller)('api/automation/providers'), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getCapabilities_decorators;
    let _listProviders_decorators;
    var ProviderCapabilityController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getCapabilities_decorators = [(0, common_1.Get)('capabilities')];
            _listProviders_decorators = [(0, common_1.Get)('list')];
            __esDecorate(this, null, _getCapabilities_decorators, { kind: "method", name: "getCapabilities", static: false, private: false, access: { has: obj => "getCapabilities" in obj, get: obj => obj.getCapabilities }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _listProviders_decorators, { kind: "method", name: "listProviders", static: false, private: false, access: { has: obj => "listProviders" in obj, get: obj => obj.listProviders }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ProviderCapabilityController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        registry = __runInitializers(this, _instanceExtraInitializers);
        constructor(registry) {
            this.registry = registry;
        }
        async getCapabilities(provider) {
            if (!provider) {
                throw new common_1.NotFoundException('provider parameter is required.');
            }
            const caps = this.registry.getCapabilities(provider);
            if (!caps) {
                throw new common_1.NotFoundException(`No capabilities found for provider: ${provider}`);
            }
            return caps;
        }
        async listProviders() {
            return this.registry.getProviders();
        }
    };
    return ProviderCapabilityController = _classThis;
})();
exports.ProviderCapabilityController = ProviderCapabilityController;
//# sourceMappingURL=provider-capability.controller.js.map
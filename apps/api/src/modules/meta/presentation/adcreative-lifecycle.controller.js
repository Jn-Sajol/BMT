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
exports.AdCreativeLifecycleController = void 0;
const common_1 = require("@nestjs/common");
const adcreative_lifecycle_dto_1 = require("../application/services/adcreative-lifecycle.dto");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let AdCreativeLifecycleController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('AdCreative Lifecycle Management'), (0, common_1.Controller)({ path: 'creatives', version: '1' }), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _updateAdCreative_decorators;
    var AdCreativeLifecycleController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _updateAdCreative_decorators = [(0, common_1.Patch)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update a published AdCreative attributes on Facebook' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }), (0, swagger_1.ApiBody)({ type: adcreative_lifecycle_dto_1.UpdateAdCreativeDto })];
            __esDecorate(this, null, _updateAdCreative_decorators, { kind: "method", name: "updateAdCreative", static: false, private: false, access: { has: obj => "updateAdCreative" in obj, get: obj => obj.updateAdCreative }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdCreativeLifecycleController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lifecycleService = __runInitializers(this, _instanceExtraInitializers);
        constructor(lifecycleService) {
            this.lifecycleService = lifecycleService;
        }
        async updateAdCreative(creativeId, dto, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.lifecycleService.updateAdCreative(creativeId, workspaceId, userId, dto);
        }
    };
    return AdCreativeLifecycleController = _classThis;
})();
exports.AdCreativeLifecycleController = AdCreativeLifecycleController;
//# sourceMappingURL=adcreative-lifecycle.controller.js.map
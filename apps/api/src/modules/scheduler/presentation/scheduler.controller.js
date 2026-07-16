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
exports.SchedulerController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let SchedulerController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Background Job Scheduler'), (0, common_1.Controller)({ path: 'scheduler', version: '1' }), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _triggerJob_decorators;
    let _cancelJob_decorators;
    var SchedulerController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _triggerJob_decorators = [(0, common_1.Post)('jobs/:id/trigger'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Manually trigger / re-run a background job' })];
            _cancelJob_decorators = [(0, common_1.Post)('jobs/:id/cancel'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Cancel a scheduled or pending background job' })];
            __esDecorate(this, null, _triggerJob_decorators, { kind: "method", name: "triggerJob", static: false, private: false, access: { has: obj => "triggerJob" in obj, get: obj => obj.triggerJob }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _cancelJob_decorators, { kind: "method", name: "cancelJob", static: false, private: false, access: { has: obj => "cancelJob" in obj, get: obj => obj.cancelJob }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SchedulerController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        jobQueue = __runInitializers(this, _instanceExtraInitializers);
        constructor(jobQueue) {
            this.jobQueue = jobQueue;
        }
        async triggerJob(jobId) {
            await this.jobQueue.triggerManual(jobId);
            return { success: true };
        }
        async cancelJob(jobId) {
            await this.jobQueue.cancel(jobId);
            return { success: true };
        }
    };
    return SchedulerController = _classThis;
})();
exports.SchedulerController = SchedulerController;
//# sourceMappingURL=scheduler.controller.js.map
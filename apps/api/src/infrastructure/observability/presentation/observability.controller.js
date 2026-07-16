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
exports.ObservabilityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let ObservabilityController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Observability & Telemetry'), (0, common_1.Controller)('api/observability')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getMetrics_decorators;
    let _getHealth_decorators;
    let _getLiveness_decorators;
    let _getReadiness_decorators;
    var ObservabilityController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getMetrics_decorators = [(0, common_1.Get)('metrics'), (0, swagger_1.ApiOperation)({ summary: 'Prometheus metrics endpoint' })];
            _getHealth_decorators = [(0, common_1.Get)('health'), (0, swagger_1.ApiOperation)({ summary: 'Detailed health check log' })];
            _getLiveness_decorators = [(0, common_1.Get)('live'), (0, swagger_1.ApiOperation)({ summary: 'Liveness check heartbeat' })];
            _getReadiness_decorators = [(0, common_1.Get)('ready'), (0, swagger_1.ApiOperation)({ summary: 'Readiness check verification' })];
            __esDecorate(this, null, _getMetrics_decorators, { kind: "method", name: "getMetrics", static: false, private: false, access: { has: obj => "getMetrics" in obj, get: obj => obj.getMetrics }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getHealth_decorators, { kind: "method", name: "getHealth", static: false, private: false, access: { has: obj => "getHealth" in obj, get: obj => obj.getHealth }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getLiveness_decorators, { kind: "method", name: "getLiveness", static: false, private: false, access: { has: obj => "getLiveness" in obj, get: obj => obj.getLiveness }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getReadiness_decorators, { kind: "method", name: "getReadiness", static: false, private: false, access: { has: obj => "getReadiness" in obj, get: obj => obj.getReadiness }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ObservabilityController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        telemetryService = __runInitializers(this, _instanceExtraInitializers);
        healthService;
        constructor(telemetryService, healthService) {
            this.telemetryService = telemetryService;
            this.healthService = healthService;
        }
        getMetrics(res) {
            res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
            res.status(common_1.HttpStatus.OK).send(this.telemetryService.getPrometheusMetrics());
        }
        async getHealth() {
            return await this.healthService.checkFullStatus();
        }
        getLiveness() {
            return { status: 'UP', heartbeat: true };
        }
        async getReadiness(res) {
            const isDbReady = await this.healthService.checkDatabase();
            if (isDbReady) {
                res.status(common_1.HttpStatus.OK).send({ status: 'READY', database: 'UP' });
            }
            else {
                res.status(common_1.HttpStatus.SERVICE_UNAVAILABLE).send({ status: 'NOT_READY', database: 'DOWN' });
            }
        }
    };
    return ObservabilityController = _classThis;
})();
exports.ObservabilityController = ObservabilityController;
//# sourceMappingURL=observability.controller.js.map
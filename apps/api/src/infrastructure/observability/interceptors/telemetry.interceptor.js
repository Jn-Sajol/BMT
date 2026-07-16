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
exports.TelemetryInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TelemetryInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TelemetryInterceptor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TelemetryInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        telemetryService;
        constructor(telemetryService) {
            this.telemetryService = telemetryService;
        }
        intercept(context, next) {
            const start = Date.now();
            const httpContext = context.switchToHttp();
            const request = httpContext.getRequest();
            return next.handle().pipe((0, operators_1.tap)({
                next: () => {
                    const duration = (Date.now() - start) / 1000;
                    const method = request.method;
                    const route = request.route?.path || request.url;
                    this.telemetryService.increment('http_requests_total', 1, { method, route, status: '200' });
                    this.telemetryService.recordHistogram('http_request_duration_seconds', duration, { method, route });
                },
                error: (err) => {
                    const duration = (Date.now() - start) / 1000;
                    const method = request.method;
                    const route = request.route?.path || request.url;
                    const status = err.status || '500';
                    this.telemetryService.increment('http_requests_total', 1, { method, route, status: status.toString() });
                    this.telemetryService.increment('http_errors_total', 1, { status: status.toString() });
                    this.telemetryService.recordHistogram('http_request_duration_seconds', duration, { method, route });
                }
            }));
        }
    };
    return TelemetryInterceptor = _classThis;
})();
exports.TelemetryInterceptor = TelemetryInterceptor;
//# sourceMappingURL=telemetry.interceptor.js.map
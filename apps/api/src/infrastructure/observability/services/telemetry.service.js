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
exports.TelemetryService = void 0;
const common_1 = require("@nestjs/common");
let TelemetryService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TelemetryService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TelemetryService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        metrics = new Map();
        definitions = new Map();
        constructor() {
            this.register({ name: 'http_requests_total', help: 'Total number of HTTP requests processed', type: 'counter', labels: ['method', 'route', 'status'] });
            this.register({ name: 'http_request_duration_seconds', help: 'Latency of HTTP requests in seconds', type: 'histogram', labels: ['method', 'route'] });
            this.register({ name: 'http_errors_total', help: 'Total count of API error occurrences', type: 'counter', labels: ['status'] });
            this.register({ name: 'queue_depth', help: 'Current number of items waiting in worker queues', type: 'gauge', labels: ['queueName'] });
            this.register({ name: 'notifications_processed_total', help: 'Total notifications sent', type: 'counter', labels: ['channel'] });
            this.register({ name: 'recommendations_generated_total', help: 'Total optimization recommendations generated', type: 'counter', labels: ['provider'] });
            this.register({ name: 'marketplace_installs_total', help: 'Total marketplace templates installed', type: 'counter' });
            this.register({ name: 'workflow_executions_total', help: 'Total automation workflow executions run', type: 'counter', labels: ['status'] });
            this.register({ name: 'database_query_duration_seconds', help: 'Database query execution latency', type: 'histogram' });
            this.register({ name: 'worker_processing_time_seconds', help: 'Worker execution processing time', type: 'histogram', labels: ['workerName'] });
        }
        register(def) {
            this.definitions.set(def.name, def);
            this.metrics.set(def.name, []);
        }
        increment(name, value = 1, labels) {
            const list = this.metrics.get(name) || [];
            const index = list.findIndex(item => this.labelsEqual(item.labels, labels));
            if (index > -1) {
                list[index].value += value;
            }
            else {
                list.push({ value, labels });
            }
            this.metrics.set(name, list);
        }
        setGauge(name, value, labels) {
            const list = this.metrics.get(name) || [];
            const index = list.findIndex(item => this.labelsEqual(item.labels, labels));
            if (index > -1) {
                list[index].value = value;
            }
            else {
                list.push({ value, labels });
            }
            this.metrics.set(name, list);
        }
        recordHistogram(name, value, labels) {
            this.increment(name, value, labels);
        }
        getPrometheusMetrics() {
            let output = '';
            for (const [name, def] of this.definitions.entries()) {
                output += `# HELP ${name} ${def.help}\n`;
                output += `# TYPE ${name} ${def.type}\n`;
                const values = this.metrics.get(name) || [];
                if (values.length === 0) {
                    output += `${name} 0\n`;
                }
                else {
                    for (const item of values) {
                        const labelStr = item.labels
                            ? '{' + Object.entries(item.labels).map(([k, v]) => `${k}="${v}"`).join(',') + '}'
                            : '';
                        output += `${name}${labelStr} ${item.value}\n`;
                    }
                }
                output += '\n';
            }
            return output;
        }
        labelsEqual(a, b) {
            if (!a && !b)
                return true;
            if (!a || !b)
                return false;
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            if (keysA.length !== keysB.length)
                return false;
            return keysA.every(key => a[key] === b[key]);
        }
    };
    return TelemetryService = _classThis;
})();
exports.TelemetryService = TelemetryService;
//# sourceMappingURL=telemetry.service.js.map
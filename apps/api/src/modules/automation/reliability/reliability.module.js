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
exports.ReliabilityModule = void 0;
const common_1 = require("@nestjs/common");
const failure_classifier_service_1 = require("./application/services/failure-classifier.service");
const retry_strategies_1 = require("./application/services/retry-strategies");
const circuit_breaker_service_1 = require("./application/services/circuit-breaker.service");
const retry_queue_service_1 = require("./application/services/retry-queue.service");
const dead_letter_store_service_1 = require("./application/services/dead-letter-store.service");
const reliability_observer_service_1 = require("./application/services/reliability-observer.service");
const retry_worker_service_1 = require("./application/services/retry-worker.service");
const reliability_controller_1 = require("./presentation/reliability.controller");
const action_module_1 = require("../action/action.module");
const database_module_1 = require("../../../infrastructure/database/database.module");
let ReliabilityModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [database_module_1.DatabaseModule, action_module_1.ActionModule],
            controllers: [reliability_controller_1.ReliabilityController],
            providers: [
                failure_classifier_service_1.FailureClassifier,
                retry_strategies_1.RetryStrategyRegistry,
                circuit_breaker_service_1.CircuitBreakerService,
                retry_queue_service_1.RetryQueueService,
                dead_letter_store_service_1.DeadLetterStoreService,
                reliability_observer_service_1.ReliabilityObserver,
                retry_worker_service_1.RetryWorker,
                {
                    provide: 'IFailureClassifier',
                    useClass: failure_classifier_service_1.FailureClassifier,
                },
                {
                    provide: 'ICircuitBreaker',
                    useClass: circuit_breaker_service_1.CircuitBreakerService,
                },
                {
                    provide: 'IRetryQueue',
                    useClass: retry_queue_service_1.RetryQueueService,
                },
                {
                    provide: 'IDeadLetterStore',
                    useClass: dead_letter_store_service_1.DeadLetterStoreService,
                },
            ],
            exports: [
                failure_classifier_service_1.FailureClassifier,
                retry_strategies_1.RetryStrategyRegistry,
                circuit_breaker_service_1.CircuitBreakerService,
                retry_queue_service_1.RetryQueueService,
                dead_letter_store_service_1.DeadLetterStoreService,
                reliability_observer_service_1.ReliabilityObserver,
                retry_worker_service_1.RetryWorker,
                'IFailureClassifier',
                'ICircuitBreaker',
                'IRetryQueue',
                'IDeadLetterStore',
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ReliabilityModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ReliabilityModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return ReliabilityModule = _classThis;
})();
exports.ReliabilityModule = ReliabilityModule;
//# sourceMappingURL=reliability.module.js.map
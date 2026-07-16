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
exports.RetryStrategyRegistry = exports.ExponentialBackoffWithJitterStrategy = exports.ExponentialBackoffStrategy = exports.LinearBackoffStrategy = exports.FixedDelayRetryStrategy = exports.ImmediateRetryStrategy = void 0;
const common_1 = require("@nestjs/common");
let ImmediateRetryStrategy = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ImmediateRetryStrategy = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ImmediateRetryStrategy = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        policyName = 'IMMEDIATE';
        calculateNextRetry(context) {
            return new Date();
        }
    };
    return ImmediateRetryStrategy = _classThis;
})();
exports.ImmediateRetryStrategy = ImmediateRetryStrategy;
let FixedDelayRetryStrategy = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FixedDelayRetryStrategy = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FixedDelayRetryStrategy = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        policyName = 'FIXED';
        calculateNextRetry(context) {
            const delayMs = 5000;
            return new Date(Date.now() + delayMs);
        }
    };
    return FixedDelayRetryStrategy = _classThis;
})();
exports.FixedDelayRetryStrategy = FixedDelayRetryStrategy;
let LinearBackoffStrategy = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LinearBackoffStrategy = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LinearBackoffStrategy = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        policyName = 'LINEAR';
        calculateNextRetry(context) {
            const delayMs = context.retryCount * 5000;
            return new Date(Date.now() + delayMs);
        }
    };
    return LinearBackoffStrategy = _classThis;
})();
exports.LinearBackoffStrategy = LinearBackoffStrategy;
let ExponentialBackoffStrategy = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExponentialBackoffStrategy = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ExponentialBackoffStrategy = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        policyName = 'EXPONENTIAL';
        calculateNextRetry(context) {
            const delayMs = Math.pow(2, context.retryCount) * 1000;
            return new Date(Date.now() + delayMs);
        }
    };
    return ExponentialBackoffStrategy = _classThis;
})();
exports.ExponentialBackoffStrategy = ExponentialBackoffStrategy;
let ExponentialBackoffWithJitterStrategy = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExponentialBackoffWithJitterStrategy = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ExponentialBackoffWithJitterStrategy = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        policyName = 'EXPONENTIAL_JITTER';
        calculateNextRetry(context) {
            const baseDelay = Math.pow(2, context.retryCount) * 1000;
            const jitter = Math.random() * 500;
            return new Date(Date.now() + baseDelay + jitter);
        }
    };
    return ExponentialBackoffWithJitterStrategy = _classThis;
})();
exports.ExponentialBackoffWithJitterStrategy = ExponentialBackoffWithJitterStrategy;
let RetryStrategyRegistry = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RetryStrategyRegistry = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RetryStrategyRegistry = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        strategies = new Map();
        constructor() {
            this.register(new ImmediateRetryStrategy());
            this.register(new FixedDelayRetryStrategy());
            this.register(new LinearBackoffStrategy());
            this.register(new ExponentialBackoffStrategy());
            this.register(new ExponentialBackoffWithJitterStrategy());
        }
        register(strategy) {
            this.strategies.set(strategy.policyName.toUpperCase(), strategy);
        }
        resolve(policy) {
            const strategy = this.strategies.get(policy.toUpperCase());
            if (!strategy) {
                return this.strategies.get('EXPONENTIAL');
            }
            return strategy;
        }
    };
    return RetryStrategyRegistry = _classThis;
})();
exports.RetryStrategyRegistry = RetryStrategyRegistry;
//# sourceMappingURL=retry-strategies.js.map
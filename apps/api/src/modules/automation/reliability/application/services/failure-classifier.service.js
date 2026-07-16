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
exports.FailureClassifier = void 0;
const common_1 = require("@nestjs/common");
let FailureClassifier = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FailureClassifier = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FailureClassifier = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        classifyFailure(error) {
            const message = (error?.message || String(error)).toLowerCase();
            if (message.includes('auth') || message.includes('token') || message.includes('key') || message.includes('unauthorized')) {
                return {
                    category: 'AUTHORIZATION',
                    retryable: false,
                    reason: 'Missing or expired credential validation token.',
                    recommendedPolicy: 'NONE',
                    severity: 'HIGH',
                };
            }
            if (message.includes('validation') || message.includes('invalid') || message.includes('bad request') || message.includes('required')) {
                return {
                    category: 'VALIDATION',
                    retryable: false,
                    reason: 'Request structural payload failed validation schemas.',
                    recommendedPolicy: 'NONE',
                    severity: 'MEDIUM',
                };
            }
            if (message.includes('config') || message.includes('missing account') || message.includes('setup')) {
                return {
                    category: 'CONFIGURATION',
                    retryable: false,
                    reason: 'Rule configuration constraints mismatch.',
                    recommendedPolicy: 'NONE',
                    severity: 'HIGH',
                };
            }
            if (message.includes('rate limit') || message.includes('too many requests') || message.includes('429') || message.includes('throttle')) {
                return {
                    category: 'RATE_LIMIT',
                    retryable: true,
                    reason: 'Provider endpoint throttling limits exceeded.',
                    recommendedPolicy: 'EXPONENTIAL_JITTER',
                    severity: 'HIGH',
                };
            }
            if (message.includes('network') || message.includes('connection') || message.includes('socket') || message.includes('dns') || message.includes('econnrefused')) {
                return {
                    category: 'NETWORK',
                    retryable: true,
                    reason: 'Transient outbound connection timeout or reset.',
                    recommendedPolicy: 'EXPONENTIAL',
                    severity: 'MEDIUM',
                };
            }
            if (message.includes('database') || message.includes('prisma') || message.includes('postgres') || message.includes('sql') || message.includes('unique constraint')) {
                return {
                    category: 'DATABASE',
                    retryable: true,
                    reason: 'Internal storage transaction lock or query failure.',
                    recommendedPolicy: 'FIXED',
                    severity: 'CRITICAL',
                };
            }
            if (message.includes('timeout') || message.includes('deadline') || message.includes('etimedout')) {
                return {
                    category: 'TIMEOUT',
                    retryable: true,
                    reason: 'External HTTP downstream response exceeded threshold deadline.',
                    recommendedPolicy: 'EXPONENTIAL',
                    severity: 'MEDIUM',
                };
            }
            if (message.includes('transient') || message.includes('temporary') || message.includes('503') || message.includes('502')) {
                return {
                    category: 'TRANSIENT',
                    retryable: true,
                    reason: 'Remote service temporarily unavailable.',
                    recommendedPolicy: 'EXPONENTIAL_JITTER',
                    severity: 'LOW',
                };
            }
            return {
                category: 'UNKNOWN',
                retryable: true,
                reason: 'Unclassified execution error caught.',
                recommendedPolicy: 'EXPONENTIAL',
                severity: 'HIGH',
            };
        }
    };
    return FailureClassifier = _classThis;
})();
exports.FailureClassifier = FailureClassifier;
//# sourceMappingURL=failure-classifier.service.js.map
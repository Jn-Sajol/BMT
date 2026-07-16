"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
let WebhookController = (() => {
    let _classDecorators = [(0, common_1.Controller)('webhooks')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _verify_decorators;
    let _handle_decorators;
    var WebhookController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _verify_decorators = [(0, common_1.Get)(':provider')];
            _handle_decorators = [(0, common_1.Post)(':provider'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            __esDecorate(this, null, _verify_decorators, { kind: "method", name: "verify", static: false, private: false, access: { has: obj => "verify" in obj, get: obj => obj.verify }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _handle_decorators, { kind: "method", name: "handle", static: false, private: false, access: { has: obj => "handle" in obj, get: obj => obj.handle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            WebhookController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dispatcher = __runInitializers(this, _instanceExtraInitializers);
        constructor(dispatcher) {
            this.dispatcher = dispatcher;
        }
        verify(mode, token, challenge) {
            const configuredToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'bmt_verify_token';
            if (mode === 'subscribe' && token === configuredToken) {
                return challenge;
            }
            throw new common_1.ForbiddenException('Verification token mismatch.');
        }
        async handle(provider, signature, req, body) {
            if (provider === 'meta') {
                const appSecret = process.env.META_APP_SECRET || 'meta_secret';
                if (!signature) {
                    throw new common_1.ForbiddenException('Missing signature header.');
                }
                const [algo, hash] = signature.split('=');
                if (algo !== 'sha256' || !hash) {
                    throw new common_1.BadRequestException('Invalid signature format.');
                }
                const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(body);
                const expectedHash = crypto
                    .createHmac('sha256', appSecret)
                    .update(rawBody)
                    .digest('hex');
                const bufferHash = Buffer.from(hash, 'utf8');
                const bufferExpected = Buffer.from(expectedHash, 'utf8');
                if (bufferHash.length !== bufferExpected.length || !crypto.timingSafeEqual(bufferHash, bufferExpected)) {
                    throw new common_1.ForbiddenException('Invalid webhook signature.');
                }
                const entry = body.entry?.[0];
                const externalId = entry?.id || `meta_evt_${Date.now()}`;
                await this.dispatcher.dispatch(provider, externalId, body);
            }
            else {
                const externalId = body.id || body.eventId || `evt_${Date.now()}`;
                await this.dispatcher.dispatch(provider, externalId, body);
            }
            return { success: true };
        }
    };
    return WebhookController = _classThis;
})();
exports.WebhookController = WebhookController;
//# sourceMappingURL=webhook.controller.js.map
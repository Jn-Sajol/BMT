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
exports.SecurityModule = exports.RANDOM_STRING_GENERATOR = exports.ENCRYPTION_SERVICE = exports.CLOCK_PROVIDER = exports.UUID_PROVIDER = exports.TOKEN_GENERATOR = exports.PASSWORD_HASHER = void 0;
const common_1 = require("@nestjs/common");
const argon2_password_hasher_1 = require("./argon2-password-hasher");
const secure_token_generator_1 = require("./secure-token-generator");
const uuid_provider_1 = require("./uuid-provider");
const clock_provider_1 = require("./clock-provider");
const aes_256_encryption_1 = require("./aes-256-encryption");
const random_string_generator_1 = require("./random-string-generator");
exports.PASSWORD_HASHER = 'PASSWORD_HASHER';
exports.TOKEN_GENERATOR = 'TOKEN_GENERATOR';
exports.UUID_PROVIDER = 'UUID_PROVIDER';
exports.CLOCK_PROVIDER = 'CLOCK_PROVIDER';
exports.ENCRYPTION_SERVICE = 'ENCRYPTION_SERVICE';
exports.RANDOM_STRING_GENERATOR = 'RANDOM_STRING_GENERATOR';
let SecurityModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            providers: [
                { provide: exports.PASSWORD_HASHER, useClass: argon2_password_hasher_1.Argon2PasswordHasher },
                { provide: exports.TOKEN_GENERATOR, useClass: secure_token_generator_1.SecureTokenGenerator },
                { provide: exports.UUID_PROVIDER, useClass: uuid_provider_1.UuidProvider },
                { provide: exports.CLOCK_PROVIDER, useClass: clock_provider_1.ClockProvider },
                { provide: exports.ENCRYPTION_SERVICE, useClass: aes_256_encryption_1.Aes256Encryption },
                { provide: exports.RANDOM_STRING_GENERATOR, useClass: random_string_generator_1.RandomStringGenerator },
            ],
            exports: [
                exports.PASSWORD_HASHER,
                exports.TOKEN_GENERATOR,
                exports.UUID_PROVIDER,
                exports.CLOCK_PROVIDER,
                exports.ENCRYPTION_SERVICE,
                exports.RANDOM_STRING_GENERATOR,
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SecurityModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SecurityModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return SecurityModule = _classThis;
})();
exports.SecurityModule = SecurityModule;
//# sourceMappingURL=security.module.js.map
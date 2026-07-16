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
exports.SessionResponseDto = exports.CreateSessionDto = void 0;
const class_validator_1 = require("class-validator");
let CreateSessionDto = (() => {
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _userAgent_decorators;
    let _userAgent_initializers = [];
    let _userAgent_extraInitializers = [];
    let _device_decorators;
    let _device_initializers = [];
    let _device_extraInitializers = [];
    let _browser_decorators;
    let _browser_initializers = [];
    let _browser_extraInitializers = [];
    let _os_decorators;
    let _os_initializers = [];
    let _os_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _city_decorators;
    let _city_initializers = [];
    let _city_extraInitializers = [];
    let _tokenHash_decorators;
    let _tokenHash_initializers = [];
    let _tokenHash_extraInitializers = [];
    let _rememberMe_decorators;
    let _rememberMe_initializers = [];
    let _rememberMe_extraInitializers = [];
    return class CreateSessionDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, class_validator_1.IsUUID)('4'), (0, class_validator_1.IsNotEmpty)()];
            _ipAddress_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _userAgent_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _device_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _browser_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _os_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _country_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _city_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _tokenHash_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _rememberMe_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
            __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
            __esDecorate(null, null, _device_decorators, { kind: "field", name: "device", static: false, private: false, access: { has: obj => "device" in obj, get: obj => obj.device, set: (obj, value) => { obj.device = value; } }, metadata: _metadata }, _device_initializers, _device_extraInitializers);
            __esDecorate(null, null, _browser_decorators, { kind: "field", name: "browser", static: false, private: false, access: { has: obj => "browser" in obj, get: obj => obj.browser, set: (obj, value) => { obj.browser = value; } }, metadata: _metadata }, _browser_initializers, _browser_extraInitializers);
            __esDecorate(null, null, _os_decorators, { kind: "field", name: "os", static: false, private: false, access: { has: obj => "os" in obj, get: obj => obj.os, set: (obj, value) => { obj.os = value; } }, metadata: _metadata }, _os_initializers, _os_extraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: obj => "city" in obj, get: obj => obj.city, set: (obj, value) => { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _tokenHash_decorators, { kind: "field", name: "tokenHash", static: false, private: false, access: { has: obj => "tokenHash" in obj, get: obj => obj.tokenHash, set: (obj, value) => { obj.tokenHash = value; } }, metadata: _metadata }, _tokenHash_initializers, _tokenHash_extraInitializers);
            __esDecorate(null, null, _rememberMe_decorators, { kind: "field", name: "rememberMe", static: false, private: false, access: { has: obj => "rememberMe" in obj, get: obj => obj.rememberMe, set: (obj, value) => { obj.rememberMe = value; } }, metadata: _metadata }, _rememberMe_initializers, _rememberMe_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        userId = __runInitializers(this, _userId_initializers, void 0);
        ipAddress = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
        userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
        device = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _device_initializers, void 0));
        browser = (__runInitializers(this, _device_extraInitializers), __runInitializers(this, _browser_initializers, void 0));
        os = (__runInitializers(this, _browser_extraInitializers), __runInitializers(this, _os_initializers, void 0));
        country = (__runInitializers(this, _os_extraInitializers), __runInitializers(this, _country_initializers, void 0));
        city = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _city_initializers, void 0));
        tokenHash = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _tokenHash_initializers, void 0));
        rememberMe = (__runInitializers(this, _tokenHash_extraInitializers), __runInitializers(this, _rememberMe_initializers, false));
        constructor() {
            __runInitializers(this, _rememberMe_extraInitializers);
        }
    };
})();
exports.CreateSessionDto = CreateSessionDto;
class SessionResponseDto {
    id;
    userId;
    tokenHash;
    ipAddress;
    userAgent;
    device;
    browser;
    os;
    country;
    city;
    lastActivityAt;
    expiresAt;
    createdAt;
}
exports.SessionResponseDto = SessionResponseDto;
//# sourceMappingURL=session.dto.js.map
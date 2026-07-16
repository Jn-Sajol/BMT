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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_dto_1 = require("../../common/dto/auth.dto");
const jwt_engine_1 = require("../../infrastructure/security/jwt-engine");
const swagger_1 = require("@nestjs/swagger");
let AuthController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Authentication'), (0, common_1.Controller)({ path: 'auth', version: '1' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _register_decorators;
    let _login_decorators;
    let _logout_decorators;
    let _refresh_decorators;
    let _forgotPassword_decorators;
    let _resetPassword_decorators;
    let _verifyEmail_decorators;
    let _me_decorators;
    var AuthController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _register_decorators = [(0, common_1.Post)('register'), (0, swagger_1.ApiOperation)({ summary: 'Register a new user account' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully registered' })];
            _login_decorators = [(0, common_1.Post)('login'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Authenticate credentials and create session' }), (0, swagger_1.ApiResponse)({ status: 200, type: auth_dto_1.TokenResponseDto })];
            _logout_decorators = [(0, common_1.Post)('logout'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Revoke session and terminate active tokens' })];
            _refresh_decorators = [(0, common_1.Post)('refresh'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using valid refresh token' })];
            _forgotPassword_decorators = [(0, common_1.Post)('forgot-password'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Request password reset token link via email' })];
            _resetPassword_decorators = [(0, common_1.Post)('reset-password'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Execute password reset with valid token' })];
            _verifyEmail_decorators = [(0, common_1.Post)('verify-email'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Verify email using activation token' })];
            _me_decorators = [(0, common_1.Get)('me'), (0, swagger_1.ApiOperation)({ summary: 'Retrieve currently authenticated user details' })];
            __esDecorate(this, null, _register_decorators, { kind: "method", name: "register", static: false, private: false, access: { has: obj => "register" in obj, get: obj => obj.register }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: obj => "login" in obj, get: obj => obj.login }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _logout_decorators, { kind: "method", name: "logout", static: false, private: false, access: { has: obj => "logout" in obj, get: obj => obj.logout }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _refresh_decorators, { kind: "method", name: "refresh", static: false, private: false, access: { has: obj => "refresh" in obj, get: obj => obj.refresh }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _forgotPassword_decorators, { kind: "method", name: "forgotPassword", static: false, private: false, access: { has: obj => "forgotPassword" in obj, get: obj => obj.forgotPassword }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _resetPassword_decorators, { kind: "method", name: "resetPassword", static: false, private: false, access: { has: obj => "resetPassword" in obj, get: obj => obj.resetPassword }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _verifyEmail_decorators, { kind: "method", name: "verifyEmail", static: false, private: false, access: { has: obj => "verifyEmail" in obj, get: obj => obj.verifyEmail }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _me_decorators, { kind: "method", name: "me", static: false, private: false, access: { has: obj => "me" in obj, get: obj => obj.me }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuthController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        authService = __runInitializers(this, _instanceExtraInitializers);
        resetService;
        verificationService;
        constructor(authService, resetService, verificationService) {
            this.authService = authService;
            this.resetService = resetService;
            this.verificationService = verificationService;
        }
        async register(dto) {
            await this.authService.register(dto);
        }
        async login(dto, req) {
            const ipAddress = req.ip;
            const userAgent = req.headers['user-agent'];
            return await this.authService.login(dto, {
                ipAddress,
                userAgent,
            });
        }
        async logout(req) {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return;
            }
            const token = authHeader.substring(7);
            await this.authService.logout(token);
        }
        async refresh(refreshToken, req) {
            const ipAddress = req.ip;
            const userAgent = req.headers['user-agent'];
            return await this.authService.refresh(refreshToken, {
                ipAddress,
                userAgent,
            });
        }
        async forgotPassword(dto) {
            await this.resetService.requestReset(dto);
        }
        async resetPassword(dto) {
            await this.resetService.executeReset({
                token: dto.token,
                newPassword: dto.newPassword,
            });
        }
        async verifyEmail(dto) {
            await this.verificationService.verifyEmail(dto);
        }
        async me(req) {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return null;
            }
            const token = authHeader.substring(7);
            const payload = jwt_engine_1.JwtEngine.verify(token);
            if (!payload || !payload.sub) {
                return null;
            }
            return await this.authService.me(payload.sub);
        }
    };
    return AuthController = _classThis;
})();
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map
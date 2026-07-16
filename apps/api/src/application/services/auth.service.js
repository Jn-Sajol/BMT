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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_engine_1 = require("../../infrastructure/security/jwt-engine");
const auth_exceptions_1 = require("../../common/exceptions/auth-exceptions");
const crypto = __importStar(require("crypto"));
let AuthService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuthService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        userRepo;
        sessionService;
        registrationService;
        permissionService;
        roleRepo;
        passwordHasher;
        tokenGenerator;
        clockProvider;
        constructor(userRepo, sessionService, registrationService, permissionService, roleRepo, passwordHasher, tokenGenerator, clockProvider) {
            this.userRepo = userRepo;
            this.sessionService = sessionService;
            this.registrationService = registrationService;
            this.permissionService = permissionService;
            this.roleRepo = roleRepo;
            this.passwordHasher = passwordHasher;
            this.tokenGenerator = tokenGenerator;
            this.clockProvider = clockProvider;
        }
        async register(dto) {
            await this.registrationService.register({
                email: dto.email,
                name: dto.name || '',
                password: dto.password,
            });
        }
        async login(dto, sessionMeta) {
            const user = await this.userRepo.findByEmail(dto.email);
            if (!user || user.deletedAt) {
                throw new auth_exceptions_1.InvalidCredentialsException();
            }
            const isMatch = await this.passwordHasher.compare(dto.password, user.passwordHash);
            if (!isMatch) {
                throw new auth_exceptions_1.InvalidCredentialsException();
            }
            if (user.status !== 'ACTIVE') {
                throw new auth_exceptions_1.AccountSuspendedException();
            }
            if (!user.emailVerifiedAt) {
                throw new auth_exceptions_1.EmailNotVerifiedException();
            }
            // 1. Generate Access Token & Refresh Token
            const rawRefreshToken = this.tokenGenerator.generate(64);
            const hashedRefresh = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
            // 2. Create User Session using hashed refresh token
            const session = await this.sessionService.createSession({
                userId: user.id,
                tokenHash: hashedRefresh,
                ipAddress: sessionMeta?.ipAddress,
                userAgent: sessionMeta?.userAgent,
                device: sessionMeta?.device,
                browser: sessionMeta?.browser,
                os: sessionMeta?.os,
                country: sessionMeta?.country,
                city: sessionMeta?.city,
                rememberMe: sessionMeta?.rememberMe,
            });
            const accessToken = jwt_engine_1.JwtEngine.sign({ sub: user.id, sessionId: session.id }, 15 * 60);
            return {
                accessToken,
                refreshToken: rawRefreshToken,
                expiresIn: 15 * 60,
            };
        }
        async refresh(refreshToken, sessionMeta) {
            const hashedRefresh = crypto.createHash('sha256').update(refreshToken).digest('hex');
            const session = await this.sessionService.validateSession(hashedRefresh);
            if (!session) {
                throw new auth_exceptions_1.UnauthorizedException('Session expired or invalid refresh token');
            }
            const user = await this.userRepo.findById(session.userId);
            if (!user || user.deletedAt) {
                throw new auth_exceptions_1.UnauthorizedException('User associated with session not found');
            }
            if (user.status !== 'ACTIVE') {
                throw new auth_exceptions_1.AccountSuspendedException();
            }
            // Invalidate previous session/refresh token
            await this.sessionService.revokeSession(session.id);
            // Create new refresh token and session
            const rawNewRefreshToken = this.tokenGenerator.generate(64);
            const newHashedRefresh = crypto.createHash('sha256').update(rawNewRefreshToken).digest('hex');
            const newSession = await this.sessionService.createSession({
                userId: user.id,
                tokenHash: newHashedRefresh,
                ipAddress: sessionMeta?.ipAddress || session.ipAddress || undefined,
                userAgent: sessionMeta?.userAgent || session.userAgent || undefined,
                device: sessionMeta?.device || session.device || undefined,
                browser: sessionMeta?.browser || session.browser || undefined,
                os: sessionMeta?.os || session.os || undefined,
                country: sessionMeta?.country || session.country || undefined,
                city: sessionMeta?.city || session.city || undefined,
                rememberMe: true,
            });
            const newAccessToken = jwt_engine_1.JwtEngine.sign({ sub: user.id, sessionId: newSession.id }, 15 * 60);
            return {
                accessToken: newAccessToken,
                refreshToken: rawNewRefreshToken,
                expiresIn: 15 * 60,
            };
        }
        async logout(accessToken) {
            const payload = jwt_engine_1.JwtEngine.verify(accessToken);
            if (!payload || !payload.sessionId) {
                throw new auth_exceptions_1.TokenInvalidException();
            }
            await this.sessionService.revokeSession(payload.sessionId);
        }
        async me(userId) {
            const user = await this.userRepo.findById(userId);
            if (!user || user.deletedAt) {
                throw new auth_exceptions_1.UnauthorizedException('User not found');
            }
            // Retrieve organization memberships with roles
            const orgMemberships = await this.roleRepo.findUserOrganizationRoles(user.id);
            const organizations = orgMemberships.map((m) => ({
                id: m.organization.id,
                name: m.organization.name,
                slug: m.organization.slug,
                status: m.organization.status,
                role: m.role?.name || null,
            }));
            // Retrieve workspaces with roles
            const workspaceRoles = await this.roleRepo.findUserWorkspaceRoles(user.id);
            const workspaces = workspaceRoles.map((wr) => ({
                id: wr.workspace.id,
                name: wr.workspace.name,
                slug: wr.workspace.slug,
                status: wr.workspace.status,
                role: wr.role.name,
            }));
            // Retrieve all unique user workspace permissions
            const permissions = new Set();
            for (const wr of workspaceRoles) {
                const perms = await this.permissionService.getUserPermissionsForWorkspace(user.id, wr.workspace.id);
                for (const p of perms) {
                    permissions.add(p);
                }
            }
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    status: user.status,
                    createdAt: user.createdAt,
                },
                organizations,
                workspaces,
                permissions: Array.from(permissions),
            };
        }
    };
    return AuthService = _classThis;
})();
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
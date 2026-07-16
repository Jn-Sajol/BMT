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
exports.PasswordResetService = exports.PASSWORD_HISTORY_VALIDATOR = void 0;
const common_1 = require("@nestjs/common");
const password_reset_exceptions_1 = require("../../common/exceptions/password-reset-exceptions");
const password_reset_mapper_1 = require("../../common/mappers/password-reset.mapper");
exports.PASSWORD_HISTORY_VALIDATOR = 'PASSWORD_HISTORY_VALIDATOR';
let PasswordResetService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PasswordResetService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PasswordResetService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        resetRepo;
        userRepo;
        userSessionService;
        tokenGenerator;
        clockProvider;
        passwordHasher;
        historyValidator;
        constructor(resetRepo, userRepo, userSessionService, tokenGenerator, clockProvider, passwordHasher, historyValidator) {
            this.resetRepo = resetRepo;
            this.userRepo = userRepo;
            this.userSessionService = userSessionService;
            this.tokenGenerator = tokenGenerator;
            this.clockProvider = clockProvider;
            this.passwordHasher = passwordHasher;
            this.historyValidator = historyValidator;
        }
        async requestReset(dto) {
            const user = await this.userRepo.findByEmail(dto.email);
            if (!user || user.deletedAt) {
                throw new password_reset_exceptions_1.PasswordResetUserNotFoundException(dto.email);
            }
            const now = this.clockProvider.now();
            // 1. Invalidate previous active password reset tokens
            const lastActive = await this.resetRepo.findLatestActiveToken(user.id);
            if (lastActive) {
                lastActive.usedAt = now;
                await this.resetRepo.save(lastActive);
            }
            // 2. Generate a secure reset token (hex)
            const token = this.tokenGenerator.generate(32);
            const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours expiry
            const resetToken = {
                id: '',
                userId: user.id,
                tokenHash: token,
                createdAt: now,
                expiresAt,
                usedAt: null,
            };
            return await this.resetRepo.save(resetToken);
        }
        async verifyResetToken(token) {
            const tokenRecord = await this.resetRepo.findByTokenHash(token);
            if (!tokenRecord || tokenRecord.usedAt) {
                throw new password_reset_exceptions_1.ResetTokenInvalidException();
            }
            const now = this.clockProvider.now();
            if (tokenRecord.expiresAt < now) {
                throw new password_reset_exceptions_1.ResetTokenExpiredException();
            }
            const user = await this.userRepo.findById(tokenRecord.userId);
            if (!user || user.deletedAt) {
                throw new password_reset_exceptions_1.PasswordResetUserNotFoundException(tokenRecord.userId);
            }
            return password_reset_mapper_1.PasswordResetMapper.toResponse(user, tokenRecord, true);
        }
        async executeReset(dto) {
            const tokenRecord = await this.resetRepo.findByTokenHash(dto.token);
            if (!tokenRecord || tokenRecord.usedAt) {
                throw new password_reset_exceptions_1.ResetTokenInvalidException();
            }
            const now = this.clockProvider.now();
            if (tokenRecord.expiresAt < now) {
                throw new password_reset_exceptions_1.ResetTokenExpiredException();
            }
            const user = await this.userRepo.findById(tokenRecord.userId);
            if (!user || user.deletedAt) {
                throw new password_reset_exceptions_1.PasswordResetUserNotFoundException(tokenRecord.userId);
            }
            // 1. Validate password history (prevent password reuse check)
            await this.historyValidator.validate(user.id, dto.newPassword);
            // 2. Hash new password
            const hashedPassword = await this.passwordHasher.hash(dto.newPassword);
            // 3. Update user password hash
            user.passwordHash = hashedPassword;
            user.updatedAt = now;
            await this.userRepo.save(user);
            // 4. Invalidate the reset token
            tokenRecord.usedAt = now;
            await this.resetRepo.save(tokenRecord);
            // 5. Invalidate existing sessions
            await this.userSessionService.revokeAllSessionsByUserId(user.id);
        }
    };
    return PasswordResetService = _classThis;
})();
exports.PasswordResetService = PasswordResetService;
//# sourceMappingURL=password-reset.service.js.map
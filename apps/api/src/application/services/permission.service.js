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
exports.PermissionService = void 0;
const common_1 = require("@nestjs/common");
const rbac_exceptions_1 = require("../../common/exceptions/rbac-exceptions");
let PermissionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PermissionService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PermissionService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        permissionRepo;
        roleRepo;
        constructor(permissionRepo, roleRepo) {
            this.permissionRepo = permissionRepo;
            this.roleRepo = roleRepo;
        }
        async createPermission(actionKey, description) {
            const existing = await this.permissionRepo.findByActionKey(actionKey);
            if (existing) {
                throw new rbac_exceptions_1.PermissionAlreadyExistsException(actionKey);
            }
            const permission = {
                id: '',
                actionKey,
                description: description || null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            return await this.permissionRepo.save(permission);
        }
        async createRole(name, description, roleType) {
            const existing = await this.roleRepo.findByName(name);
            if (existing) {
                throw new rbac_exceptions_1.RoleAlreadyExistsException(name);
            }
            const role = {
                id: '',
                name,
                description,
                roleType,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            return await this.roleRepo.save(role);
        }
        async assignPermissionToRole(roleName, actionKey) {
            const role = (await this.roleRepo.findByName(roleName));
            if (!role) {
                throw new rbac_exceptions_1.RoleNotFoundException(roleName);
            }
            const permission = await this.permissionRepo.findByActionKey(actionKey);
            if (!permission) {
                throw new rbac_exceptions_1.PermissionNotFoundException(actionKey);
            }
            // Check if association already exists
            const hasAssociation = role.permissions?.some((rp) => rp.permissionId === permission.id);
            if (!hasAssociation) {
                await this.roleRepo.assignPermissionToRole(role.id, permission.id);
            }
        }
        async getUserPermissionsForWorkspace(userId, workspaceId) {
            const roles = await this.roleRepo.findRolesByUserIdForWorkspace(userId, workspaceId);
            const actionKeys = new Set();
            for (const role of roles) {
                const dbRole = (await this.roleRepo.findById(role.id));
                if (dbRole?.permissions) {
                    for (const rp of dbRole.permissions) {
                        actionKeys.add(rp.permission.actionKey);
                    }
                }
            }
            return Array.from(actionKeys);
        }
        async getUserPermissionsForOrganization(userId, organizationId) {
            const roles = await this.roleRepo.findRolesByUserIdForOrganization(userId, organizationId);
            const actionKeys = new Set();
            for (const role of roles) {
                const dbRole = (await this.roleRepo.findById(role.id));
                if (dbRole?.permissions) {
                    for (const rp of dbRole.permissions) {
                        actionKeys.add(rp.permission.actionKey);
                    }
                }
            }
            return Array.from(actionKeys);
        }
    };
    return PermissionService = _classThis;
})();
exports.PermissionService = PermissionService;
//# sourceMappingURL=permission.service.js.map
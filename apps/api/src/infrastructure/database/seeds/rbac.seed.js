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
exports.RbacSeeder = void 0;
const common_1 = require("@nestjs/common");
const permission_code_1 = require("../../../common/security/permission.code");
let RbacSeeder = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RbacSeeder = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RbacSeeder = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        permissionService;
        constructor(permissionService) {
            this.permissionService = permissionService;
        }
        async seed() {
            // 1. Seed Permissions
            for (const code of Object.values(permission_code_1.PermissionCode)) {
                try {
                    await this.permissionService.createPermission(code, `System permission for ${code}`);
                }
                catch (e) {
                    // Skip duplicate error
                }
            }
            // 2. Seed default Organization Roles
            try {
                await this.permissionService.createRole('ORG_OWNER', 'Full Organization Ownership', 'ORGANIZATION');
                await this.permissionService.createRole('ORG_ADMIN', 'Administrative Organization access', 'ORGANIZATION');
                await this.permissionService.createRole('ORG_MEMBER', 'Standard Organization member', 'ORGANIZATION');
            }
            catch (e) { }
            // 3. Seed default Workspace Roles
            try {
                await this.permissionService.createRole('WORKSPACE_ADMIN', 'Full Workspace control', 'WORKSPACE');
                await this.permissionService.createRole('WORKSPACE_CREATOR', 'Content creation & editing', 'WORKSPACE');
                await this.permissionService.createRole('WORKSPACE_AUTOMATOR', 'Browser automation control', 'WORKSPACE');
                await this.permissionService.createRole('WORKSPACE_VIEWER', 'Read-only access', 'WORKSPACE');
            }
            catch (e) { }
            // 4. Map Workspace Admin permissions
            const workspaceAdminPerms = [
                permission_code_1.PermissionCode.CAMPAIGN_CREATE,
                permission_code_1.PermissionCode.CAMPAIGN_READ,
                permission_code_1.PermissionCode.CAMPAIGN_UPDATE,
                permission_code_1.PermissionCode.CAMPAIGN_DELETE,
                permission_code_1.PermissionCode.WORKSPACE_MEMBER_INVITE,
                permission_code_1.PermissionCode.WORKSPACE_MEMBER_REMOVE,
                permission_code_1.PermissionCode.WORKSPACE_MEMBER_UPDATE,
                permission_code_1.PermissionCode.WORKSPACE_SETTINGS_UPDATE,
                permission_code_1.PermissionCode.WORKSPACE_DELETE,
                permission_code_1.PermissionCode.FACEBOOK_PAGE_READ,
                permission_code_1.PermissionCode.FACEBOOK_PAGE_WRITE,
                permission_code_1.PermissionCode.FACEBOOK_ADS_MANAGE,
            ];
            for (const p of workspaceAdminPerms) {
                try {
                    await this.permissionService.assignPermissionToRole('WORKSPACE_ADMIN', p);
                }
                catch (e) { }
            }
            // 5. Map Workspace Creator permissions
            const workspaceCreatorPerms = [
                permission_code_1.PermissionCode.CAMPAIGN_CREATE,
                permission_code_1.PermissionCode.CAMPAIGN_READ,
                permission_code_1.PermissionCode.CAMPAIGN_UPDATE,
                permission_code_1.PermissionCode.FACEBOOK_PAGE_READ,
                permission_code_1.PermissionCode.FACEBOOK_PAGE_WRITE,
            ];
            for (const p of workspaceCreatorPerms) {
                try {
                    await this.permissionService.assignPermissionToRole('WORKSPACE_CREATOR', p);
                }
                catch (e) { }
            }
            // 6. Map Workspace Automator permissions
            const workspaceAutomatorPerms = [
                permission_code_1.PermissionCode.CAMPAIGN_READ,
                permission_code_1.PermissionCode.BROWSER_SESSION_CREATE,
                permission_code_1.PermissionCode.BROWSER_SESSION_READ,
                permission_code_1.PermissionCode.BROWSER_SESSION_DELETE,
            ];
            for (const p of workspaceAutomatorPerms) {
                try {
                    await this.permissionService.assignPermissionToRole('WORKSPACE_AUTOMATOR', p);
                }
                catch (e) { }
            }
            // 7. Map Workspace Viewer permissions
            try {
                await this.permissionService.assignPermissionToRole('WORKSPACE_VIEWER', permission_code_1.PermissionCode.CAMPAIGN_READ);
                await this.permissionService.assignPermissionToRole('WORKSPACE_VIEWER', permission_code_1.PermissionCode.FACEBOOK_PAGE_READ);
            }
            catch (e) { }
            // 8. Map Organization Owner permissions
            const orgOwnerPerms = [
                permission_code_1.PermissionCode.ORGANIZATION_MEMBER_INVITE,
                permission_code_1.PermissionCode.ORGANIZATION_MEMBER_REMOVE,
                permission_code_1.PermissionCode.ORGANIZATION_MEMBER_UPDATE,
                permission_code_1.PermissionCode.ORGANIZATION_SETTINGS_UPDATE,
                permission_code_1.PermissionCode.ORGANIZATION_DELETE,
                permission_code_1.PermissionCode.ORGANIZATION_BILLING_MANAGE,
            ];
            for (const p of orgOwnerPerms) {
                try {
                    await this.permissionService.assignPermissionToRole('ORG_OWNER', p);
                }
                catch (e) { }
            }
        }
    };
    return RbacSeeder = _classThis;
})();
exports.RbacSeeder = RbacSeeder;
//# sourceMappingURL=rbac.seed.js.map
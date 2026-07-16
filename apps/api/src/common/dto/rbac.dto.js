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
exports.PermissionResponseDto = exports.RoleResponseDto = exports.AssignPermissionDto = exports.CreatePermissionDto = exports.CreateRoleDto = void 0;
const class_validator_1 = require("class-validator");
const permission_code_1 = require("../security/permission.code");
let CreateRoleDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _roleType_decorators;
    let _roleType_initializers = [];
    let _roleType_extraInitializers = [];
    return class CreateRoleDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _roleType_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(['ORGANIZATION', 'WORKSPACE'])];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _roleType_decorators, { kind: "field", name: "roleType", static: false, private: false, access: { has: obj => "roleType" in obj, get: obj => obj.roleType, set: (obj, value) => { obj.roleType = value; } }, metadata: _metadata }, _roleType_initializers, _roleType_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
        roleType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _roleType_initializers, void 0));
        constructor() {
            __runInitializers(this, _roleType_extraInitializers);
        }
    };
})();
exports.CreateRoleDto = CreateRoleDto;
let CreatePermissionDto = (() => {
    let _actionKey_decorators;
    let _actionKey_initializers = [];
    let _actionKey_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    return class CreatePermissionDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _actionKey_decorators = [(0, class_validator_1.IsEnum)(permission_code_1.PermissionCode), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _actionKey_decorators, { kind: "field", name: "actionKey", static: false, private: false, access: { has: obj => "actionKey" in obj, get: obj => obj.actionKey, set: (obj, value) => { obj.actionKey = value; } }, metadata: _metadata }, _actionKey_initializers, _actionKey_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        actionKey = __runInitializers(this, _actionKey_initializers, void 0);
        description = (__runInitializers(this, _actionKey_extraInitializers), __runInitializers(this, _description_initializers, void 0));
        constructor() {
            __runInitializers(this, _description_extraInitializers);
        }
    };
})();
exports.CreatePermissionDto = CreatePermissionDto;
let AssignPermissionDto = (() => {
    let _roleName_decorators;
    let _roleName_initializers = [];
    let _roleName_extraInitializers = [];
    let _actionKey_decorators;
    let _actionKey_initializers = [];
    let _actionKey_extraInitializers = [];
    return class AssignPermissionDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _roleName_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _actionKey_decorators = [(0, class_validator_1.IsEnum)(permission_code_1.PermissionCode), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _roleName_decorators, { kind: "field", name: "roleName", static: false, private: false, access: { has: obj => "roleName" in obj, get: obj => obj.roleName, set: (obj, value) => { obj.roleName = value; } }, metadata: _metadata }, _roleName_initializers, _roleName_extraInitializers);
            __esDecorate(null, null, _actionKey_decorators, { kind: "field", name: "actionKey", static: false, private: false, access: { has: obj => "actionKey" in obj, get: obj => obj.actionKey, set: (obj, value) => { obj.actionKey = value; } }, metadata: _metadata }, _actionKey_initializers, _actionKey_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        roleName = __runInitializers(this, _roleName_initializers, void 0);
        actionKey = (__runInitializers(this, _roleName_extraInitializers), __runInitializers(this, _actionKey_initializers, void 0));
        constructor() {
            __runInitializers(this, _actionKey_extraInitializers);
        }
    };
})();
exports.AssignPermissionDto = AssignPermissionDto;
class RoleResponseDto {
    id;
    name;
    description;
    roleType;
    createdAt;
}
exports.RoleResponseDto = RoleResponseDto;
class PermissionResponseDto {
    id;
    actionKey;
    description;
    createdAt;
}
exports.PermissionResponseDto = PermissionResponseDto;
//# sourceMappingURL=rbac.dto.js.map
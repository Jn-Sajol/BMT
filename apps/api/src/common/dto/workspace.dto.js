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
exports.UpdateWorkspacePreferencesDto = exports.UpdateWorkspaceSettingsDto = exports.WorkspaceListDto = exports.UpdateWorkspaceDto = exports.CreateWorkspaceDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
let CreateWorkspaceDto = (() => {
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _slug_decorators;
    let _slug_initializers = [];
    let _slug_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _workspaceType_decorators;
    let _workspaceType_initializers = [];
    let _workspaceType_extraInitializers = [];
    let _visibility_decorators;
    let _visibility_initializers = [];
    let _visibility_extraInitializers = [];
    return class CreateWorkspaceDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, class_validator_1.IsUUID)('4', { message: 'Organization ID must be a valid UUID v4' }), (0, class_validator_1.IsNotEmpty)()];
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'Workspace name is required' })];
            _slug_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'Slug is required' }), (0, class_validator_1.Matches)(/^[a-z0-9-]+$/, { message: 'Slug format must contain lowercase alphanumeric characters and hyphens only' })];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _workspaceType_decorators = [(0, class_validator_1.IsEnum)(client_1.WorkspaceType, { message: 'Workspace type must be SAFE or ADVANCED' }), (0, class_validator_1.IsNotEmpty)()];
            _visibility_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.WorkspaceVisibility, { message: 'Visibility must be PRIVATE, TEAM, or ORGANIZATION' })];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: obj => "slug" in obj, get: obj => obj.slug, set: (obj, value) => { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _workspaceType_decorators, { kind: "field", name: "workspaceType", static: false, private: false, access: { has: obj => "workspaceType" in obj, get: obj => obj.workspaceType, set: (obj, value) => { obj.workspaceType = value; } }, metadata: _metadata }, _workspaceType_initializers, _workspaceType_extraInitializers);
            __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: obj => "visibility" in obj, get: obj => obj.visibility, set: (obj, value) => { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        organizationId = __runInitializers(this, _organizationId_initializers, void 0);
        name = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
        slug = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
        description = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _description_initializers, void 0));
        workspaceType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _workspaceType_initializers, void 0));
        visibility = (__runInitializers(this, _workspaceType_extraInitializers), __runInitializers(this, _visibility_initializers, client_1.WorkspaceVisibility.ORGANIZATION));
        constructor() {
            __runInitializers(this, _visibility_extraInitializers);
        }
    };
})();
exports.CreateWorkspaceDto = CreateWorkspaceDto;
let UpdateWorkspaceDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _slug_decorators;
    let _slug_initializers = [];
    let _slug_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _visibility_decorators;
    let _visibility_initializers = [];
    let _visibility_extraInitializers = [];
    return class UpdateWorkspaceDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _slug_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.Matches)(/^[a-z0-9-]+$/, { message: 'Slug format must contain lowercase alphanumeric characters and hyphens only' })];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _visibility_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.WorkspaceVisibility)];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: obj => "slug" in obj, get: obj => obj.slug, set: (obj, value) => { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: obj => "visibility" in obj, get: obj => obj.visibility, set: (obj, value) => { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        slug = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
        description = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _description_initializers, void 0));
        visibility = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
        constructor() {
            __runInitializers(this, _visibility_extraInitializers);
        }
    };
})();
exports.UpdateWorkspaceDto = UpdateWorkspaceDto;
let WorkspaceListDto = (() => {
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    let _offset_decorators;
    let _offset_initializers = [];
    let _offset_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    return class WorkspaceListDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, class_validator_1.IsUUID)('4'), (0, class_validator_1.IsNotEmpty)()];
            _limit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Number), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            _offset_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Number), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.WorkspaceStatus)];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _offset_decorators, { kind: "field", name: "offset", static: false, private: false, access: { has: obj => "offset" in obj, get: obj => obj.offset, set: (obj, value) => { obj.offset = value; } }, metadata: _metadata }, _offset_initializers, _offset_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        organizationId = __runInitializers(this, _organizationId_initializers, void 0);
        limit = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _limit_initializers, 10));
        offset = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _offset_initializers, 0));
        status = (__runInitializers(this, _offset_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        constructor() {
            __runInitializers(this, _status_extraInitializers);
        }
    };
})();
exports.WorkspaceListDto = WorkspaceListDto;
let UpdateWorkspaceSettingsDto = (() => {
    let _timezone_decorators;
    let _timezone_initializers = [];
    let _timezone_extraInitializers = [];
    let _language_decorators;
    let _language_initializers = [];
    let _language_extraInitializers = [];
    let _dateFormat_decorators;
    let _dateFormat_initializers = [];
    let _dateFormat_extraInitializers = [];
    let _timeFormat_decorators;
    let _timeFormat_initializers = [];
    let _timeFormat_extraInitializers = [];
    let _theme_decorators;
    let _theme_initializers = [];
    let _theme_extraInitializers = [];
    let _defaultLandingPage_decorators;
    let _defaultLandingPage_initializers = [];
    let _defaultLandingPage_extraInitializers = [];
    let _notificationPrefs_decorators;
    let _notificationPrefs_initializers = [];
    let _notificationPrefs_extraInitializers = [];
    return class UpdateWorkspaceSettingsDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _timezone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _language_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _dateFormat_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _timeFormat_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _theme_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _defaultLandingPage_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _notificationPrefs_decorators = [(0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _timezone_decorators, { kind: "field", name: "timezone", static: false, private: false, access: { has: obj => "timezone" in obj, get: obj => obj.timezone, set: (obj, value) => { obj.timezone = value; } }, metadata: _metadata }, _timezone_initializers, _timezone_extraInitializers);
            __esDecorate(null, null, _language_decorators, { kind: "field", name: "language", static: false, private: false, access: { has: obj => "language" in obj, get: obj => obj.language, set: (obj, value) => { obj.language = value; } }, metadata: _metadata }, _language_initializers, _language_extraInitializers);
            __esDecorate(null, null, _dateFormat_decorators, { kind: "field", name: "dateFormat", static: false, private: false, access: { has: obj => "dateFormat" in obj, get: obj => obj.dateFormat, set: (obj, value) => { obj.dateFormat = value; } }, metadata: _metadata }, _dateFormat_initializers, _dateFormat_extraInitializers);
            __esDecorate(null, null, _timeFormat_decorators, { kind: "field", name: "timeFormat", static: false, private: false, access: { has: obj => "timeFormat" in obj, get: obj => obj.timeFormat, set: (obj, value) => { obj.timeFormat = value; } }, metadata: _metadata }, _timeFormat_initializers, _timeFormat_extraInitializers);
            __esDecorate(null, null, _theme_decorators, { kind: "field", name: "theme", static: false, private: false, access: { has: obj => "theme" in obj, get: obj => obj.theme, set: (obj, value) => { obj.theme = value; } }, metadata: _metadata }, _theme_initializers, _theme_extraInitializers);
            __esDecorate(null, null, _defaultLandingPage_decorators, { kind: "field", name: "defaultLandingPage", static: false, private: false, access: { has: obj => "defaultLandingPage" in obj, get: obj => obj.defaultLandingPage, set: (obj, value) => { obj.defaultLandingPage = value; } }, metadata: _metadata }, _defaultLandingPage_initializers, _defaultLandingPage_extraInitializers);
            __esDecorate(null, null, _notificationPrefs_decorators, { kind: "field", name: "notificationPrefs", static: false, private: false, access: { has: obj => "notificationPrefs" in obj, get: obj => obj.notificationPrefs, set: (obj, value) => { obj.notificationPrefs = value; } }, metadata: _metadata }, _notificationPrefs_initializers, _notificationPrefs_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        timezone = __runInitializers(this, _timezone_initializers, void 0);
        language = (__runInitializers(this, _timezone_extraInitializers), __runInitializers(this, _language_initializers, void 0));
        dateFormat = (__runInitializers(this, _language_extraInitializers), __runInitializers(this, _dateFormat_initializers, void 0));
        timeFormat = (__runInitializers(this, _dateFormat_extraInitializers), __runInitializers(this, _timeFormat_initializers, void 0));
        theme = (__runInitializers(this, _timeFormat_extraInitializers), __runInitializers(this, _theme_initializers, void 0));
        defaultLandingPage = (__runInitializers(this, _theme_extraInitializers), __runInitializers(this, _defaultLandingPage_initializers, void 0));
        notificationPrefs = (__runInitializers(this, _defaultLandingPage_extraInitializers), __runInitializers(this, _notificationPrefs_initializers, void 0));
        constructor() {
            __runInitializers(this, _notificationPrefs_extraInitializers);
        }
    };
})();
exports.UpdateWorkspaceSettingsDto = UpdateWorkspaceSettingsDto;
let UpdateWorkspacePreferencesDto = (() => {
    let _preferences_decorators;
    let _preferences_initializers = [];
    let _preferences_extraInitializers = [];
    return class UpdateWorkspacePreferencesDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _preferences_decorators = [(0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _preferences_decorators, { kind: "field", name: "preferences", static: false, private: false, access: { has: obj => "preferences" in obj, get: obj => obj.preferences, set: (obj, value) => { obj.preferences = value; } }, metadata: _metadata }, _preferences_initializers, _preferences_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        preferences = __runInitializers(this, _preferences_initializers, void 0);
        constructor() {
            __runInitializers(this, _preferences_extraInitializers);
        }
    };
})();
exports.UpdateWorkspacePreferencesDto = UpdateWorkspacePreferencesDto;
//# sourceMappingURL=workspace.dto.js.map
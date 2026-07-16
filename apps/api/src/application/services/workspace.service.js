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
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const workspace_exceptions_1 = require("../../common/exceptions/workspace-exceptions");
const organization_exceptions_1 = require("../../common/exceptions/organization-exceptions");
let WorkspaceService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WorkspaceService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            WorkspaceService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        workspaceRepo;
        orgRepo;
        userRepo;
        constructor(workspaceRepo, orgRepo, userRepo) {
            this.workspaceRepo = workspaceRepo;
            this.orgRepo = orgRepo;
            this.userRepo = userRepo;
        }
        async create(dto) {
            // 1. Verify organization exists
            const org = await this.orgRepo.findById(dto.organizationId);
            if (!org || org.deletedAt) {
                throw new organization_exceptions_1.OrganizationNotFoundException(dto.organizationId);
            }
            // 2. Check duplicate slug in same organization
            const existing = await this.workspaceRepo.findBySlug(dto.organizationId, dto.slug);
            if (existing) {
                throw new workspace_exceptions_1.DuplicateWorkspaceSlugException(dto.slug, dto.organizationId);
            }
            const ws = {
                id: '',
                organizationId: dto.organizationId,
                name: dto.name,
                slug: dto.slug.toLowerCase(),
                description: dto.description || null,
                workspaceType: dto.workspaceType,
                visibility: dto.visibility || 'ORGANIZATION',
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };
            const savedWorkspace = await this.workspaceRepo.save(ws);
            // Initialize default workspace settings
            const defaultSettings = {
                id: '',
                workspaceId: savedWorkspace.id,
                timezone: 'UTC',
                language: 'en',
                dateFormat: 'YYYY-MM-DD',
                timeFormat: 'HH:mm:ss',
                theme: 'dark',
                defaultLandingPage: '/dashboard',
                notificationPrefs: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await this.workspaceRepo.saveSettings(defaultSettings);
            // Initialize default workspace preferences
            const defaultPrefs = {
                id: '',
                workspaceId: savedWorkspace.id,
                preferences: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await this.workspaceRepo.savePreferences(defaultPrefs);
            return savedWorkspace;
        }
        async findById(id) {
            const ws = await this.workspaceRepo.findById(id);
            if (!ws || ws.deletedAt) {
                return null;
            }
            return ws;
        }
        async findBySlug(orgId, slug) {
            const ws = await this.workspaceRepo.findBySlug(orgId, slug);
            if (!ws || ws.deletedAt) {
                return null;
            }
            return ws;
        }
        async update(id, dto) {
            const ws = await this.workspaceRepo.findById(id);
            if (!ws || ws.deletedAt) {
                throw new workspace_exceptions_1.WorkspaceNotFoundException(id);
            }
            if (dto.slug && dto.slug.toLowerCase() !== ws.slug) {
                const existing = await this.workspaceRepo.findBySlug(ws.organizationId, dto.slug.toLowerCase());
                if (existing) {
                    throw new workspace_exceptions_1.DuplicateWorkspaceSlugException(dto.slug, ws.organizationId);
                }
                ws.slug = dto.slug.toLowerCase();
            }
            if (dto.name) {
                ws.name = dto.name;
            }
            if (dto.description !== undefined) {
                ws.description = dto.description;
            }
            if (dto.visibility) {
                ws.visibility = dto.visibility;
            }
            ws.updatedAt = new Date();
            return await this.workspaceRepo.save(ws);
        }
        async archive(id) {
            const ws = await this.workspaceRepo.findById(id);
            if (!ws || ws.deletedAt) {
                throw new workspace_exceptions_1.WorkspaceNotFoundException(id);
            }
            ws.status = 'ARCHIVED';
            ws.deletedAt = new Date(); // Soft delete active
            ws.updatedAt = new Date();
            return await this.workspaceRepo.save(ws);
        }
        async restore(id) {
            const ws = await this.workspaceRepo.findById(id);
            if (!ws) {
                throw new workspace_exceptions_1.WorkspaceNotFoundException(id);
            }
            ws.status = 'ACTIVE';
            ws.deletedAt = null;
            ws.updatedAt = new Date();
            return await this.workspaceRepo.save(ws);
        }
        async list(dto) {
            const list = await this.workspaceRepo.findAll();
            let filtered = list.filter(w => w.organizationId === dto.organizationId);
            if (dto.status) {
                filtered = filtered.filter(w => w.status === dto.status);
            }
            const limit = dto.limit || 10;
            const offset = dto.offset || 0;
            return filtered.slice(offset, offset + limit);
        }
        async getSettings(workspaceId) {
            const ws = await this.workspaceRepo.findById(workspaceId);
            if (!ws || ws.deletedAt) {
                throw new workspace_exceptions_1.WorkspaceNotFoundException(workspaceId);
            }
            return await this.workspaceRepo.findSettingsByWorkspaceId(workspaceId);
        }
        async updateSettings(workspaceId, dto) {
            const ws = await this.workspaceRepo.findById(workspaceId);
            if (!ws || ws.deletedAt) {
                throw new workspace_exceptions_1.WorkspaceNotFoundException(workspaceId);
            }
            let settings = await this.workspaceRepo.findSettingsByWorkspaceId(workspaceId);
            if (!settings) {
                settings = {
                    id: '',
                    workspaceId,
                    timezone: 'UTC',
                    language: 'en',
                    dateFormat: 'YYYY-MM-DD',
                    timeFormat: 'HH:mm:ss',
                    theme: 'dark',
                    defaultLandingPage: '/dashboard',
                    notificationPrefs: {},
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
            }
            if (dto.timezone)
                settings.timezone = dto.timezone;
            if (dto.language)
                settings.language = dto.language;
            if (dto.dateFormat)
                settings.dateFormat = dto.dateFormat;
            if (dto.timeFormat)
                settings.timeFormat = dto.timeFormat;
            if (dto.theme)
                settings.theme = dto.theme;
            if (dto.defaultLandingPage)
                settings.defaultLandingPage = dto.defaultLandingPage;
            if (dto.notificationPrefs)
                settings.notificationPrefs = dto.notificationPrefs;
            settings.updatedAt = new Date();
            return await this.workspaceRepo.saveSettings(settings);
        }
        async getPreferences(workspaceId) {
            const ws = await this.workspaceRepo.findById(workspaceId);
            if (!ws || ws.deletedAt) {
                throw new workspace_exceptions_1.WorkspaceNotFoundException(workspaceId);
            }
            return await this.workspaceRepo.findPreferencesByWorkspaceId(workspaceId);
        }
        async updatePreferences(workspaceId, dto) {
            const ws = await this.workspaceRepo.findById(workspaceId);
            if (!ws || ws.deletedAt) {
                throw new workspace_exceptions_1.WorkspaceNotFoundException(workspaceId);
            }
            let prefs = await this.workspaceRepo.findPreferencesByWorkspaceId(workspaceId);
            if (!prefs) {
                prefs = {
                    id: '',
                    workspaceId,
                    preferences: {},
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
            }
            prefs.preferences = dto.preferences;
            prefs.updatedAt = new Date();
            return await this.workspaceRepo.savePreferences(prefs);
        }
        async getMembers(workspaceId) {
            const ws = await this.workspaceRepo.findById(workspaceId);
            if (!ws || ws.deletedAt) {
                throw new workspace_exceptions_1.WorkspaceNotFoundException(workspaceId);
            }
            return await this.workspaceRepo.findMembersByWorkspaceId(workspaceId);
        }
        async addMember(workspaceId, userId) {
            const ws = await this.workspaceRepo.findById(workspaceId);
            if (!ws || ws.deletedAt) {
                throw new workspace_exceptions_1.WorkspaceNotFoundException(workspaceId);
            }
            const user = await this.userRepo.findById(userId);
            if (!user || user.deletedAt) {
                throw new Error(`User with ID '${userId}' not found`);
            }
            const members = await this.workspaceRepo.findMembersByWorkspaceId(workspaceId);
            if (members.some(m => m.userId === userId)) {
                throw new workspace_exceptions_1.WorkspaceMemberAlreadyExistsException(workspaceId, userId);
            }
            const member = {
                id: '',
                workspaceId,
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            return await this.workspaceRepo.addMember(member);
        }
        async removeMember(workspaceId, userId) {
            const ws = await this.workspaceRepo.findById(workspaceId);
            if (!ws || ws.deletedAt) {
                throw new workspace_exceptions_1.WorkspaceNotFoundException(workspaceId);
            }
            const members = await this.workspaceRepo.findMembersByWorkspaceId(workspaceId);
            if (!members.some(m => m.userId === userId)) {
                throw new workspace_exceptions_1.WorkspaceMemberNotFoundException(workspaceId, userId);
            }
            await this.workspaceRepo.removeMember(workspaceId, userId);
        }
    };
    return WorkspaceService = _classThis;
})();
exports.WorkspaceService = WorkspaceService;
//# sourceMappingURL=workspace.service.js.map
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
exports.UpdateAutomationRuleDto = exports.CreateAutomationRuleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
let CreateAutomationRuleDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _trigger_decorators;
    let _trigger_initializers = [];
    let _trigger_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _actions_decorators;
    let _actions_initializers = [];
    let _actions_extraInitializers = [];
    let _schemaVersion_decorators;
    let _schemaVersion_initializers = [];
    let _schemaVersion_extraInitializers = [];
    return class CreateAutomationRuleDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Off-Hours Campaign Pauser' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ example: 'Automatically pauses campaigns at midnight' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _trigger_decorators = [(0, swagger_1.ApiProperty)({ example: { type: 'Schedule', params: { cron: '0 0 * * *' } } }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsNotEmpty)()];
            _conditions_decorators = [(0, swagger_1.ApiProperty)({ example: { type: 'Spend', operator: '>=', value: 100 } }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _actions_decorators = [(0, swagger_1.ApiProperty)({ example: [{ type: 'Pause Campaign', params: { campaignId: '...' } }] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsNotEmpty)()];
            _schemaVersion_decorators = [(0, swagger_1.ApiProperty)({ example: 1 }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _trigger_decorators, { kind: "field", name: "trigger", static: false, private: false, access: { has: obj => "trigger" in obj, get: obj => obj.trigger, set: (obj, value) => { obj.trigger = value; } }, metadata: _metadata }, _trigger_initializers, _trigger_extraInitializers);
            __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
            __esDecorate(null, null, _actions_decorators, { kind: "field", name: "actions", static: false, private: false, access: { has: obj => "actions" in obj, get: obj => obj.actions, set: (obj, value) => { obj.actions = value; } }, metadata: _metadata }, _actions_initializers, _actions_extraInitializers);
            __esDecorate(null, null, _schemaVersion_decorators, { kind: "field", name: "schemaVersion", static: false, private: false, access: { has: obj => "schemaVersion" in obj, get: obj => obj.schemaVersion, set: (obj, value) => { obj.schemaVersion = value; } }, metadata: _metadata }, _schemaVersion_initializers, _schemaVersion_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
        trigger = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _trigger_initializers, void 0));
        conditions = (__runInitializers(this, _trigger_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
        actions = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _actions_initializers, void 0));
        schemaVersion = (__runInitializers(this, _actions_extraInitializers), __runInitializers(this, _schemaVersion_initializers, void 0));
        constructor() {
            __runInitializers(this, _schemaVersion_extraInitializers);
        }
    };
})();
exports.CreateAutomationRuleDto = CreateAutomationRuleDto;
let UpdateAutomationRuleDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _trigger_decorators;
    let _trigger_initializers = [];
    let _trigger_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _actions_decorators;
    let _actions_initializers = [];
    let _actions_extraInitializers = [];
    return class UpdateAutomationRuleDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Off-Hours Campaign Pauser Updated' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ example: 'New description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _trigger_decorators = [(0, swagger_1.ApiProperty)({ example: { type: 'Schedule', params: { cron: '0 1 * * *' } } }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _conditions_decorators = [(0, swagger_1.ApiProperty)({ example: { type: 'Spend', operator: '>=', value: 200 } }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _actions_decorators = [(0, swagger_1.ApiProperty)({ example: [{ type: 'Pause Campaign', params: { campaignId: '...' } }] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _trigger_decorators, { kind: "field", name: "trigger", static: false, private: false, access: { has: obj => "trigger" in obj, get: obj => obj.trigger, set: (obj, value) => { obj.trigger = value; } }, metadata: _metadata }, _trigger_initializers, _trigger_extraInitializers);
            __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
            __esDecorate(null, null, _actions_decorators, { kind: "field", name: "actions", static: false, private: false, access: { has: obj => "actions" in obj, get: obj => obj.actions, set: (obj, value) => { obj.actions = value; } }, metadata: _metadata }, _actions_initializers, _actions_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
        trigger = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _trigger_initializers, void 0));
        conditions = (__runInitializers(this, _trigger_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
        actions = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _actions_initializers, void 0));
        constructor() {
            __runInitializers(this, _actions_extraInitializers);
        }
    };
})();
exports.UpdateAutomationRuleDto = UpdateAutomationRuleDto;
//# sourceMappingURL=automation-rule.dto.js.map
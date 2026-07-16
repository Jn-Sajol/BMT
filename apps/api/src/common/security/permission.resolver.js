"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionResolver = void 0;
class PermissionResolver {
    static resolveModule(action) {
        return action.split('.')[0];
    }
    static resolveResource(action) {
        return action.split('.')[1];
    }
    static resolveAction(action) {
        return action.split('.')[2];
    }
    static matchesPattern(action, pattern) {
        if (pattern === '*')
            return true;
        const actionParts = action.split('.');
        const patternParts = pattern.split('.');
        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i] === '*')
                continue;
            if (patternParts[i] !== actionParts[i])
                return false;
        }
        return true;
    }
}
exports.PermissionResolver = PermissionResolver;
//# sourceMappingURL=permission.resolver.js.map
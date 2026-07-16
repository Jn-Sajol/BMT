"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePermission = usePermission;
const auth_store_1 = require("../stores/auth.store");
const permissions_1 = require("../lib/permissions");
function usePermission() {
    const user = (0, auth_store_1.useAuthStore)((state) => state.user);
    return {
        checkPermission: (permission) => {
            if (!user)
                return false;
            return (0, permissions_1.hasPermission)(user.role, permission);
        },
        role: user?.role || null,
    };
}
//# sourceMappingURL=usePermission.js.map
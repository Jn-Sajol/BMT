"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const auth_store_1 = require("../stores/auth.store");
function RootPage() {
    const router = (0, navigation_1.useRouter)();
    const token = (0, auth_store_1.useAuthStore)((state) => state.token);
    (0, react_1.useEffect)(() => {
        if (token) {
            router.push("/workspaces");
        }
        else {
            router.push("/auth/login");
        }
    }, [token, router]);
    return null;
}
//# sourceMappingURL=page.js.map
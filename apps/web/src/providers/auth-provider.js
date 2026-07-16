"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthContext = void 0;
exports.AuthProvider = AuthProvider;
const react_1 = __importStar(require("react"));
const auth_store_1 = require("../stores/auth.store");
const navigation_1 = require("next/navigation");
const AuthContext = (0, react_1.createContext)({ initialized: false });
function AuthProvider({ children }) {
    const [initialized, setInitialized] = (0, react_1.useState)(false);
    const { token, user } = (0, auth_store_1.useAuthStore)();
    const router = (0, navigation_1.useRouter)();
    const pathname = (0, navigation_1.usePathname)();
    (0, react_1.useEffect)(() => {
        // Session restore check
        if (!token && !pathname.startsWith("/auth")) {
            router.push("/auth/login");
        }
        else if (token && pathname.startsWith("/auth")) {
            router.push("/workspaces");
        }
        setInitialized(true);
    }, [token, pathname, router]);
    return (<AuthContext.Provider value={{ initialized }}>
      {initialized ? children : <div className="flex h-screen items-center justify-center">Loading session...</div>}
    </AuthContext.Provider>);
}
const useAuthContext = () => (0, react_1.useContext)(AuthContext);
exports.useAuthContext = useAuthContext;
//# sourceMappingURL=auth-provider.js.map
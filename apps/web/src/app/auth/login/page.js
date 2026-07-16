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
exports.default = LoginPage;
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const zod_2 = require("zod");
const navigation_1 = require("next/navigation");
const useAuth_1 = require("../../../hooks/useAuth");
const loginSchema = zod_2.z.object({
    email: zod_2.z.string().email("Invalid email address"),
    password: zod_2.z.string().min(6, "Password must be at least 6 characters"),
});
function LoginPage() {
    const { login, isLoggingIn } = (0, useAuth_1.useAuth)();
    const router = (0, navigation_1.useRouter)();
    const [error, setError] = (0, react_1.useState)(null);
    const { register, handleSubmit, formState: { errors } } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(loginSchema),
    });
    const onSubmit = async (data) => {
        try {
            setError(null);
            // Call authentication login mutations
            await login(data);
            router.push("/workspaces");
        }
        catch (err) {
            setError(err?.response?.data?.message || "Invalid email or password.");
        }
    };
    return (<div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">Sign in to BMT</h2>
        <p className="mt-2 text-sm text-muted-foreground">Enter your corporate credentials</p>
      </div>

      {error && (<div className="rounded bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>)}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email Address</label>
          <input type="email" {...register("email")} className="mt-1 block w-full rounded border px-3 py-2 text-sm bg-background"/>
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" {...register("password")} className="mt-1 block w-full rounded border px-3 py-2 text-sm bg-background"/>
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isLoggingIn} className="w-full rounded bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {isLoggingIn ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <button onClick={() => router.push("/auth/register")} className="font-semibold text-primary hover:underline">
          Register
        </button>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map
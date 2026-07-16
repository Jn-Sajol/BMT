"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
const server_1 = require("next/server");
function middleware(request) {
    const token = request.cookies.get("bmt_token")?.value;
    const { pathname } = request.nextUrl;
    if (!token && (pathname.startsWith("/workspace") || pathname === "/workspaces")) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        return server_1.NextResponse.redirect(url);
    }
    if (token && pathname.startsWith("/auth")) {
        const url = request.nextUrl.clone();
        url.pathname = "/workspaces";
        return server_1.NextResponse.redirect(url);
    }
    return server_1.NextResponse.next();
}
exports.config = {
    matcher: ["/workspace/:path*", "/workspaces", "/auth/:path*"],
};
//# sourceMappingURL=middleware.js.map
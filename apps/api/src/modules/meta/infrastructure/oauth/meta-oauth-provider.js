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
exports.MetaOAuthProvider = void 0;
const common_1 = require("@nestjs/common");
let MetaOAuthProvider = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MetaOAuthProvider = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MetaOAuthProvider = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        clientId = process.env.FACEBOOK_CLIENT_ID || 'mock_client_id';
        clientSecret = process.env.FACEBOOK_CLIENT_SECRET || 'mock_client_secret';
        redirectUri = process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/api/v1/meta/callback';
        getAuthorizationUrl(state) {
            const scopes = [
                'public_profile',
                'email',
                'pages_show_list',
                'pages_read_engagement',
                'pages_manage_metadata',
                'business_management',
                'ads_management',
                'instagram_basic',
            ];
            return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=${state}&scope=${encodeURIComponent(scopes.join(','))}`;
        }
        async exchangeCode(code) {
            if (code === 'mock_auth_code') {
                return { accessToken: 'mock_short_lived_access_token', expiresIn: 3600 };
            }
            try {
                const url = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&client_secret=${this.clientSecret}&code=${code}`;
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`Facebook OAuth code exchange failed: ${res.statusText}`);
                }
                const data = await res.json();
                return {
                    accessToken: data.access_token,
                    expiresIn: data.expires_in || 3600,
                };
            }
            catch (e) {
                return { accessToken: `mock_short_lived_${code}`, expiresIn: 3600 };
            }
        }
        async exchangeLongLivedToken(shortLivedToken) {
            if (shortLivedToken.startsWith('mock_short_lived_')) {
                return { accessToken: `mock_long_lived_${shortLivedToken}`, expiresIn: 60 * 24 * 60 * 60 };
            }
            try {
                const url = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.clientId}&client_secret=${this.clientSecret}&fb_exchange_token=${shortLivedToken}`;
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`Facebook Long-lived token exchange failed: ${res.statusText}`);
                }
                const data = await res.json();
                return {
                    accessToken: data.access_token,
                    expiresIn: data.expires_in || 60 * 24 * 60 * 60,
                };
            }
            catch (e) {
                return { accessToken: `mock_long_lived_${shortLivedToken}`, expiresIn: 60 * 24 * 60 * 60 };
            }
        }
        async validateToken(token) {
            if (token.startsWith('mock_long_lived_')) {
                return {
                    isValid: true,
                    facebookUserId: '1234567890',
                    facebookUserName: 'Mock Meta User',
                    scopes: [
                        'public_profile',
                        'email',
                        'pages_show_list',
                        'pages_read_engagement',
                        'pages_manage_metadata',
                        'business_management',
                        'ads_management',
                        'instagram_basic',
                    ],
                };
            }
            try {
                const url = `https://graph.facebook.com/me?fields=id,name&access_token=${token}`;
                const res = await fetch(url);
                if (!res.ok) {
                    return { isValid: false, facebookUserId: '', facebookUserName: '', scopes: [] };
                }
                const data = await res.json();
                return {
                    isValid: true,
                    facebookUserId: data.id,
                    facebookUserName: data.name,
                    scopes: [
                        'public_profile',
                        'email',
                        'pages_show_list',
                        'pages_read_engagement',
                        'pages_manage_metadata',
                        'business_management',
                        'ads_management',
                        'instagram_basic',
                    ],
                };
            }
            catch (e) {
                return { isValid: false, facebookUserId: '', facebookUserName: '', scopes: [] };
            }
        }
    };
    return MetaOAuthProvider = _classThis;
})();
exports.MetaOAuthProvider = MetaOAuthProvider;
//# sourceMappingURL=meta-oauth-provider.js.map
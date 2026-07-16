"use strict";
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
exports.JwtEngine = void 0;
const crypto = __importStar(require("crypto"));
class JwtEngine {
    static SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_key_32_chars_long!';
    static sign(payload, expiresInSeconds) {
        const header = { alg: 'HS256', typ: 'JWT' };
        const now = Math.floor(Date.now() / 1000);
        const fullPayload = {
            ...payload,
            iat: now,
            exp: now + expiresInSeconds,
        };
        const encodedHeader = this.base64url(JSON.stringify(header));
        const encodedPayload = this.base64url(JSON.stringify(fullPayload));
        const signature = this.hmac(`${encodedHeader}.${encodedPayload}`);
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }
    static verify(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        const [encodedHeader, encodedPayload, signature] = parts;
        const expectedSignature = this.hmac(`${encodedHeader}.${encodedPayload}`);
        if (signature !== expectedSignature) {
            return null;
        }
        const payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf8');
        try {
            const payload = JSON.parse(payloadStr);
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
                return null; // Expired
            }
            return payload;
        }
        catch {
            return null;
        }
    }
    static base64url(str) {
        return Buffer.from(str, 'utf8').toString('base64url');
    }
    static hmac(data) {
        return crypto
            .createHmac('sha256', this.SECRET)
            .update(data)
            .digest('base64url');
    }
}
exports.JwtEngine = JwtEngine;
//# sourceMappingURL=jwt-engine.js.map
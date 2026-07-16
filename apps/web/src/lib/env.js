"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NEXT_PUBLIC_API_URL: zod_1.z.string().url().default("http://localhost:4000/api/v1"),
});
exports.env = envSchema.parse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
//# sourceMappingURL=env.js.map
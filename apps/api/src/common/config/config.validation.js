"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configSchema = void 0;
exports.validateConfig = validateConfig;
const zod_1 = require("zod");
exports.configSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test', 'staging']),
    PORT: zod_1.z.coerce.number().default(3000),
    DATABASE_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(8),
});
function validateConfig(config) {
    const result = exports.configSchema.safeParse(config);
    if (!result.success) {
        console.error('❌ Configuration validation failed:', result.error.format());
        throw new Error('Invalid configuration parameters.');
    }
    return result.data;
}
//# sourceMappingURL=config.validation.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
exports.loadEnvConfig = loadEnvConfig;
const zod_1 = require("zod");
exports.EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test', 'staging']).default('development'),
    API_PORT: zod_1.z.preprocess((val) => parseInt(val, 10), zod_1.z.number()).default(4000),
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url(),
    SMTP_HOST: zod_1.z.string().default('localhost'),
    SMTP_PORT: zod_1.z.preprocess((val) => parseInt(val, 10), zod_1.z.number()).default(1025),
    JWT_SECRET: zod_1.z.string().min(8).default('supersecretjwtsigningkeysign1234'),
});
function loadEnvConfig() {
    const result = exports.EnvSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Invalid environment configuration:', result.error.format());
        process.exit(1);
    }
    return result.data;
}
//# sourceMappingURL=env.config.js.map
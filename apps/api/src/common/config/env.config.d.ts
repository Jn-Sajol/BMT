import { z } from 'zod';
export declare const EnvSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test", "staging"]>>;
    API_PORT: z.ZodDefault<z.ZodEffects<z.ZodNumber, number, unknown>>;
    DATABASE_URL: z.ZodString;
    REDIS_URL: z.ZodString;
    SMTP_HOST: z.ZodDefault<z.ZodString>;
    SMTP_PORT: z.ZodDefault<z.ZodEffects<z.ZodNumber, number, unknown>>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test" | "staging";
    API_PORT: number;
    DATABASE_URL: string;
    REDIS_URL: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
}, {
    DATABASE_URL: string;
    REDIS_URL: string;
    NODE_ENV?: "development" | "production" | "test" | "staging" | undefined;
    API_PORT?: unknown;
    SMTP_HOST?: string | undefined;
    SMTP_PORT?: unknown;
}>;
export type EnvConfig = z.infer<typeof EnvSchema>;
export declare function loadEnvConfig(): EnvConfig;

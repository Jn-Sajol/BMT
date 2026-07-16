import { z } from 'zod';
export declare const configSchema: z.ZodObject<{
    NODE_ENV: z.ZodEnum<["development", "production", "test", "staging"]>;
    PORT: z.ZodDefault<z.ZodNumber>;
    DATABASE_URL: z.ZodString;
    JWT_SECRET: z.ZodString;
}, "strip", z.ZodTypeAny, {
    JWT_SECRET: string;
    NODE_ENV: "test" | "development" | "production" | "staging";
    DATABASE_URL: string;
    PORT: number;
}, {
    JWT_SECRET: string;
    NODE_ENV: "test" | "development" | "production" | "staging";
    DATABASE_URL: string;
    PORT?: number | undefined;
}>;
export declare function validateConfig(config: Record<string, any>): {
    JWT_SECRET: string;
    NODE_ENV: "test" | "development" | "production" | "staging";
    DATABASE_URL: string;
    PORT: number;
};

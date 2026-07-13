import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test', 'staging']).default('development'),
  API_PORT: z.preprocess((val) => parseInt(val as string, 10), z.number()).default(4000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.preprocess((val) => parseInt(val as string, 10), z.number()).default(1025),
  JWT_SECRET: z.string().min(8).default('supersecretjwtsigningkeysign1234'),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

export function loadEnvConfig(): EnvConfig {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment configuration:', result.error.format());
    process.exit(1);
  }
  return result.data;
}

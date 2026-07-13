import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test', 'staging']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(8),
});

export function validateConfig(config: Record<string, any>) {
  const result = configSchema.safeParse(config);
  if (!result.success) {
    console.error('❌ Configuration validation failed:', result.error.format());
    throw new Error('Invalid configuration parameters.');
  }
  return result.data;
}

import { z } from "zod";

export const envSchema = z.object({
  // Core
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),

  // Redis
  REDIS_URL: z.string().url().optional(),

  // Cloudflare R2
  CLOUDFLARE_R2_BUCKET: z.string().optional(),
  CLOUDFLARE_R2_ENDPOINT: z.string().optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().optional(),

  // External services (optional — mock if absent)
  NIMC_API_KEY: z.string().optional(),
  NIMC_API_URL: z.string().url().optional(),
  NIBSS_API_KEY: z.string().optional(),
  NIBSS_API_URL: z.string().url().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  TERMII_API_KEY: z.string().optional(),
  MONNIFY_API_KEY: z.string().optional(),

  // ML service
  ML_SERVICE_URL: z.string().url().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Environment validation failed:\n${formatted}`);
  }

  return result.data;
}

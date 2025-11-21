import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    PORT: z.string().default("80"),
    API_PREFIX: z.string().default("/api/trpc"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    FRONTEND_URL: z.string(),
    JWT_SECRET: z.string(),
    COOKIE_SECRET: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_REGION: z.string().default("ap-south-1"),
    AWS_SES_FROM_EMAIL: z.email(),
    SERPAPI_KEY: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

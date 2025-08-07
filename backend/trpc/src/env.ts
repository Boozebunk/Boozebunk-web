import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    PORT: z.string().default("80"),
    API_PREFIX: z.string().default("/api/trpc"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    FRONTEND_URL: z.string().url(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

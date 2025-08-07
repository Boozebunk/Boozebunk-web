import { type Config } from "drizzle-kit";

import { env } from "./src/env";

export default {
  schema: "./src/db/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: "src/db/migrations",
  migrations: {
    prefix: "timestamp",
  },
  casing: "snake_case",
  ...(env.NODE_ENV === "development" && { verbose: true }),
} satisfies Config;

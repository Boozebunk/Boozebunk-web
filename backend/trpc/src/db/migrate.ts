import { migrate } from "drizzle-orm/bun-sql/migrator";

import db from "@boozebunk-trpc/db";
import { logger } from "@boozebunk-trpc/fastify.ts";

logger.info("Starting migrations...");
await migrate(db, { migrationsFolder: `${import.meta.dir}/migrations` });
logger.info("Migrations complete.");

process.exit(0);

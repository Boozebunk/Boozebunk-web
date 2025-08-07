import { env } from "@boozebunk-trpc/env";
import { logger } from "@boozebunk-trpc/fastify.ts";
import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

import schema from "./schema/index.js"; // Importing the schema from the index file

import type { SQLOptions } from "bun";
import type { Logger } from "drizzle-orm/logger";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: SQL | undefined;
};

class CustomDbLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    logger.info({
      msg: "Executing SQL query",
      query,
      params,
    });
  }
}

export const conn =
  globalForDb.conn ??
  new SQL({
    url: env.DATABASE_URL,
    onclose: (_conn) => {
      logger.info("Disconnected from database");
    },
    search_path: "public",
  } as SQLOptions);

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

const db = drizzle(conn, { schema, logger: new CustomDbLogger(), casing: "snake_case" });
export default db;

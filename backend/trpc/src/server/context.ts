import db from "@boozebunk-trpc/db";

import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export function createContext({ req, res }: CreateFastifyContextOptions) {
  return { req, res, db, user: req.user || null };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

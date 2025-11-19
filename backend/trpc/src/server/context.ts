import db from "@boozebunk-trpc/db";

// ⚠️ FINAL CRITICAL FIX: Add "dead" imports to force TypeScript to load the global augmentations
import "@fastify/jwt";
import "@fastify/cookie";

import type { FastifyReply, FastifyRequest } from "fastify";
import type { UUIDTypes } from "uuid";

// --- START TYPE AUGMENTATION ---

// We keep the augmentation blocks here, but ensure the imports above load the types.

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: UUIDTypes;
      roleId: UUIDTypes;
      email: string;
      role: "admin" | "vendor";
    };
    user: {
      id: UUIDTypes;
      roleId: UUIDTypes;
      email: string;
      role: "admin" | "vendor";
    };
  }
}

declare module "fastify" {
  interface FastifyRequest {
    jwtSign: (
      payload: import("@fastify/jwt").FastifyJWT["payload"],
      options?: import("@fastify/jwt").SignOptions,
    ) => Promise<string>;
  }
}

// Define the Extended Context Options
interface ExtendedContextOptions {
  req: FastifyRequest;
  res: FastifyReply;
}

export function createContext({ req, res }: ExtendedContextOptions) {
  return { req, res, db, user: req.user || null };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

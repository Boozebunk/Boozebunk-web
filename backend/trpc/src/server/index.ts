import { CorsConfig } from "@boozebunk-trpc/config/cors-config";
import { env } from "@boozebunk-trpc/env";
import { appRouter } from "@boozebunk-trpc/modules/root";
import { createContext } from "@boozebunk-trpc/server/context";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import type { AppRouter } from "@boozebunk-trpc/modules/root";
import type { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export interface ServerOptions {
  dev?: boolean;
  port?: string;
  prefix?: string;
}

export async function createServer(server: FastifyInstance, opts: ServerOptions) {
  const dev = opts.dev ?? true;
  const port = opts.port ?? env.PORT;
  const prefix = opts.prefix ?? env.API_PREFIX;

  await server.register(cors, CorsConfig);

  await server.register(jwt, {
    secret: process.env.JWT_SECRET || "your_super_secret_jwt_key_please_change_me", // ⚠️ IMPORTANT: Use a strong, unique secret from your .env!
    cookie: {
      // Configure JWT to look for token in a cookie
      cookieName: "token", // The name of the cookie where the JWT is stored
      signed: false, // Set to true if you are also signing the cookie itself (not just the JWT inside it)
    },
    sign: {
      expiresIn: "7d", // JWT access token valid for 7 days
    },
  });

  // Register @fastify/cookie plugin
  await server.register(cookie, {
    secret: process.env.COOKIE_SECRET || "your_super_secret_cookie_key_please_change_me", // ⚠️ IMPORTANT: Use a strong, unique secret for cookie signing!
    hook: "onRequest", // Process cookies before route handlers
  });

  // Add a preHandler hook to verify JWT and attach user to request
  // This hook runs BEFORE any route handler (including tRPC procedures)
  server.addHook("preHandler", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // request.jwtVerify() will automatically look for the token in:
      // 1. Authorization header (Bearer token)
      // 2. The cookie specified in the jwt plugin options (cookieName: 'token')
      await request.jwtVerify(); // This populates request.user if token is valid
    } catch (err: unknown) {
      // Use 'unknown' for err type for safety
      // JWT verification failed (e.g., expired, invalid signature).
      // request.user will NOT be populated.
      // Do NOT throw here, just log and let the request proceed.
      // The tRPC protectedProcedure will handle the UNAUTHORIZED error based on request.user being undefined.
      if (err instanceof Error) {
        request.log.warn("JWT verification failed (preHandler hook):", err.message);
      } else {
        request.log.warn("Unknown JWT verification error:", err);
      }
      // Optionally clear the invalid cookie to prevent repeated attempts with a bad token
      if (request.cookies.token) {
        reply.clearCookie("token", { path: "/" });
      }
    }
  });

  server.get("/", async () => {
    return { message: "Hello, L" };
  });

  server.get("/health", async () => {
    return { message: "I'm Healthy!" };
  });

  void server.register(fastifyTRPCPlugin, {
    prefix,
    useWSS: true,
    logLevel: dev ? "debug" : "info",

    trpcOptions: {
      router: appRouter,
      createContext,
      onError:
        env.NODE_ENV === "development"
          ? ({ path, error }) => {
              server.log.error({
                msg: `❌ tRPC failed on ${path ?? "<no-path>"}`,
                err: error,
              });
            }
          : undefined,
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });

  const stop = async () => {
    await server.close();
  };

  const start = async () => {
    try {
      await server.listen({ port: Number(port), host: "0.0.0.0" });
      server.log.info(`listening on port ${port}`);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}

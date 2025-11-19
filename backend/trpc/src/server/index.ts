import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import { appRouter } from "@boozebunk-trpc/modules/root";
import { CorsConfig } from "@boozebunk-trpc/config/cors-config";
import { env } from "@boozebunk-trpc/env";
import { createContext } from "@boozebunk-trpc/server/context";

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
    secret: process.env.JWT_SECRET || "your_super_secret_jwt_key",
    cookie: {
      cookieName: "token",
      signed: false,
    },
    sign: {
      expiresIn: "7d",
    },
  });

  await server.register(cookie, {
    secret: process.env.COOKIE_SECRET || "your_super_secret_cookie_key_please_change_me",
    hook: "onRequest",
  });

  server.addHook("preHandler", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err: unknown) {
      if (err instanceof Error) {
        request.log.warn("JWT verification failed (preHandler hook):", err.message);
      } else {
        request.log.warn("Unknown JWT verification error:", err);
      }
      if (request.cookies.token) {
        reply.clearCookie("token", { path: "/" });
      }
    }
  });

  server.get("/", async () => {
    return { message: "Hello, Developer!" };
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

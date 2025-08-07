// The entry point of the backend

import { createServer } from "@boozebunk-trpc/server";

import { env } from "./env";
import fastifyServer, { logger } from "./fastify";

async function bootstrap() {
  try {
    const server = await createServer(fastifyServer, {
      prefix: "/api/trpc",
      dev: env.NODE_ENV !== "production",
    });

    await server.start();

    // Handle graceful shutdown
    const signals = ["SIGINT", "SIGTERM"] as const;
    for (const signal of signals) {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, shutting down...`);
        await server.stop();
        process.exit(0);
      });
    }
  } catch (err) {
    logger.error({
      message: "Failed to start server",
      err,
    });
    process.exit(1);
  }
}

void bootstrap();

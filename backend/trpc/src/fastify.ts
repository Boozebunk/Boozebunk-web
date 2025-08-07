import { randomUUIDv7 } from "bun";
import fastifyServer from "fastify";

const app = fastifyServer({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "SYS:standard",
        colorize: true,
      },
    },
    serializers: {
      req(request) {
        return {
          method: request.method,
          params: request.params,
          body: request.body,
          url: request.url,
          id: request.id,
        };
      },
    },
  },
  maxParamLength: 5000,
  genReqId: () => {
    return randomUUIDv7();
  },
});

export const logger = app.log;

export default app;

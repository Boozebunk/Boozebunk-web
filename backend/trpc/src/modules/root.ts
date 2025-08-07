import { createTRPCRouter } from "@boozebunk-trpc/server/trpc";

import { greetingRouter } from "./greetings/controller";

export const appRouter = createTRPCRouter({
  greeting: greetingRouter,
});

export type AppRouter = typeof appRouter;

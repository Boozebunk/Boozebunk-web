import { createTRPCRouter, publicProcedure } from "@boozebunk-trpc/server/trpc";
import { z } from "zod";

export const greetingRouter = createTRPCRouter({
  greet: publicProcedure.input(z.object({ name: z.string() })).mutation(async ({ input }) => {
    const { name } = input;

    console.log("success from the backend");
    return `Hello, ${name}!`;
  }),
});

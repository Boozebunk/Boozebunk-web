import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { headers as nextHeaders } from "next/headers";
import superjson from "superjson";

import type { appRouter } from "@boozebunk-trpc/modules/root";

type HeadersInit = Record<string, string>;

type AppRouter = typeof appRouter;

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8080/api/trpc",
      transformer: superjson,
      async headers() {
        const headerStore = await nextHeaders();
        const headersToForward: HeadersInit = {};

        const cookieHeader = headerStore.get("cookie");
        if (cookieHeader) {
          headersToForward["cookie"] = cookieHeader;
        }

        return headersToForward;
      },
    }),
  ],
});

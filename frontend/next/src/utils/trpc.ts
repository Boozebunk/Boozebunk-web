import { type AppRouter } from '@boozebunk-trpc/modules/root';
import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import SuperJSON from 'superjson';

import { env } from '../env';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    },
    mutations: {
      retry: false
    }
  }
});

export const trpcHttp = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${env.NEXT_PUBLIC_API_ENDPOINT}/api/trpc`,
        transformer: SuperJSON,
        fetch: (input, init) => {
          return fetch(input, { ...init, credentials: 'include' });
        }
      })
    ]
  }),
  queryClient
});

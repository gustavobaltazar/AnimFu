import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { inferRouterInputs } from '@trpc/server';
import superjson from 'superjson';
import { AppRouter } from '../../../server/src/server';

export const api = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
        httpBatchLink({
            url: 'http://localhost:4000/trpc',
            fetch(url, options) {
                return fetch(url, {
                  ...options,
                  credentials: "include",
                });
            },
        }),
    ],
});

export type RouterInputs = inferRouterInputs<AppRouter>;
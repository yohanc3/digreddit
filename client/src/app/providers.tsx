'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { PostHogProvider } from '../providers/PostHogProvider';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            //refetch every 10 seconds
            refetchInterval: 10 * 1000,
            refetchOnWindowFocus: true,
        },
    },
});

export default function Providers({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                //refetch every 10 seconds
                refetchInterval: 10 * 1000,
                refetchOnWindowFocus: true,
            },
        },
    });

    return (
        <PostHogProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </PostHogProvider>
    );
}

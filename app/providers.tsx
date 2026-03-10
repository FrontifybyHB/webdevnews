"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Cache news for 30 minutes before considering it stale
                        staleTime: 30 * 60 * 1000,
                        // Keep unused cached data for 35 minutes
                        gcTime: 35 * 60 * 1000,
                        // Retry failed requests once
                        retry: 1,
                        // Don't refetch when window regains focus (avoid surprise API hits)
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}

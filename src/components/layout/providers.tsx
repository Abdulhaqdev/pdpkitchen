'use client';
import React, { useState } from 'react';
import { ActiveThemeProvider } from '../active-theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ActiveThemeProvider initialTheme={activeThemeValue}>
          {children}
        </ActiveThemeProvider>
      </QueryClientProvider>
    </>
  );
}
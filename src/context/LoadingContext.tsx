import React, { createContext, useContext, useState, useCallback, useTransition } from 'react';

interface LoadingContextValue {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
  startTransitionLoading: (callback: () => void) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState<number>(0);
  const [, startTransition] = useTransition();

  const isLoading = loadingCount > 0;

  const startLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount((prev) => Math.max(0, prev - 1));
  }, []);

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    startLoading();
    try {
      return await fn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const startTransitionLoading = useCallback((callback: () => void) => {
    startLoading();
    startTransition(() => {
      callback();
    });
    // Brief timeout to ensure smooth skeleton render during heavy view swaps
    setTimeout(() => {
      stopLoading();
    }, 250);
  }, [startLoading, stopLoading]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        startLoading,
        stopLoading,
        withLoading,
        startTransitionLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export function useLoading(): LoadingContextValue {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

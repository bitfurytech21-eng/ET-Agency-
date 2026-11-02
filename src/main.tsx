import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

function ensureSafeStorage() {
  if (typeof window === 'undefined') return;
  const createMemoryStorage = (): Storage => {
    const map = new Map<string, string>();
    return {
      get length() {
        return map.size;
      },
      clear() {
        map.clear();
      },
      getItem(key: string) {
        return map.has(key) ? map.get(key)! : null;
      },
      key(index: number) {
        return Array.from(map.keys())[index] ?? null;
      },
      removeItem(key: string) {
        map.delete(key);
      },
      setItem(key: string, value: string) {
        map.set(key, String(value));
      },
    };
  };

  for (const prop of ['localStorage', 'sessionStorage'] as const) {
    try {
      const storage = window[prop];
      const probe = '__etl_storage_probe__';
      storage.setItem(probe, '1');
      storage.removeItem(probe);
    } catch {
      try {
        Object.defineProperty(window, prop, {
          value: createMemoryStorage(),
          configurable: true,
          writable: true,
        });
      } catch {
        // Ignore if browser prevents redefining property
      }
    }
  }
}

ensureSafeStorage();

interface BoundaryState {
  error: Error | null;
}

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[RootErrorBoundary]', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
            <h1 className="type-h3 text-[#0f172a]">Unable to Load View</h1>
            <p className="type-body text-slate-600">
              A temporary rendering issue occurred. Refresh the view to continue browsing Easy Travel Lodging.
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ error: null });
                window.location.href = '/';
              }}
              className="btn btn-primary w-full"
            >
              Reload Website
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>,
  );
}

/**
 * Error Boundary Component
 * 
 * Catches React errors and displays a fallback UI.
 * Prevents white screen of death.
 * 
 * @see https://react.dev/reference/react/ErrorBoundary
 */

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
          <div className="glass-card max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">
              Oups, une erreur est survenue
            </h1>
            <p className="text-[var(--text-secondary)] mb-6">
              Nous sommes désolés. Veuillez rafraîchir la page ou réessayer plus tard.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Rafraîchir la page
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-[var(--text-muted)] text-sm cursor-pointer">
                  Détails de l'erreur
                </summary>
                <pre className="mt-2 p-3 bg-[var(--bg-card)] rounded text-xs text-red-400 overflow-auto max-h-40">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

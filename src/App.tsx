/**
 * Main App Component
 * 
 * Entry point with Error Boundary, Lazy Loading, and Routing.
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Lazy loading routes for better performance
const Portfolio = lazy(() => import('./routes/Portfolio'));
const Admin = lazy(() => import('./routes/Admin'));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-[var(--text-secondary)]">Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </Suspense>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;

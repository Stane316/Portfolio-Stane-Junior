import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Lazy loading pour la performance
const ProjectsPage = lazy(() => import('./routes/ProjectsPage'));
const Portfolio = lazy(() => import('./routes/Portfolio'));
const Admin = lazy(() => import('./routes/Admin'));
const IntroAnimation = lazy(() => import('./components/intro/IntroAnimation'));
const BlogList = lazy(() => import('./routes/BlogList'));
const BlogArticle = lazy(() => import('./routes/BlogArticle'));
const GrowTechPage = lazy(() => import('./routes/GrowTechPage'));

// Loading fallback
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#0A0A1E] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState<boolean>(false);
  const [introFinished, setIntroFinished] = useState<boolean>(false);

  // Vérifie si l'intro doit s'afficher (jamais affichée sur admin)
  useEffect(() => {
    const path = window.location.pathname;
    const hasSeenIntro = sessionStorage.getItem('intro_seen');
    
    // On affiche l'intro si :
    // 1. On n'est pas sur la route admin
    // 2. L'utilisateur n'a pas encore vu l'intro (optionnel, ici on force à chaque session pour l'effet)
    if (!path.startsWith('/admin')) {
      setShowIntro(true);
    } else {
      setIntroFinished(true); // Pas d'intro pour l'admin
    }
  }, []);

  const handleIntroFinish = () => {
    setShowIntro(false);
    setIntroFinished(true);
    sessionStorage.setItem('intro_seen', 'true');
  };

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              {/* Animation d'intro */}
              {showIntro && !introFinished ? (
                <IntroAnimation onFinish={handleIntroFinish} />
              ) : (
                <Routes>
                  <Route path="/" element={<Portfolio />} />
                  <Route path="/admin/*" element={<Admin />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/blog" element={<BlogList />} />
                  <Route path="/blog/:slug" element={<BlogArticle />} />
                  <Route path="/growtech" element={<GrowTechPage />} />
               </Routes>
              )}
            </Suspense>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
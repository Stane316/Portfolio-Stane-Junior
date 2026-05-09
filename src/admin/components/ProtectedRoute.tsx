import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Pas de session -> Non authentifié
        setIsAuthenticated(false);
      } else {
        // Session valide -> Authentifié
        setIsAuthenticated(true);
      }
    };

    checkAuth();

    // Écouter les changements d'état de connexion (déconnexion par exemple)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Pendant la vérification, on peut afficher un loader ou rien
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0A0A1E] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si non authentifié, redirection forcée vers le login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Si authentifié, on affiche le contenu protégé
  return <>{children}</>;
};

export default ProtectedRoute;
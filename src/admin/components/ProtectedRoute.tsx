import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erreur vérification session:", error);
          setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Écouter les changements de connexion en temps réel
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Pendant la vérification, on ne montre RIEN du contenu admin
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A1E] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#A8B4C8] text-sm animate-pulse">Vérification de sécurité...</p>
      </div>
    );
  }

  // Si pas authentifié, on dégage vers le login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Sinon, on affiche le contenu protégé
  return <>{children}</>;
};

export default ProtectedRoute;
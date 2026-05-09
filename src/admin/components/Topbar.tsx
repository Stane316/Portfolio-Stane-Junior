import React from 'react';
import { useLocation } from 'react-router-dom';

const Topbar: React.FC = () => {
  const location = useLocation();

  // Mapping des paths vers des titres lisibles
  const pathMap: Record<string, string> = {
    '/admin/dashboard': 'Vue d\'ensemble',
    '/admin/projects': 'Gestion des Projets',
    '/admin/testimonials': 'Gestion des Témoignages',
    '/admin/content': 'Contenu du Site',
    '/admin/messages': 'Messages Reçus',
  };

  const currentPage = pathMap[location.pathname] || 'Administration';

  return (
    <header className="h-16 bg-[#0F0F2E] border-b border-[#141430] flex items-center justify-between px-6 ml-60">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#4A5568]">Admin</span>
        <span className="text-[#4A5568]">/</span>
        <span className="text-white font-medium">{currentPage}</span>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-white text-sm font-medium">Stane-Junior</p>
          <p className="text-[#4A5568] text-xs">Tech Lead</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A6FC4] to-[#00BFFF] flex items-center justify-center text-white font-bold">
          SJ
        </div>
      </div>
    </header>
  );
};

export default Topbar;
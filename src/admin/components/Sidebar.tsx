import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  unreadCount: number;
  onLogout: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
};

const Sidebar: React.FC<SidebarProps> = ({ unreadCount, onLogout, isMobileOpen, onMobileClose }) => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: NavItem[] = [
    {
      path: '/admin/dashboard',
      label: isFr ? 'Vue d\'ensemble' : 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      path: '/admin/projects',
      label: isFr ? 'Projets' : 'Projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      path: '/admin/testimonials',
      label: isFr ? 'Témoignages' : 'Testimonials',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      path: '/admin/messages',
      label: isFr ? 'Messages' : 'Messages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      badge: unreadCount || undefined,
    },
    {
      path: '/admin/content',
      label: isFr ? 'Contenu' : 'Content',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      path: '/admin/blog',
      label: isFr ? 'Blog' : 'Blog',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
     ),
    },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[rgba(0,191,255,0.15)] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl text-white">SJ</span>
            <span className="w-2 h-2 bg-[#00BFFF] rounded-full animate-pulse" />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-[#A8B4C8] hover:text-white transition-colors rounded-lg hover:bg-[#141430]"
          title={isCollapsed ? 'Développer le menu' : 'Réduire le menu'}
          aria-label={isCollapsed ? 'Développer le menu latéral' : 'Réduire le menu latéral'}
        >
          <svg className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Navigation principale">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onMobileClose()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                active
                  ? 'bg-[#00BFFF] bg-opacity-10 text-[#00BFFF]'
                  : 'text-[#A8B4C8] hover:text-white hover:bg-[#141430]'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00BFFF] rounded-r-full"
                />
              )}
              <span className="flex-shrink-0" aria-hidden="true">{item.icon}</span>
              {!isCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
              {item.badge && !isCollapsed && (
                <span className="ml-auto bg-[#00BFFF] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {item.badge && isCollapsed && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00BFFF] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[rgba(0,191,255,0.15)]">
        <div className={`flex items-center gap-3 p-2 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A6FC4] to-[#00BFFF] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">SJ</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Stane-Junior</p>
              <p className="text-[#4A5568] text-xs truncate">Admin</p>
            </div>
          )}
        </div>
        <button
          onClick={onLogout}
          className={`mt-2 flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500 hover:bg-opacity-10 transition-all w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Se déconnecter"
          aria-label="Se déconnecter de l'administration"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span className="text-sm">{isFr ? 'Déconnexion' : 'Logout'}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col bg-[#0A0A1E] border-r border-[rgba(0,191,255,0.15)] transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
        aria-label="Menu latéral"
      >
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 bg-[#0A0A1E] border-r border-[rgba(0,191,255,0.15)] z-50 lg:hidden"
              aria-label="Menu mobile"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
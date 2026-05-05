import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface TopbarProps {
  title: string;
  breadcrumb?: string[];
  unreadCount: number;
  onMobileMenuClick: () => void;
  onLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ title, breadcrumb, unreadCount, onMobileMenuClick, onLogout }) => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  return (
    <header className="bg-[#0A0A1E] bg-opacity-80 backdrop-blur-xl border-b border-[rgba(0,191,255,0.15)] sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left: Mobile menu + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 text-[#A8B4C8] hover:text-white transition-colors rounded-lg hover:bg-[#141430]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div>
            {breadcrumb && breadcrumb.length > 0 && (
              <nav className="flex items-center gap-1 text-xs text-[#4A5568] mb-0.5">
                <span>Admin</span>
                {breadcrumb.map((item, index) => (
                  <React.Fragment key={index}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className={index === breadcrumb.length - 1 ? 'text-[#A8B4C8]' : ''}>{item}</span>
                  </React.Fragment>
                ))}
              </nav>
            )}
            <h1 className="text-lg lg:text-xl font-display font-bold text-white">{title}</h1>
          </div>
        </div>

        {/* Right: Notifications + Logout */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          {unreadCount > 0 && (
            <div className="relative">
              <div className="p-2 text-[#A8B4C8] hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}

          {/* Quick logout */}
          <button
            onClick={onLogout}
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-[#A8B4C8] hover:text-red-400 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{isFr ? 'Déconnexion' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
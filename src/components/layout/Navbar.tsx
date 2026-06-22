import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Professional Navigation Bar
 * 
 * P0 Navigation UX Improvements:
 * - Robust anchor navigation across all routes (BrowserRouter compatible)
 * - Improved mobile menu with backdrop, escape key, better UX
 * - Accessibility enhancements (aria, keyboard)
 * - Consistent behavior from any page
 */

interface NavItem {
  label: string;
  path: string;
  isAnchor: boolean;
}

const Navbar: React.FC = () => {
  const { lang, toggleLang } = useLanguage();
  const isFr = lang === 'fr';
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll state
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key for mobile menu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isMenuOpen]);

  // Professional scroll to section handler
  const scrollToSection = (sectionId: string) => {
    const id = sectionId.replace('#', '');
    
    if (location.pathname === '/' || location.pathname === '') {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  const handleNavClick = (item: NavItem, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (item.isAnchor) {
      scrollToSection(item.path);
    } else {
      navigate(item.path);
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const scrollTarget = (location.state as any)?.scrollTo;
    if (scrollTarget && (location.pathname === '/' || location.pathname === '')) {
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollTarget);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.state]);

  const navItems: NavItem[] = [
    { label: isFr ? 'Accueil' : 'Home', path: '/', isAnchor: false },
    { label: isFr ? 'À propos' : 'About', path: '#about', isAnchor: true },
    { label: isFr ? 'Parcours' : 'Journey', path: '#journey', isAnchor: true },
    { label: isFr ? 'Projets' : 'Projects', path: '#projects', isAnchor: true },
    { label: 'GROW TECH', path: '/growtech', isAnchor: false },
    { label: 'Blog', path: '/blog', isAnchor: false },
    { label: isFr ? 'Contact' : 'Contact', path: '#contact', isAnchor: true },
  ];

  const isActive = (item: NavItem): boolean => {
    if (!item.isAnchor) return location.pathname === item.path;
    return false;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0A0A1E]/95 backdrop-blur-xl border-b border-[#141430] py-3 shadow-lg' 
            : 'bg-transparent py-5'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-custom flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] rounded"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="font-heading text-2xl text-white group-hover:text-[#00BFFF] transition-colors">SJ</span>
            <span className="w-2 h-2 bg-[#00BFFF] rounded-full animate-pulse" />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              item.isAnchor ? (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNavClick(item, e)}
                  className={`text-sm font-medium transition-all duration-200 relative group ${
                    isActive(item) ? 'text-[#00BFFF]' : 'text-[#A8B4C8] hover:text-white'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#00BFFF] transition-all duration-300 ${
                    isActive(item) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => handleNavClick(item)}
                  className={`text-sm font-medium transition-all duration-200 relative group ${
                    isActive(item) ? 'text-[#00BFFF]' : 'text-[#A8B4C8] hover:text-white'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#00BFFF] transition-all duration-300 ${
                    isActive(item) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              )
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="hidden sm:flex items-center justify-center px-3 py-1.5 text-xs font-bold border border-[#00BFFF] text-[#00BFFF] rounded-lg hover:bg-[#00BFFF] hover:text-black transition-all active:scale-[0.985]"
              aria-label={isFr ? "Switch to English" : "Passer en français"}
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-white rounded-lg hover:bg-[#141430] transition-colors"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="lg:hidden fixed top-[60px] left-0 right-0 bg-[#0A0A1E]/98 backdrop-blur-xl border-b border-[#141430] z-50 shadow-2xl"
            >
              <div className="container-custom py-6 flex flex-col gap-1">
                {navItems.map((item, index) => (
                  item.isAnchor ? (
                    <a
                      key={index}
                      href={item.path}
                      onClick={(e) => handleNavClick(item, e)}
                      className="block py-3.5 px-4 text-lg text-[#A8B4C8] hover:text-white hover:bg-[#141430]/70 rounded-lg transition-colors active:bg-[#141430]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => handleNavClick(item)}
                      className={`block py-3.5 px-4 text-lg rounded-lg transition-colors ${
                        location.pathname === item.path 
                          ? 'text-[#00BFFF] bg-[#141430]/50' 
                          : 'text-[#A8B4C8] hover:text-white hover:bg-[#141430]/70'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                ))}
                <div className="pt-4 mt-2 border-t border-[#141430]">
                  <button
                    onClick={() => { toggleLang(); setIsMenuOpen(false); }}
                    className="w-full py-3 px-4 text-left text-base font-medium text-[#A8B4C8] hover:text-white hover:bg-[#141430]/70 rounded-lg transition-colors"
                  >
                    {lang === 'fr' ? 'Switch to English' : 'Passer en français'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
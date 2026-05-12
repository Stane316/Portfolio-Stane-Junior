import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { lang, toggleLang } = useLanguage();
  const isFr = lang === 'fr';
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Détection de la page d'accueil
  const isHomePage = location.pathname === '/' || location.pathname === '';

  // Fonction pour obtenir le bon chemin
  const getNavPath = (path: string, isAnchor: boolean) => {
    if (!isAnchor) return path; // C'est une page (/blog), on retourne le path tel quel
    // C'est une ancre (#about)
    if (isHomePage) return path; // Si on est sur l'accueil, simple ancre
    return `/${path}`; // Sinon, on force le retour à l'accueil avec l'ancre
  };

  const navItems = [
    { label: isFr ? 'Accueil' : 'Home', path: '/', isAnchor: false },
    { label: isFr ? 'À propos' : 'About', path: '#about', isAnchor: true },
    { label: isFr ? 'Projets' : 'Projects', path: '#projects', isAnchor: true },
    { label: 'GROW TECH', path: '/growtech', isAnchor: false },
    { label: 'Blog', path: '/blog', isAnchor: false },
    { label: isFr ? 'Contact' : 'Contact', path: '#contact', isAnchor: true },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#0A0A1E]/90 backdrop-blur-md border-b border-[#141430] py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-heading text-2xl text-white group-hover:text-[#00BFFF] transition-colors">SJ</span>
            <span className="w-2 h-2 bg-[#00BFFF] rounded-full animate-pulse" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              item.isAnchor ? (
                <a
                  key={item.path}
                  href={getNavPath(item.path, true)}
                  className="text-sm font-medium text-[#A8B4C8] hover:text-white transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00BFFF] group-hover:w-full transition-all duration-300" />
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors relative group ${
                    location.pathname === item.path ? 'text-[#00BFFF]' : 'text-[#A8B4C8] hover:text-white'
                  }`}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00BFFF] group-hover:w-full transition-all duration-300" />
                </Link>
              )
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button onClick={toggleLang} className="hidden sm:flex px-3 py-1 text-xs font-bold border border-[#00BFFF] text-[#00BFFF] rounded hover:bg-[#00BFFF] hover:text-black transition-all">
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="lg:hidden text-white"
              type="button"
              title={isMenuOpen ? "Close menu" : "Open menu"}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-16 left-0 right-0 bg-[#0A0A1E] border-b border-[#141430] z-40 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                item.isAnchor ? (
                  <a
                    key={item.path}
                    href={getNavPath(item.path, true)}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg text-[#A8B4C8] hover:text-[#00BFFF] transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg text-[#A8B4C8] hover:text-[#00BFFF] transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
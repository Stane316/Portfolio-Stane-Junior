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

  // Détection de la page actuelle
  const isHomePage = location.pathname === '/' || location.pathname === '';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gestion intelligente des liens
  const getLinkPath = (path: string) => {
    // Si c'est une ancre (#) et qu'on est sur la page d'accueil, on garde l'ancre simple
    if (path.startsWith('#') && isHomePage) return path;
    // Sinon on force le chemin complet (ex: /#about)
    return path.startsWith('#') ? `/${path}` : path;
  };

  const navLinks = [
    { label: isFr ? 'Accueil' : 'Home', path: '#hero' },
    { label: isFr ? 'À propos' : 'About', path: '#about' },
    { label: isFr ? 'Projets' : 'Projects', path: '#projects' },
    { label: 'GROW TECH', path: '/growtech' }, // Lien vers la page dédiée
    { label: 'Blog', path: '/blog' },
    { label: isFr ? 'Contact' : 'Contact', path: '#contact' },
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
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={getLinkPath(link.path)}
                className={`text-sm font-medium transition-colors relative group ${
                  (link.path.startsWith('#') && isHomePage && location.hash === link.path) || 
                  (!link.path.startsWith('#') && location.pathname === link.path)
                    ? 'text-[#00BFFF]'
                    : 'text-[#A8B4C8] hover:text-white'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00BFFF] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button onClick={toggleLang} className="hidden sm:flex px-3 py-1 text-xs font-bold border border-[#00BFFF] text-[#00BFFF] rounded hover:bg-[#00BFFF] hover:text-black transition-all">
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white">
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
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={getLinkPath(link.path)}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg text-[#A8B4C8] hover:text-[#00BFFF] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
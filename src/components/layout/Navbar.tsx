import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Détecte si on est sur une page autre que l'accueil
  const isProjectsPage = location.pathname === '/projects';
  const isAdminPage = location.pathname.startsWith('/admin');

  // Si on est sur une sous-page, on préfixe les liens par "/#"
  const linkPrefix = isProjectsPage ? '/#' : '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: `${linkPrefix}hero`, label: isFr => isFr ? 'Accueil' : 'Home' },
    { href: `${linkPrefix}about`, label: isFr => isFr ? 'À propos' : 'About' },
    { href: `${linkPrefix}projects`, label: isFr => isFr ? 'Projets' : 'Projects' },
    { href: `${linkPrefix}growtech`, label: isFr => isFr ? 'GROW TECH' : 'GROW TECH' },
    { href: `${linkPrefix}contact`, label: isFr => isFr ? 'Contact' : 'Contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isProjectsPage || isAdminPage) return; // Laisser le Router gérer si on change de page
    e.preventDefault();
    setIsMenuOpen(false);
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Si on est sur Admin, on n'affiche pas cette navbar
  if (isAdminPage) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'glass py-3' : 'bg-transparent py-5'
        }`}
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo - Retour accueil */}
            <RouterLink to="/" className="flex items-center gap-2 group" aria-label="Accueil">
              <span className="font-heading text-3xl text-white group-hover:text-[#00BFFF] transition-colors">
                SJ
              </span>
              <span className="w-2 h-2 bg-[#00BFFF] rounded-full animate-pulse" />
            </RouterLink>

            {/* Liens Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <RouterLink
                  key={link.href}
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-[#A8B4C8] hover:text-[#00BFFF] transition-colors relative group font-body text-sm"
                >
                  {link.label(lang === 'fr')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00BFFF] group-hover:w-full transition-all duration-300" />
                </RouterLink>
              ))}
            </div>

            {/* Actions Droite */}
            <div className="flex items-center gap-3">
              {/* Thème (Optionnel si activé) */}
              {/* <button onClick={toggleTheme} className="p-2 text-[#A8B4C8] hover:text-[#00BFFF]">...</button> */}

              {/* Langue */}
              <button
                onClick={toggleLang}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-[#00BFFF] rounded-lg text-[#00BFFF] hover:bg-[#00BFFF] hover:text-black transition-all duration-300 font-semibold text-sm"
                aria-label="Changer de langue"
              >
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>

              {/* Hamburger Mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-[#00BFFF]"
                aria-label="Menu"
                aria-expanded={isMenuOpen}
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-current transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`w-full h-0.5 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`w-full h-0.5 bg-current transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 lg:hidden"
          >
            <div className="absolute inset-0 bg-[#0A0A1E] bg-opacity-95 backdrop-blur-xl" />
            <div className="relative container-custom pt-24 px-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <RouterLink
                    key={link.href}
                    to={link.href}
                    onClick={(e) => {
                      handleNavClick(e, link.href);
                      setIsMenuOpen(false);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-lg text-[#A8B4C8] hover:text-[#00BFFF] transition-colors font-body py-2 border-b border-[rgba(0,191,255,0.1)]"
                  >
                    {link.label(lang === 'fr')}
                  </RouterLink>
                ))}
                
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={toggleLang}
                  className="mt-4 px-4 py-3 border border-[#00BFFF] rounded-lg text-[#00BFFF] hover:bg-[#00BFFF] hover:text-black transition-all duration-300 font-semibold"
                >
                  {lang === 'fr' ? 'Switch to English' : 'Passer en français'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
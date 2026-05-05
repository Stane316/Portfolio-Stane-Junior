/**
 * Navigation Bar Component
 * 
 * Responsive navbar with:
 * - Logo (SJ with animated cyan dot)
 * - Navigation links (desktop)
 * - Hamburger menu (mobile)
 * - Language switcher
 * - Glassmorphism effect on scroll
 * 
 * @see /src/contexts/LanguageContext.tsx
 */

import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: lang === 'fr' ? 'Accueil' : 'Home' },
    { href: '#about', label: lang === 'fr' ? 'À propos' : 'About' },
    { href: '#skills', label: lang === 'fr' ? 'Compétences' : 'Skills' },
    { href: '#projects', label: lang === 'fr' ? 'Projets' : 'Projects' },
    { href: '#growtech', label: lang === 'fr' ? 'GROW TECH' : 'GROW TECH' },
    { href: '#vision', label: lang === 'fr' ? 'Vision' : 'Vision' },
    { href: '#contact', label: lang === 'fr' ? 'Contact' : 'Contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
  };

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
            <RouterLink to="/" className="flex items-center gap-2 group" aria-label="Accueil">
              <span className="font-heading text-3xl text-white group-hover:text-[#00BFFF] transition-colors">
                SJ
              </span>
              <span className="w-2 h-2 bg-[#00BFFF] rounded-full animate-pulse" />
            </RouterLink>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-[#A8B4C8] hover:text-[#00BFFF] transition-colors relative group font-body text-sm nav-link"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors rounded-lg hover:bg-[#141430] theme-toggle"
                aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <button
                onClick={toggleLang}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-[#00BFFF] rounded-lg text-[#00BFFF] hover:bg-[#00BFFF] hover:text-black transition-all duration-300 font-semibold text-sm"
                aria-label="Changer de langue"
              >
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>

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
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-lg text-[#A8B4C8] hover:text-[#00BFFF] transition-colors font-body py-2 border-b border-[rgba(0,191,255,0.1)]"
                  >
                    {link.label}
                  </motion.a>
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
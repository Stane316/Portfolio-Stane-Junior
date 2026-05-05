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
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { lang, toggleLang } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
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
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <RouterLink to="/" className="flex items-center gap-2 group">
              <span className="font-heading text-3xl text-white group-hover:text-[var(--accent-cyan)] transition-colors">
                SJ
              </span>
              <span className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-pulse" />
            </RouterLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] 
                           transition-colors relative group font-body text-sm"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent-cyan)] 
                                 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Language Switcher & Mobile Menu Button */}
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLang}
                className="hidden sm:flex items-center gap-2 px-4 py-2 border border-[var(--accent-cyan)] 
                         rounded-lg text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] 
                         hover:text-black transition-all duration-300 font-semibold text-sm"
                aria-label="Switch language"
              >
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-[var(--accent-cyan)]"
                aria-label="Toggle menu"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 lg:hidden"
          >
            <div className="absolute inset-0 bg-[var(--bg-primary)] bg-opacity-95 backdrop-blur-xl" />
            <div className="relative container-custom pt-24 px-6">
              <div className="flex flex-col gap-6">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-xl text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] 
                             transition-colors font-body"
                  >
                    {link.label}
                  </motion.a>
                ))}
                
                {/* Mobile Language Toggle */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={toggleLang}
                  className="mt-4 px-6 py-3 border border-[var(--accent-cyan)] rounded-lg 
                           text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] 
                           hover:text-black transition-all duration-300 font-semibold"
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

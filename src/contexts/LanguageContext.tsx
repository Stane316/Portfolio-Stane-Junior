/**
 * Language Context for bilingual support (FR/EN)
 * 
 * This context manages the application language state and provides
 * translation functionality throughout the component tree.
 * 
 * @see /src/lib/i18n.ts for translation data
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Fonction de détection de langue du navigateur
const detectBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'fr';
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  const langCode = browserLang.toLowerCase();
  
  // Si la langue commence par 'fr' -> français
  if (langCode.startsWith('fr')) return 'fr';
  
  // Si la langue est dans une région francophone
  const francophoneRegions = ['fr', 'be', 'ch', 'lu', 'mc', 're', 'gp', 'mq', 'gf', 'nc', 'pf', 'pm', 'wf', 'yt'];
  if (francophoneRegions.some((region) => langCode.includes(region))) return 'fr';
  
  // Par défaut -> anglais pour les autres
  return 'en';
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    // 1. Vérifier localStorage d'abord
    const saved = localStorage.getItem('portfolio-lang');
    if (saved === 'fr' || saved === 'en') return saved;
    
    // 2. Sinon détecter la langue du navigateur
    return detectBrowserLanguage();
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('portfolio-lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'fr' ? 'en' : 'fr');
  };

  const t = (key: string): string => {
    return key;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
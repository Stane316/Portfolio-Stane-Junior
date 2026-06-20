/**
 * Language Context for bilingual support (FR/EN)
 * 
 * This context manages the application language state and provides
 * translation functionality throughout the component tree.
 * 
 * Connected to the i18n translation system in /src/lib/i18n.ts
 * All translatable strings are centralized there.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translate, Language } from '../lib/i18n';

export type { Language };

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

/**
 * Detects the user's preferred language based on browser settings.
 * Defaults to French for francophone regions, English otherwise.
 */
const detectBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'fr';
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  const langCode = browserLang.toLowerCase();
  
  // French-speaking countries and regions
  const francophoneRegions = ['fr', 'be', 'ch', 'lu', 'mc', 're', 'gp', 'mq', 'gf', 'nc', 'pf', 'pm', 'wf', 'yt', 'bj', 'ci', 'sn', 'ml', 'ne', 'tg', 'bf', 'gn', 'cm', 'cf', 'cg', 'cd', 'ga', 'td', 'km', 'mg', 'dj'];
  
  if (langCode.startsWith('fr')) return 'fr';
  if (francophoneRegions.some((region) => langCode.includes(region))) return 'fr';
  
  return 'en';
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    // 1. Check localStorage first (user preference)
    const saved = localStorage.getItem('portfolio-lang');
    if (saved === 'fr' || saved === 'en') return saved;
    
    // 2. Detect browser language
    return detectBrowserLanguage();
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('portfolio-lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'fr' ? 'en' : 'fr');
  };

  /**
   * Translation function — connected to i18n translations
   * Returns the translated string for the current language,
   * or the key itself as fallback.
   */
  const t = (key: string): string => {
    return translate(key, lang);
  };

  // Update document lang attribute when language changes
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

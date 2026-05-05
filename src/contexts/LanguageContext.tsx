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

/**
 * LanguageProvider component
 * Wraps the application and provides language context to all children
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    // Try to get saved language from localStorage
    const saved = localStorage.getItem('portfolio-lang');
    if (saved === 'fr' || saved === 'en') return saved;
    // Default to French (local audience)
    return 'fr';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('portfolio-lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'fr' ? 'en' : 'fr');
  };

  // Simple translation function - in production, this would use i18n data
  const t = (key: string): string => {
    // This will be replaced with actual translation data from i18n.ts
    return key;
  };

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to use the language context
 * Must be used within a LanguageProvider
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

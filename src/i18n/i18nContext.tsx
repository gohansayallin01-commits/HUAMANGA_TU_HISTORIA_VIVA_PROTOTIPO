import React, { createContext, useContext, useState, useEffect } from 'react';
import esTranslations from './es.json';
import enTranslations from './en.json';

type Language = 'es' | 'en' | 'fr' | 'pt';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string, fallback?: string) => string;
}

const translations: Record<string, Record<string, any>> = {
  es: esTranslations,
  en: enTranslations,
  fr: esTranslations, // Fallback con soporte futuro
  pt: esTranslations, // Fallback con soporte futuro
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('huamanga_lang');
    if (saved === 'es' || saved === 'en' || saved === 'fr' || saved === 'pt') {
      return saved;
    }
    return 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('huamanga_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (keyPath: string, fallback?: string): string => {
    const keys = keyPath.split('.');
    let current: any = translations[language] || translations.es;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to spanish
        let fallbackCurrent: any = translations.es;
        for (const fbKey of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === 'object' && fbKey in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fbKey];
          } else {
            return fallback || keyPath;
          }
        }
        return typeof fallbackCurrent === 'string' ? fallbackCurrent : (fallback || keyPath);
      }
    }

    return typeof current === 'string' ? current : (fallback || keyPath);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

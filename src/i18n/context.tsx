"use client";

import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { Language, defaultLanguage } from "./config";
import {
    getLanguageFromStorage,
    getTranslation,
    setLanguageToStorage,
} from "./index";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  // Set initial language on HTML element to prevent hydration mismatch
  useEffect(() => {
    document.documentElement.lang = defaultLanguage;
  }, []);

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = getLanguageFromStorage();
    setLanguageState(savedLanguage);
    // Update document lang attribute with the loaded language
    document.documentElement.lang = savedLanguage;
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setLanguageToStorage(lang);
    // Update document lang attribute
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

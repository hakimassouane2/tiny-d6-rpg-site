import { Language, defaultLanguage } from "./config";

// Import translation files
import enTranslations from "./locales/en.json";
import frTranslations from "./locales/fr.json";

const translations = {
  en: enTranslations,
  fr: frTranslations,
};

export type TranslationKey = string;

export function getTranslation(language: Language, key: string): string {
  const keys = key.split(".");
  let current: unknown =
    translations[language] || translations[defaultLanguage];

  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = (current as Record<string, unknown>)[k];
    } else {
      // Fallback to English if key not found
      current = getNestedValue(translations[defaultLanguage], keys);
      break;
    }
  }

  return typeof current === "string" ? current : key;
}

function getNestedValue(obj: unknown, keys: string[]): string {
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return keys.join(".");
    }
  }

  return typeof current === "string" ? current : keys.join(".");
}

export function getLanguageFromStorage(): Language {
  if (typeof window === "undefined") return defaultLanguage;

  const saved = localStorage.getItem("language") as Language;
  return saved && ["en", "fr"].includes(saved) ? saved : defaultLanguage;
}

export function setLanguageToStorage(language: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("language", language);
}

export { translations };

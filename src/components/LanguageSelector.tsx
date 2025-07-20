"use client";

import { Globe } from "lucide-react";
import React from "react";
import { languageLabels, supportedLanguages } from "../i18n/config";
import { useI18n } from "../i18n/context";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useI18n();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLanguage = event.target.value as "en" | "fr";
    setLanguage(newLanguage);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <select
        value={language}
        onChange={handleLanguageChange}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        aria-label={t("common.language")}
      >
        {supportedLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {languageLabels[lang]}
          </option>
        ))}
      </select>
    </div>
  );
}

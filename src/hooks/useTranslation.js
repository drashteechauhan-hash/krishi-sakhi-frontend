// src/hooks/useTranslation.js
// Usage in any page:
//   const { t } = useTranslation("home");
//   const { t } = useTranslation("activity");

import { useLanguage } from "../context/LanguageContext";
import translations from "../i18n/translations";

export function useTranslation(page) {
  const { lang } = useLanguage();

  // Falls back to English if a language hasn't been translated yet
  const langData = translations[lang] || translations["en"];

  return {
    t:      langData[page]    || translations["en"][page] || {},
    common: langData["common"] || translations["en"]["common"] || {},
  };
}
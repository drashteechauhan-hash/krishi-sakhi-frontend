import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English",    flag: "🇬🇧", native: "English"   },
  { code: "hi", label: "Hindi",      flag: "🇮🇳", native: "हिंदी"     },
  { code: "ml", label: "Malayalam",  flag: "🇮🇳", native: "മലയാളം"   },
  { code: "te", label: "Telugu",     flag: "🇮🇳", native: "తెలుగు"   },
];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    // Read from localStorage on first load
    return localStorage.getItem("ks_lang") || null;
  });
  const [langSelected, setLangSelected] = useState(() => {
    return !!localStorage.getItem("ks_lang");
  });

  const selectLanguage = (code) => {
    localStorage.setItem("ks_lang", code);
    setLang(code);
    setLangSelected(true);
  };

  return (
    <LanguageContext.Provider value={{ lang, selectLanguage, langSelected }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
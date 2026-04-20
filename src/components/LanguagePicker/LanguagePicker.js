import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./LanguagePicker.css";

export default function LanguagePicker() {
  const { langSelected, selectLanguage, isTranslating, SUPPORTED_LANGUAGES } = useLanguage();

  if (langSelected && !isTranslating) return null;

  if (isTranslating) {
    return (
      <div className="lp-overlay">
        <div className="lp-modal lp-loading">
          <div className="lp-spinner" />
          <p className="lp-loading-text">Setting up your language...</p>
          <p className="lp-loading-sub">This takes a few seconds on first use</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lp-overlay">
      <div className="lp-modal">
        <div className="lp-logo">🌾</div>
        <h2 className="lp-title">Krishi Sakhi</h2>
        <p className="lp-sub">
          Choose your language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക
        </p>
        <div className="lp-grid">
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              className="lp-btn"
              onClick={() => selectLanguage(l.code)}
            >
              <span className="lp-flag">{l.flag}</span>
              <span className="lp-native">{l.native}</span>
              <span className="lp-english">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
import React from "react";
import "./Footer.css";
import { useLanguage } from "../../context/LanguageContext";

function Footer() {
  const { lang } = useLanguage();

  const TEXT = {
    en: {
      links: ["Terms & Conditions", "Disclaimer", "Related Links", "Website Policy", "Help", "Accessibility Statement", "Privacy Policy"],
      desc: "AI-Powered Personal Farming Assistant – Providing Kerala farmers with real-time crop insights, voice support, and market guidance.",
      dev: "Designed and developed by SIH Team 2025",
      support: "Supported by Department of Agriculture Development & Farmers’ Welfare, Govt. of Kerala",
      copyright: "© 2025 Krishi Sakhi | All Rights Reserved"
    },
    ml: {
      links: ["നിബന്ധനകൾ", "ഡിസ്ക്ലെയിമർ", "ബന്ധപ്പെട്ട ലിങ്കുകൾ", "വെബ്സൈറ്റ് നയം", "സഹായം", "ആക്സസിബിലിറ്റി", "സ്വകാര്യത നയം"],
      desc: "AI കൃഷി സഹായി – കേരള കർഷകർക്ക് വിള വിവരങ്ങൾ, ശബ്ദ സഹായം, വിപണി മാർഗ്ഗനിർദേശം നൽകുന്നു.",
      dev: "SIH ടീം 2025 രൂപകൽപ്പന ചെയ്തത്",
      support: "കേരള സർക്കാർ കൃഷി വകുപ്പ് പിന്തുണ",
      copyright: "© 2025 കൃഷി സഹി | എല്ലാ അവകാശങ്ങളും സംരക്ഷിതം"
    }
  };

  const t = TEXT[lang] || TEXT.en;

  return (
    <footer className="footer">
      <div className="footer-links">
        {t.links.map((link, i) => (
          <span key={i}>
            <a href="#">{link}</a>
            {i !== t.links.length - 1 && " | "}
          </span>
        ))}
      </div>

      <div className="footer-text">
        <p>🌾 <b>{t.desc}</b></p>
        <p><b>{t.dev}</b> | {t.support}</p>
        <p>{t.copyright}</p>
      </div>
    </footer>
  );
}

export default Footer;
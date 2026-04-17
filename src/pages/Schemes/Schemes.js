import React, { useState } from "react";
import schemeVideo from "../../assets/videos/schemes.mp4";
import VideoPopup from "../../components/VideoPopup/VideoPopup";
import { useLanguage } from "../../context/LanguageContext";

const SCHEMES_DATA = {
  agriculture: [
    { nameKey: "agri_infra", link: "https://agriinfra.dac.gov.in/" },
    { nameKey: "pm_kisan", link: "https://pmkisan.gov.in/" },
    { nameKey: "atma", link: "https://extensionreforms.da.gov.in/DashBoard_Statusatma.aspx" },
    { nameKey: "agmarknet", link: "https://agmarknet.gov.in/PriceAndArrivals/arrivals1.aspx" },
    { nameKey: "midh", link: "https://midh.gov.in/" },
    { nameKey: "pesticide", link: "#" },
    { nameKey: "plant_quarantine", link: "https://pqms.cgg.gov.in/pqms-angular/home" },
    { nameKey: "dbt", link: "https://www.dbtdacfw.gov.in/" },
    { nameKey: "pmksy", link: "https://pmksy.gov.in/mis/frmDashboard.aspx" },
    { nameKey: "kisan_call", link: "https://mkisan.gov.in/Home/KCCDashboard" },
    { nameKey: "mkisan", link: "https://mkisan.gov.in/" },
    { nameKey: "jaivik", link: "http://pgsindia-ncof.gov.in/home.aspx" },
    { nameKey: "enam", link: "https://enam.gov.in/web/" },
    { nameKey: "soil_health", link: "https://soilhealth.dac.gov.in/home" },
    { nameKey: "pmfby", link: "https://pmfby.gov.in/ext/rpt/ssfr_17" },
  ],
  welfare: [
    { nameKey: "dispute", link: "#" },
    { nameKey: "farming_agreement", link: "#" },
    { nameKey: "guidelines", link: "#" },
  ],
};

const TEXT = {
  en: {
    eyebrow: "Government Programs",
    title: "Farmer Welfare Schemes",
    subtitle: "Official schemes and portals to support every farmer across India.",
    videoTitle: "Farmer Welfare Schemes Explained",
    videoSub: "Learn about PM-Kisan, crop insurance & more",
    agriHead: "Agriculture Schemes",
    agriSub: "Central government programs for crop, irrigation & market support",
    welfareHead: "Farmer Welfare",
    welfareSub: "Dispute resolution and contract farming frameworks",
    colScheme: "Scheme",
    colDesc: "What it does",
    colLink: "Portal",
    visit: "Visit →",
    na: "—",
    schemes: {
      agri_infra: { name: "Agriculture Infrastructure Fund", desc: "Medium-long term debt financing for post-harvest management and community farming assets. Reduces post-harvest losses." },
      pm_kisan: { name: "PM-Kisan Samman Nidhi", desc: "Direct income support of ₹6,000/year in three installments directly into farmers' bank accounts." },
      atma: { name: "ATMA", desc: "Strengthens agricultural extension services at district level. Training, exposure visits, and farmer advisory services." },
      agmarknet: { name: "AGMARKNET", desc: "Nationwide agricultural marketing network providing daily commodity price data across wholesale markets." },
      midh: { name: "Horticulture (MIDH)", desc: "Holistic development of horticulture — fruits, vegetables, flowers, spices and plantation crops." },
      pesticide: { name: "Online Pesticide Registration", desc: "Portal for manufacturers to register pesticides legally. Ensures only approved pesticides reach farmers." },
      plant_quarantine: { name: "Plant Quarantine Clearance", desc: "Online system regulating import/export of plants and seeds. Prevents entry of pests and diseases." },
      dbt: { name: "DBT in Agriculture", desc: "Subsidies for seeds, fertilizers, and equipment delivered directly into Aadhaar-linked accounts." },
      pmksy: { name: "PM Krishi Sinchayee Yojana", desc: "'Har Khet Ko Pani' — promotes efficient irrigation, micro-irrigation and watershed development." },
      kisan_call: { name: "Kisan Call Center", desc: "Call 1800-180-1551 (toll-free) for advice from agri experts in your local language." },
      mkisan: { name: "MKisan", desc: "Mobile platform sending SMS/IVR advisories on weather, market prices and scheme updates." },
      jaivik: { name: "Jaivik Kheti", desc: "Online portal for organic farming — sell organic produce, get certification and connect with buyers." },
      enam: { name: "e-Nam", desc: "Pan-India electronic trading portal integrating APMC markets. Sell produce online at fair prices." },
      soil_health: { name: "Soil Health Card", desc: "Soil test reports indicating nutrient status and fertilizer recommendations for your land." },
      pmfby: { name: "PM Fasal Bima Yojana", desc: "Crop insurance with low premiums. Covers losses from natural calamities, pests and diseases." },
      dispute: { name: "Dispute Resolution Rules", desc: "Rules for settling disputes under farm agreements via conciliation board and Sub-Divisional Magistrate." },
      farming_agreement: { name: "Farming Agreement Final Act", desc: "Framework for contract farming with written agreements ensuring guaranteed prices and clear terms." },
      guidelines: { name: "Guidelines Farm Services Act, 2020", desc: "Instructions for implementing farm agreements in local language with clear, fair terms." },
    },
  },
  hi: {
    eyebrow: "सरकारी कार्यक्रम",
    title: "किसान कल्याण योजनाएं",
    subtitle: "भारत के हर किसान के लिए आधिकारिक योजनाएं और पोर्टल।",
    videoTitle: "किसान कल्याण योजनाएं समझाई गईं",
    videoSub: "PM-किसान, फसल बीमा और अधिक जानें",
    agriHead: "कृषि योजनाएं",
    agriSub: "फसल, सिंचाई और बाजार समर्थन के लिए केंद्र सरकार के कार्यक्रम",
    welfareHead: "किसान कल्याण",
    welfareSub: "विवाद समाधान और अनुबंध खेती की रूपरेखा",
    colScheme: "योजना",
    colDesc: "क्या करती है",
    colLink: "पोर्टल",
    visit: "देखें →",
    na: "—",
    schemes: {
      agri_infra: { name: "कृषि अवसंरचना निधि", desc: "फसल कटाई के बाद प्रबंधन और सामुदायिक कृषि संपत्तियों के लिए मध्यम-दीर्घकालिक ऋण।" },
      pm_kisan: { name: "पीएम-किसान सम्मान निधि", desc: "किसानों को ₹6,000 प्रति वर्ष तीन समान किस्तों में सीधे बैंक खाते में।" },
      atma: { name: "ATMA", desc: "जिला स्तर पर कृषि विस्तार सेवाएं, प्रशिक्षण और किसान सलाह।" },
      agmarknet: { name: "AGMARKNET", desc: "थोक बाजारों में वस्तुओं के दैनिक मूल्य डेटा वाला राष्ट्रव्यापी नेटवर्क।" },
      midh: { name: "बागवानी (MIDH)", desc: "फल, सब्जियां, फूल, मसाले और बागान फसलों का समग्र विकास।" },
      pesticide: { name: "ऑनलाइन कीटनाशक पंजीकरण", desc: "केवल अनुमोदित कीटनाशक किसानों तक पहुंचें — निर्माताओं के लिए पंजीकरण पोर्टल।" },
      plant_quarantine: { name: "पादप संगरोध", desc: "पौधों और बीजों के आयात/निर्यात को नियंत्रित करने वाली ऑनलाइन प्रणाली।" },
      dbt: { name: "कृषि में DBT", desc: "बीज, उर्वरक और उपकरण सब्सिडी आधार से जुड़े खातों में सीधे।" },
      pmksy: { name: "PM कृषि सिंचाई योजना", desc: "\"हर खेत को पानी\" — ड्रिप/स्प्रिंकलर सिंचाई और जलक्षेत्र विकास।" },
      kisan_call: { name: "किसान कॉल सेंटर", desc: "1800-180-1551 पर स्थानीय भाषा में कृषि विशेषज्ञों से सलाह (टोल-फ्री)।" },
      mkisan: { name: "MKisan", desc: "SMS/IVR द्वारा मौसम, बाजार मूल्य और योजना अपडेट।" },
      jaivik: { name: "जैविक खेती", desc: "जैविक उपज बेचें, प्रमाणन पाएं और खरीदारों से जुड़ें।" },
      enam: { name: "e-NAM", desc: "ऑनलाइन उपज बेचें और APMC बाजारों में उचित मूल्य पाएं।" },
      soil_health: { name: "मृदा स्वास्थ्य कार्ड", desc: "मिट्टी की पोषक स्थिति और उर्वरक सिफारिशें।" },
      pmfby: { name: "PM फसल बीमा योजना", desc: "कम प्रीमियम में प्राकृतिक आपदाओं और कीटों से फसल नुकसान बीमा।" },
      dispute: { name: "विवाद समाधान नियम", desc: "उप-विभागीय मजिस्ट्रेट के माध्यम से कृषि समझौता विवादों का त्वरित समाधान।" },
      farming_agreement: { name: "कृषि समझौता अधिनियम", desc: "गारंटीकृत मूल्य और स्पष्ट शर्तों के साथ अनुबंध खेती।" },
      guidelines: { name: "फार्म सेवा अधिनियम दिशानिर्देश, 2020", desc: "स्थानीय भाषा में स्पष्ट शर्तों के साथ कृषि अनुबंध लागू करने के निर्देश।" },
    },
  },
  ml: {
    eyebrow: "സർക്കാർ പദ്ധതികൾ",
    title: "കർഷക ക്ഷേമ പദ്ധതികൾ",
    subtitle: "ഇന്ത്യയിലെ ഓരോ കർഷകനും വേണ്ടിയുള്ള ഔദ്യോഗിക പദ്ധതികളും പോർട്ടലുകളും.",
    videoTitle: "കർഷക ക്ഷേമ പദ്ധതികൾ വിശദീകരിച്ചു",
    videoSub: "PM-കിസാൻ, വിള ഇൻഷുറൻസ് & കൂടുതൽ",
    agriHead: "കൃഷി പദ്ധതികൾ",
    agriSub: "വിള, ജലസേചനം, വിപണി പിന്തുണക്കുള്ള കേന്ദ്ര സർക്കാർ പദ്ധതികൾ",
    welfareHead: "കർഷക ക്ഷേമം",
    welfareSub: "തർക്ക പരിഹാരവും കരാർ കൃഷി ചട്ടക്കൂടും",
    colScheme: "പദ്ധതി",
    colDesc: "എന്ത് ചെയ്യുന്നു",
    colLink: "പോർട്ടൽ",
    visit: "സന്ദർശിക്കൂ →",
    na: "—",
    schemes: {
      agri_infra: { name: "കൃഷി അടിസ്ഥാന സൗകര്യ ഫണ്ട്", desc: "വിളവെടുപ്പ് ശേഷ നിർവ്വഹണത്തിനും കർഷക ആസ്തികൾക്കും ദീർഘകാല ഋണ ധനസഹായം." },
      pm_kisan: { name: "PM-കിസാൻ സമ്മാൻ നിധി", desc: "ചെറുകിട കർഷകർക്ക് വർഷം ₹6,000 മൂന്ന് ഗഡുക്കളിൽ നേരിട്ട് ബാങ്ക് അക്കൗണ്ടിൽ." },
      atma: { name: "ATMA", desc: "ജില്ലാ തലത്തിൽ കൃഷി വിജ്ഞാന ശക്തിപ്പെടുത്തൽ, പരിശീലനം, ഫാർമർ അഡ്വൈസറി." },
      agmarknet: { name: "AGMARKNET", desc: "മൊത്ത വിപണികളിൽ ദൈനംദിന ചരക്ക് വില ഡേറ്റ. ദേശവ്യാപക ശൃംഖല." },
      midh: { name: "തോട്ടകൃഷി (MIDH)", desc: "പഴം, പച്ചക്കറി, പൂക്കൾ, സുഗന്ധ വ്യഞ്ജനങ്ങൾ, തോട്ടക്കൃഷി വിളകളുടെ സമഗ്ര വികസനം." },
      pesticide: { name: "ഓൺലൈൻ കീടനാശിനി രജിസ്ട്രേഷൻ", desc: "കീടനാശിനികൾ നിയമപരമായി രജിസ്റ്റർ ചെയ്യാനുള്ള പോർട്ടൽ. അംഗീകൃത ഉൽപ്പന്നങ്ങൾ മാത്രം." },
      plant_quarantine: { name: "സസ്യ ക്വാറന്റൈൻ", desc: "സസ്യങ്ങളുടെ ഇറക്കുമതി/കയറ്റുമതി നിയന്ത്രിക്കുന്ന ഓൺലൈൻ സംവിധാനം." },
      dbt: { name: "കൃഷിയിൽ DBT", desc: "വളം, വിത്ത് സബ്സിഡി ആധാർ ലിങ്ക്ഡ് അക്കൗണ്ടുകളിൽ നേരിട്ട്." },
      pmksy: { name: "PM കൃഷി സിഞ്ചായ് യോജന", desc: "ഡ്രിപ്/സ്പ്രിംഗ്ളർ ജലസേചനം, ജലവിഭവ വികസനം — 'ഹർ ഖേത് കോ പാനി'." },
      kisan_call: { name: "കിസാൻ കോൾ സെന്റർ", desc: "1800-180-1551 (ടോൾ-ഫ്രീ) — പ്രാദേശിക ഭാഷയിൽ കൃഷി വിദഗ്ദ്ധ ഉപദേശം." },
      mkisan: { name: "MKisan", desc: "കർഷകർക്ക് SMS/IVR വഴി കാലാവസ്ഥ, വിപണി വില, പദ്ധതി അപ്ഡേറ്റ്." },
      jaivik: { name: "ജൈവ കൃഷി", desc: "ജൈവ ഉൽപ്പന്നങ്ങൾ വിൽക്കാൻ, സർട്ടിഫിക്കേഷൻ നേടാൻ ഓൺലൈൻ പോർട്ടൽ." },
      enam: { name: "e-NAM", desc: "ദേശീയ ഇലക്ട്രോണിക് ട്രേഡിംഗ് പോർട്ടൽ — ഓൺലൈനിൽ ന്യായ വിലയ്ക്ക് ഉൽപ്പന്നങ്ങൾ." },
      soil_health: { name: "മണ്ണ് ആരോഗ്യ കാർഡ്", desc: "മണ്ണ് പോഷക നില, വളം ശുപാർശകൾ അടങ്ങിയ പരിശോധനാ റിപ്പോർട്ട്." },
      pmfby: { name: "PM ഫസൽ ബിമ യോജന", desc: "കുറഞ്ഞ പ്രീമിയം — പ്രകൃതി ദുരന്തം, കീടം മൂലമുള്ള വിള നഷ്ടം ഇൻഷ്വർ ചെയ്യുന്നു." },
      dispute: { name: "തർക്ക പരിഹാര നിയമം", desc: "മജിസ്ട്രേറ്റ് വഴി കൃഷി കരാർ തർക്കങ്ങൾ വേഗം തീർക്കാൻ." },
      farming_agreement: { name: "കൃഷി കരാർ ആക്ട്", desc: "ഗ്യാരന്റീ വിലയോടും വ്യക്തമായ ഉടമ്പടിയോടും കൂടിയ കോൺട്രാക്ട് കൃഷി." },
      guidelines: { name: "ഫാം സേവന ആക്ട് മാർഗ്ഗനിർദ്ദേശം, 2020", desc: "പ്രാദേശിക ഭാഷയിൽ ലളിതമായ, ന്യായമായ കരാർ തയ്യാറാക്കുന്നതിനുള്ള നിർദ്ദേശങ്ങൾ." },
    },
  },
};

function SchemeRow({ nameKey, link, t, index }) {
  const scheme = t.schemes[nameKey];
  if (!scheme) return null;
  return (
    <tr className={index % 2 === 0 ? "row-even" : "row-odd"}>
      <td className="scheme-name-cell">
        <span className="scheme-dot" />
        {scheme.name}
      </td>
      <td className="scheme-desc-cell">{scheme.desc}</td>
      <td className="scheme-link-cell">
        {link !== "#" ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="scheme-link">
            {t.visit}
          </a>
        ) : (
          <span className="scheme-na">{t.na}</span>
        )}
      </td>
    </tr>
  );
}

function Schemes() {
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .sc-page {
          font-family: 'DM Sans', Arial, sans-serif;
          color: #2c2c2a;
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* Header */
        .sc-header {
          margin-bottom: 40px;
        }
        .sc-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #3b6d11;
          margin-bottom: 10px;
        }
        .sc-title {
          font-size: clamp(1.7rem, 4vw, 2.4rem);
          font-weight: 700;
          color: #173404;
          line-height: 1.15;
          margin: 0 0 10px;
        }
        .sc-subtitle {
          font-size: 15px;
          color: #5f5e5a;
          line-height: 1.6;
          max-width: 560px;
          margin: 0;
        }

        /* Video card */
        .sc-video-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: center;
          background: #eaf3de;
          border: 1px solid #c0dd97;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 52px;
        }
        @media(max-width: 680px) { .sc-video-wrap { grid-template-columns: 1fr; } }
        .sc-video-wrap video {
          width: 100%;
          border-radius: 10px;
          display: block;
          background: #000;
        }
        .sc-video-info h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #173404;
          margin: 0 0 8px;
        }
        .sc-video-info p {
          font-size: 13.5px;
          color: #3b6d11;
          margin: 0 0 16px;
        }
        .sc-video-badge {
          display: inline-block;
          background: #97c459;
          color: #173404;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
        }

        /* Section heading */
        .sc-section-head {
          margin-bottom: 20px;
        }
        .sc-section-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #173404;
          margin: 0 0 4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sc-section-title::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 20px;
          background: #639922;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .sc-section-sub {
          font-size: 13px;
          color: #888780;
          padding-left: 14px;
          margin: 0;
        }

        /* Table wrapper */
        .sc-table-wrap {
          border: 1px solid #c0dd97;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 48px;
        }
        .sc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }
        .sc-table thead tr {
          background: #eaf3de;
        }
        .sc-table th {
          padding: 13px 16px;
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #3b6d11;
          border-bottom: 1px solid #c0dd97;
        }
        .sc-table th:last-child { text-align: center; }
        .row-even { background: #fff; }
        .row-odd  { background: #f7faf0; }
        .sc-table tr:not(:last-child) td { border-bottom: 1px solid #eaf3de; }
        .sc-table tr:hover td { background: #eaf3de; transition: background 0.15s; }
        .scheme-name-cell {
          padding: 14px 16px;
          font-weight: 600;
          color: #27500a;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          min-width: 180px;
        }
        .scheme-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #639922;
          flex-shrink: 0;
          margin-top: 6px;
        }
        .scheme-desc-cell {
          padding: 14px 16px;
          color: #5f5e5a;
          line-height: 1.55;
        }
        .scheme-link-cell {
          padding: 14px 16px;
          text-align: center;
          white-space: nowrap;
        }
        .scheme-link {
          display: inline-block;
          padding: 6px 16px;
          background: #eaf3de;
          border: 1px solid #97c459;
          border-radius: 8px;
          color: #27500a;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.18s, transform 0.18s;
        }
        .scheme-link:hover {
          background: #97c459;
          color: #173404;
          transform: translateY(-1px);
        }
        .scheme-na {
          color: #b4b2a9;
          font-size: 14px;
        }

        @media(max-width: 640px) {
          .sc-table, .sc-table thead, .sc-table tbody, .sc-table th, .sc-table td, .sc-table tr {
            display: block;
          }
          .sc-table thead { display: none; }
          .sc-table tr { padding: 12px 16px; border-bottom: 1px solid #eaf3de; }
          .scheme-name-cell, .scheme-desc-cell, .scheme-link-cell {
            padding: 4px 0;
            min-width: unset;
            text-align: left;
          }
          .scheme-link-cell { text-align: left; }
        }
      `}</style>

      <div className="sc-page">
        <VideoPopup />

        {/* Page header */}
        <div className="sc-header">
          <div className="sc-eyebrow">{t.eyebrow}</div>
          <h1 className="sc-title">{t.title}</h1>
          <p className="sc-subtitle">{t.subtitle}</p>
        </div>

        {/* Video block */}
        <div className="sc-video-wrap">
          <video controls>
            <source src={schemeVideo} type="video/mp4" />
          </video>
          <div className="sc-video-info">
            <h3>{t.videoTitle}</h3>
            <p>{t.videoSub}</p>
            <span className="sc-video-badge">🎬 Watch Now</span>
          </div>
        </div>

        {/* Agriculture schemes */}
        <div className="sc-section-head">
          <h2 className="sc-section-title">{t.agriHead}</h2>
          <p className="sc-section-sub">{t.agriSub}</p>
        </div>
        <div className="sc-table-wrap">
          <table className="sc-table">
            <thead>
              <tr>
                <th>{t.colScheme}</th>
                <th>{t.colDesc}</th>
                <th>{t.colLink}</th>
              </tr>
            </thead>
            <tbody>
              {SCHEMES_DATA.agriculture.map((s, i) => (
                <SchemeRow key={s.nameKey} nameKey={s.nameKey} link={s.link} t={t} index={i} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Welfare schemes */}
        <div className="sc-section-head">
          <h2 className="sc-section-title">{t.welfareHead}</h2>
          <p className="sc-section-sub">{t.welfareSub}</p>
        </div>
        <div className="sc-table-wrap">
          <table className="sc-table">
            <thead>
              <tr>
                <th>{t.colScheme}</th>
                <th>{t.colDesc}</th>
                <th>{t.colLink}</th>
              </tr>
            </thead>
            <tbody>
              {SCHEMES_DATA.welfare.map((s, i) => (
                <SchemeRow key={s.nameKey} nameKey={s.nameKey} link={s.link} t={t} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Schemes;
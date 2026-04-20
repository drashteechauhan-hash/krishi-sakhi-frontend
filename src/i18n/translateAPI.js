import { BASE_TRANSLATIONS } from "./translations";

const BACKEND = "https://krishi-sakhi-backend-6.onrender.com/api";

const LANG_NAMES = {
  en: "English", hi: "Hindi", ml: "Malayalam", te: "Telugu",
  ta: "Tamil", kn: "Kannada", mr: "Marathi", gu: "Gujarati",
  pa: "Punjabi", bn: "Bengali", or: "Odia", as: "Assamese",
  ur: "Urdu", ks: "Kashmiri", sd: "Sindhi", sa: "Sanskrit",
  kok: "Konkani", mai: "Maithili", doi: "Dogri", bho: "Bhojpuri",
  mni: "Manipuri (Meitei)", sat: "Santali",
};

export async function fetchTranslations(langCode) {
  if (langCode === "en") return BASE_TRANSLATIONS;

  // ✅ Check localStorage cache first
  const cacheKey = `ks_translations_${langCode}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }

  const langName = LANG_NAMES[langCode] || langCode;
  const allKeys = Object.keys(BASE_TRANSLATIONS);
  const translated = {};

  // ✅ One chunk at a time — no parallel requests
  const chunkSize = 50;

  for (let i = 0; i < allKeys.length; i += chunkSize) {
    const chunkObj = {};
    allKeys.slice(i, i + chunkSize).forEach(k => {
      chunkObj[k] = BASE_TRANSLATIONS[k];
    });

    console.log(`Translating ${Math.floor(i/chunkSize)+1}/${Math.ceil(allKeys.length/chunkSize)}`);

    let success = false;
    let retries = 3;

    while (!success && retries > 0) {
      try {
        const res = await fetch(`${BACKEND}/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: langName, data: chunkObj }),
        });

        if (!res.ok) throw new Error(`Server ${res.status}`);

        const result = await res.json();
        Object.assign(translated, result);
        success = true;

        // Wait between chunks
        if (i + chunkSize < allKeys.length) {
          await new Promise(r => setTimeout(r, 6000));
        }

      } catch (err) {
        retries--;
        console.warn(`Retry ${3 - retries}/3...`);
        if (retries > 0) {
          await new Promise(r => setTimeout(r, 8000));
        } else {
          throw new Error("Translation failed: " + err.message);
        }
      }
    }
  }

  // ✅ Save to localStorage so next time instant!
  localStorage.setItem(cacheKey, JSON.stringify(translated));

  return translated;
}
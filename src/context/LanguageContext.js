// src/context/LanguageContext.jsx
// UPDATED: Added scheme feed UI keys at bottom of BASE_TRANSLATIONS

import React, {
  createContext, useContext, useState, useEffect, useCallback, useRef,
} from "react";

const BASE_URL = "https://krishi-sakhi-backend-6.onrender.com/api";

export const SUPPORTED_LANGUAGES = [
  { code: "en",  label: "English",   native: "English",      flag: "🇬🇧", full: "English" },
  { code: "hi",  label: "Hindi",     native: "हिंदी",         flag: "🇮🇳", full: "हिंदी" },
  { code: "ml",  label: "Malayalam", native: "മലയാളം",       flag: "🌿",  full: "മലയാളം" },
  { code: "ta",  label: "Tamil",     native: "தமிழ்",         flag: "🇮🇳", full: "தமிழ்" },
  { code: "te",  label: "Telugu",    native: "తెలుగు",        flag: "🇮🇳", full: "తెలుగు" },
  { code: "kn",  label: "Kannada",   native: "ಕನ್ನಡ",         flag: "🇮🇳", full: "ಕನ್ನಡ" },
  { code: "bn",  label: "Bengali",   native: "বাংলা",         flag: "🇮🇳", full: "বাংলা" },
  { code: "mr",  label: "Marathi",   native: "मराठी",         flag: "🇮🇳", full: "मराठी" },
  { code: "gu",  label: "Gujarati",  native: "ગુજરાતી",       flag: "🇮🇳", full: "ગુજરાતી" },
  { code: "pa",  label: "Punjabi",   native: "ਪੰਜਾਬੀ",        flag: "🇮🇳", full: "ਪੰਜਾਬੀ" },
  { code: "or",  label: "Odia",      native: "ଓଡ଼ିଆ",          flag: "🇮🇳", full: "ଓଡ଼ିଆ" },
  { code: "as",  label: "Assamese",  native: "অসমীয়া",       flag: "🇮🇳", full: "অসমীয়া" },
  { code: "ur",  label: "Urdu",      native: "اردو",           flag: "🇮🇳", full: "اردو" },
  { code: "ks",  label: "Kashmiri",  native: "کٲشُر",          flag: "🇮🇳", full: "کٲشُر" },
  { code: "sd",  label: "Sindhi",    native: "سنڌي",           flag: "🇮🇳", full: "سنڌي" },
  { code: "sa",  label: "Sanskrit",  native: "संस्कृतम्",      flag: "🕉️",  full: "संस्कृतम्" },
  { code: "kok", label: "Konkani",   native: "कोंकणी",         flag: "🇮🇳", full: "कोंकणी" },
  { code: "mai", label: "Maithili",  native: "मैथिली",         flag: "🇮🇳", full: "मैथिली" },
  { code: "doi", label: "Dogri",     native: "डोगरी",          flag: "🇮🇳", full: "डोगरी" },
  { code: "bho", label: "Bhojpuri",  native: "भोजपुरी",        flag: "🇮🇳", full: "भोजपुरी" },
  { code: "mni", label: "Manipuri",  native: "মৈতৈলোন্",       flag: "🇮🇳", full: "মৈতৈলোন্" },
  { code: "sat", label: "Santali",   native: "ᱥᱟᱱᱛᱟᱲᱤ",      flag: "🇮🇳", full: "ᱥᱟᱱᱛᱟᱲᱤ" },
];

const LANG_NAME_MAP = {
  en: "English", hi: "Hindi",    ml: "Malayalam", ta: "Tamil",
  te: "Telugu",  kn: "Kannada",  bn: "Bengali",   mr: "Marathi",
  gu: "Gujarati",pa: "Punjabi",  or: "Odia",      as: "Assamese",
  ur: "Urdu",    ks: "Kashmiri", sd: "Sindhi",    sa: "Sanskrit",
  kok:"Konkani", mai:"Maithili", doi:"Dogri",      bho:"Bhojpuri",
  mni:"Manipuri (Meitei)",       sat:"Santali",
};

export const BASE_TRANSLATIONS = {
  // ── Navbar ──
  nav_home:       "Home",
  nav_about:      "About",
  nav_schemes:    "Schemes",
  nav_soil:       "Soil Health",
  nav_dashboard:  "Dashboard",
  nav_dashboard_locked: "Dashboard 🔒",
  nav_profile:    "My Profile",
  nav_activity:   "Activity",
  nav_login:      "Login",
  nav_signup:     "Sign Up",

  // ── Home ──
  home_tag:       "AI-Powered Farming Assistant",
  home_title1:    "Smarter Farming",
  home_title2:    "Starts Here",
  home_desc:      "Get personalized crop advice, market prices, weather alerts, and government scheme updates — all in your language.",
  home_btn:       "Get Started",
  home_scroll:    "Scroll",
  home_stat_1_v:  "10K+",
  home_stat_1_l:  "Farmers",
  home_stat_2_v:  "22",
  home_stat_2_l:  "Languages",
  home_stat_3_v:  "50+",
  home_stat_3_l:  "Schemes",
  home_stat_4_v:  "24/7",
  home_stat_4_l:  "AI Support",

  // ── Features ──
  feat_1_title:   "AI Crop Advisor",
  feat_1_desc:    "Get personalized crop recommendations based on your soil, location, and season.",
  feat_2_title:   "Market Prices",
  feat_2_desc:    "Live mandi prices for your crops so you can sell at the right time.",
  feat_3_title:   "Govt Schemes",
  feat_3_desc:    "Discover PM-KISAN, PMFBY, and 50+ schemes you may be eligible for.",
  feat_4_title:   "Voice Assistant",
  feat_4_desc:    "Speak in your language — our AI understands and responds in kind.",
  feat_5_title:   "Soil Health",
  feat_5_desc:    "Understand your soil card and get fertilizer recommendations.",
  feat_6_title:   "Weather Alerts",
  feat_6_desc:    "Hyperlocal forecasts and rain alerts tailored to your farm location.",

  // ── About page ──
  about_eyebrow:        "Our Story",
  about_h1a:            "Empowering Farmers",
  about_h1b:            "Across India",
  about_p1:             "Krishi Sakhi is an AI-powered platform built to bring modern agricultural knowledge to every farmer in their own language. From soil health to market prices, we make farming smarter.",
  about_video_badge:    "Watch Our Story",
  about_stat_1_n:       "10,000+",
  about_stat_1_l:       "Farmers Helped",
  about_stat_2_n:       "22",
  about_stat_2_l:       "Languages Supported",
  about_stat_3_n:       "50+",
  about_stat_3_l:       "Govt Schemes Listed",
  about_stat_4_n:       "24/7",
  about_stat_4_l:       "AI Support",
  about_feat_eyebrow:   "What We Offer",
  about_feat_title:     "Everything a Farmer Needs",
  about_feat_1_title:   "AI Crop Advisor",
  about_feat_1_desc:    "Get soil-based crop recommendations tailored to your region and season.",
  about_feat_2_title:   "Live Market Prices",
  about_feat_2_desc:    "Real-time mandi prices so you always know the best time to sell.",
  about_feat_3_title:   "Government Schemes",
  about_feat_3_desc:    "Discover PM-KISAN, PMFBY, and 50+ schemes you qualify for.",
  about_ba_eyebrow:     "Real Impact",
  about_ba_title:       "Transforming Farms Across India",
  about_before_label:   "Before: Traditional Farming",
  about_after_label:    "After: Smart Farming with Krishi Sakhi",
  about_impact_eyebrow: "Our Impact",
  about_impact_title:   "Making a Difference",
  about_impact_1:       "Farmers report 30% higher income after using AI crop recommendations",
  about_impact_2:       "Over 10,000 farmers accessed government schemes they never knew existed",
  about_impact_3:       "Voice assistant helps illiterate farmers access information easily",
  about_impact_4:       "Real-time weather alerts prevent crop losses worth crores every season",
  about_cta_h:          "Ready to Transform Your Farm?",
  about_cta_sub:        "Join thousands of farmers already using Krishi Sakhi to grow smarter.",
  about_cta_btn:        "Get Started Free",

  // ── Soil Health ──
  soil_app_name:        "Soil & Crop AI",
  soil_app_sub:         "Smart crop advisor",
  soil_step1:           "Select Your Crop",
  soil_step1_sub:       "Which crop are you planning to grow?",
  soil_step2:           "Enter Soil Values",
  soil_step2_sub:       "Adjust the sliders to match your soil test report values.",
  soil_step3:           "Best Crop for Your Soil",
  soil_loading:         "Analysing your soil...",
  soil_analyze:         "Analyse My Soil",
  soil_confidence:      "AI Confidence",
  soil_also:            "Also suitable",
  soil_why:             "Why this crop?",
  soil_fert:            "Fertilizer Recommendation",
  soil_health:          "Soil Health Report",
  soil_overall:         "Overall",
  soil_listen:          "Listen to AI Results",
  soil_stop:            "Stop Audio",
  soil_new_test:        "Start New Test",
  soil_info_title:      "Your Soil Data",
  soil_video_badge:     "VIDEO GUIDE",
  soil_video_title:     "How to Read Your Soil Health Card",
  soil_video_sub:       "2 min guide for farmers",
  soil_video_tip:       "Tip: Check your soil card before entering values",
  soil_video_close:     "Close",

  // ── Dashboard ──
  dash_welcome:              "Welcome back,",
  dash_profiles:             "Profiles",
  dash_total_land:           "Total Land",
  dash_crops:                "Crops",
  dash_acres_suffix:         " ac",
  dash_tab_overview:         "Overview",
  dash_tab_profiles:         "Profiles",
  dash_tab_analytics:        "Analytics",
  dash_loading:              "Loading your farm data...",
  dash_latest_badge:         "Latest",
  dash_crop_label:           "Primary Crop",
  dash_land_label:           "Land Size",
  dash_soil_label:           "Soil Type",
  dash_water_label:          "Irrigation",
  dash_th_num:               "#",
  dash_th_name:              "Name",
  dash_th_location:          "Location",
  dash_th_crop:              "Crop",
  dash_th_land:              "Land",
  dash_th_soil:              "Soil",
  dash_th_irrigation:        "Irrigation",
  dash_pill_1:               "Total Profiles",
  dash_pill_2:               "Total Land",
  dash_pill_3:               "Unique Crops",
  dash_pill_4:               "Soil Types",
  dash_weather_tag:          "LIVE WEATHER",
  dash_weather_title:        "Current Weather",
  dash_fetching_weather:     "Fetching weather...",
  dash_market_tag:           "MARKET PRICE",
  dash_market_title:         "Today's Mandi Price",
  dash_fetching_market:      "Fetching price...",
  dash_no_price:             "No price data found for",
  dash_per_quintal:          "/ quintal",
  dash_trend_label:          "PRICE TREND (9 MONTHS)",
  dash_humidity:             "Humidity",
  dash_wind:                 "Wind",
  dash_feels:                "Feels Like",
  dash_rain:                 "Rainfall",
  dash_rain_alert:           "Rain expected — consider delaying harvest or irrigation.",
  dash_clear_alert:          "Clear skies — good day for farm work.",
  dash_land_tag:             "LAND USAGE",
  dash_land_title:           "Land Size per Profile",
  dash_soil_tag:             "SOIL BREAKDOWN",
  dash_soil_title:           "Soil Type Distribution",
  dash_profile_hist_tag:     "ALL RECORDS",
  dash_profile_hist_title:   "Profile History",
  dash_profiles_tag:         "FARMER PROFILES",
  dash_profiles_title:       "All Profiles",
  dash_analytics_land_tag:   "ANALYTICS",
  dash_analytics_land_title: "Land Usage Trend",
  dash_analytics_soil_tag:   "ANALYTICS",
  dash_analytics_soil_title: "Soil Type Analysis",
  dash_analytics_crop_tag:   "CROPS",
  dash_analytics_crop_title: "All Crops Grown",
  dash_no_data:              "No data available yet.",
  dash_no_crop:              "No crops added yet.",
  dash_no_profiles:          "No profiles yet.",
  dash_add_first:            "Add your first profile →",
  dash_locked:               "Please log in to view your dashboard.",
  dash_locked_sub:           "Sign up or log in to access your personalized farm dashboard.",
  dash_link:                 "Go to dashboard →",

  // ── Activity ──
  activity_title:           "Farm Activity Diary",
  activity_placeholder:     "What did you do on your farm today?",
  activity_speak_btn:       "Speak",
  activity_add_btn:         "Add",
  activity_clear_btn:       "Clear All",
  activity_confirm_clear:   "Clear all activity logs?",
  activity_diary_title:     "Activity Log",
  activity_empty:           "No activities logged yet. Add your first entry!",

  // ── Schemes Page ──
  schemes_eyebrow:          "GOVERNMENT SUPPORT",
  schemes_title:            "Agriculture Schemes & Programs",
  schemes_subtitle:         "Central and state government schemes to support Indian farmers.",
  schemes_video_title:      "Understanding Farmer Support Schemes",
  schemes_video_sub:        "Watch this short guide to learn which schemes you qualify for.",
  schemes_agri_head:        "Agriculture & Crop Schemes",
  schemes_agri_sub:         "Direct benefit transfers, insurance, and crop support programs.",
  schemes_welfare_head:     "Farmer Welfare & Legal",
  schemes_welfare_sub:      "Legal frameworks and dispute resolution for farmers.",
  schemes_col_scheme:       "Scheme",
  schemes_col_desc:         "Description",
  schemes_col_link:         "Link",
  schemes_visit:            "Visit →",
  schemes_na:               "N/A",

  scheme_agri_infra_name:       "Agriculture Infrastructure Fund",
  scheme_agri_infra_desc:       "Rs. 1 lakh crore fund for post-harvest infrastructure and community farming assets.",
  scheme_pm_kisan_name:         "PM-KISAN",
  scheme_pm_kisan_desc:         "₹6,000/year direct income support to farmer families in three installments.",
  scheme_atma_name:             "ATMA",
  scheme_atma_desc:             "Agricultural Technology Management Agency — farm extension and training.",
  scheme_agmarknet_name:        "Agmarknet",
  scheme_agmarknet_desc:        "Live mandi prices and commodity arrivals across India.",
  scheme_midh_name:             "MIDH",
  scheme_midh_desc:             "Mission for Integrated Development of Horticulture.",
  scheme_pesticide_name:        "Pesticide Management",
  scheme_pesticide_desc:        "Safe pesticide use guidelines and regulations.",
  scheme_plant_quarantine_name: "Plant Quarantine",
  scheme_plant_quarantine_desc: "Import/export certification and pest management system.",
  scheme_dbt_name:              "DBT Agriculture",
  scheme_dbt_desc:              "Direct Benefit Transfer portal for all agriculture subsidies.",
  scheme_pmksy_name:            "PMKSY",
  scheme_pmksy_desc:            "Pradhan Mantri Krishi Sinchayee Yojana — water to every field.",
  scheme_kisan_call_name:       "Kisan Call Centre",
  scheme_kisan_call_desc:       "Free helpline (1800-180-1551) for farmers to get expert advice.",
  scheme_mkisan_name:           "mKisan",
  scheme_mkisan_desc:           "SMS-based advisories on weather, pest, and market to farmers.",
  scheme_jaivik_name:           "Jaivik Kheti",
  scheme_jaivik_desc:           "Participatory Guarantee System for organic farming certification.",
  scheme_enam_name:             "eNAM",
  scheme_enam_desc:             "Electronic national agriculture marketplace for online trading.",
  scheme_soil_health_name:      "Soil Health Card",
  scheme_soil_health_desc:      "Free soil testing and crop-wise fertilizer recommendations.",
  scheme_pmfby_name:            "PMFBY",
  scheme_pmfby_desc:            "Pradhan Mantri Fasal Bima Yojana — crop insurance at low premium.",
  scheme_dispute_name:          "Dispute Resolution",
  scheme_dispute_desc:          "Legal mechanism for resolving farming-related disputes.",
  scheme_farming_agreement_name:"Farming Agreement Act",
  scheme_farming_agreement_desc:"Framework for contract farming agreements.",
  scheme_guidelines_name:       "Farming Guidelines",
  scheme_guidelines_desc:       "Standard guidelines for sustainable farming practices.",

  // ── Onboarding ──
  ob_tag:                  "FARMER PROFILE SETUP",
  ob_hero1:                "Tell Us About",
  ob_hero1em:              "Your Farm",
  ob_hero2:                "We'll personalise everything for you",
  ob_sub:                  "Set up your profile once and get advice tailored to your crop, soil, and location.",
  ob_step:                 "STEP 1 OF 1",
  ob_form_title:           "Your Farming",
  ob_form_title_em:        "Profile",
  ob_voice_label:          "VOICE LANGUAGE",
  ob_guide_btn:            "Voice Guide",
  ob_stop_btn:             "Stop",
  ob_save_btn:             "Save Profile",
  ob_saving_btn:           "Saving...",
  ob_secure_note:          "Your data is stored securely and never shared.",
  ob_saved_title:          "Profile Saved!",
  ob_saved_sub:            "Redirecting to your dashboard...",
  ob_field_name_guide:     "Please tell me your name",
  ob_field_name_placeholder: "e.g. Ravi Kumar",
  ob_field_location_guide: "What is your village or district?",
  ob_field_location_placeholder: "e.g. Wayanad, Kerala",
  ob_field_land_guide:     "How many acres of land do you farm?",
  ob_field_land_placeholder: "e.g. 2.5",
  ob_field_crop_guide:     "What is your primary crop?",
  ob_field_crop_placeholder: "e.g. Rice, Wheat, Coconut",
  ob_field_soil_guide:     "What type of soil do you have?",
  ob_field_soil_placeholder: "e.g. Clay, Sandy, Loam",
  ob_field_irrigation_guide: "How do you irrigate your farm?",
  ob_field_irrigation_placeholder: "e.g. Drip, Flood, Rain-fed",

  // ── Login ──
  login_title:    "Welcome Back",
  login_sub:      "Sign in to your Krishi Sakhi account.",
  login_email:    "Email",
  login_password: "Password",
  login_btn:      "Login",
  login_loading:  "Logging in...",

  // ── Signup ──
  signup_title:         "Create Account",
  signup_sub:           "Join thousands of smart farmers.",
  signup_name:          "Full Name",
  signup_email:         "Email",
  signup_password:      "Password",
  signup_confirm:       "Confirm Password",
  signup_btn:           "Create Account",
  signup_loading:       "Creating account...",
  signup_success_title: "Account Created!",

  // ── Footer ──
  footer_terms:         "Terms & Conditions",
  footer_disclaimer:    "Disclaimer",
  footer_links:         "Related Links",
  footer_policy:        "Website Policy",
  footer_help:          "Help",
  footer_accessibility: "Accessibility Statement",
  footer_privacy:       "Privacy Policy",
  footer_desc:          "AI-Powered Farming Assistant – Real-time crop insights, voice support & market guidance for every farmer.",
  footer_dev:           "Designed & developed by SIH Team 2025",
  footer_support:       "Supported by Dept. of Agriculture Development & Farmers' Welfare",
  footer_copyright:     "© 2025 Krishi Sakhi | All Rights Reserved",

  // ── Common ──
  loading:       "Loading...",
  error_generic: "Something went wrong. Please try again.",

  // ── Home Page ──
  home_problem_tag:        "The Problem We're Solving",
  home_problem_h:          "India has 140 million farming households. Most have no access to timely expert advice.",
  home_problem_p:          "Agronomists are expensive and hard to reach. Government helplines are slow. Information about schemes, subsidies, and weather often never reaches the farmer who needs it most. Krishi Sakhi exists to close that gap — in your language, on your phone, at no cost.",
  home_problem_source:     "Sources: PLFS 2022-23 · NABARD NAFIS · Ministry of Agriculture & Farmers Welfare · 8th Schedule, Constitution of India",
  home_hiw_eye:            "How It Works",
  home_hiw_h:              "Simple as",
  home_hiw_h_em:           "Speaking",
  home_hiw_sub:            "No app to download. No forms to fill. Just speak or type in whatever language feels natural — Krishi Sakhi handles everything else.",
  home_step1_title:        "Choose Your Language",
  home_step1_desc:         "Pick from 22 scheduled Indian languages — Malayalam, Hindi, Tamil, Odia, Kannada, Punjabi and more. Switch anytime.",
  home_step2_title:        "Tell Us About Your Farm",
  home_step2_desc:         "Your crop, soil type, district. Takes under 2 minutes. We use this to give you relevant, locally appropriate advice.",
  home_step3_title:        "Ask by Voice or Text",
  home_step3_desc:         "Hold the mic and speak naturally. Krishi Sakhi understands regional accents and responds the same way.",
  home_step4_title:        "Get Instant Guidance",
  home_step4_desc:         "Pest diagnosis, mandi prices, scheme eligibility, weather alerts — answered in plain, simple language.",
  home_farm_tag:           "Empowering Indian Agriculture",
  home_farm_title1:        "From Seed to Market —",
  home_farm_title2:        "We're With You",
  home_feat_h:             "Everything a Farmer",
  home_feat_h_em:          "Needs",
  home_feat_sub:           "Crop disease help, scheme information, live mandi prices, weather forecasts — one place, no switching between apps or offices.",
  home_why_eye:            "Why Krishi Sakhi",
  home_why_h:              "Built",
  home_why_h_em:           "Differently",
  home_why_sub:            "Most agri-tech is built for literate, urban, smartphone-savvy users. We built this for everyone else.",
  home_why_1_title:        "Voice-first, not just voice-enabled",
  home_why_1_desc:         "Most farmers don't type. Krishi Sakhi is designed around speaking — in any dialect, with any accent. You don't need to spell correctly or type in English.",
  home_why_2_title:        "22 languages, not just Hindi",
  home_why_2_desc:         "A farmer in Wayanad shouldn't have to ask questions in a language that isn't theirs. We support all 22 languages listed in the 8th Schedule of the Constitution.",
  home_why_3_title:        "Works on low-end phones",
  home_why_3_desc:         "Designed to load fast on 2G and older Android devices. No bloated app, no unnecessary permissions. Your data stays with you.",
  home_why_4_title:        "Schemes actually explained",
  home_why_4_desc:         "PM-KISAN, PMFBY, Soil Health Card — we don't just list them. We tell you if you're eligible, what documents you need, and how to apply step by step.",
  home_split_tag1:         "Voice First",
  home_split_title1:       "Speak in your language — get answers instantly",
  home_split_tag2:         "Smart Farming",
  home_split_title2:       "AI-powered crop advice for every season",
  home_cta_h1:             "Your Farm. Your Language.",
  home_cta_h2:             "Your Sakhi.",
  home_cta_sub:            "Free to use. No registration needed to explore. Available in 22 languages. Krishi Sakhi is here whenever you need it — day or night.",
  home_cta_btn2:           "Explore Schemes",
  home_learn_more:         "Learn More",
  home_fact_1_lbl:         "of India's workforce is in agriculture (PLFS 2022-23)",
  home_fact_2_lbl:         "of farmers are small or marginal landholders (NABARD)",
  home_fact_3_lbl:         "scheduled Indian languages we support",
  home_fact_4_lbl:         "PM-KISAN annual benefit many farmers still miss out on",

  // ── SchemeFeed UI keys (NEW) ──────────────────────────────────────────────
  feed_live_label:         "LIVE FEED",
  feed_section_title:      "Government Agriculture Schemes",
  feed_tab_schemes:        "📋 Key Schemes",
  feed_tab_news:           "📰 Live News",
  feed_refresh:            "⟳ Refresh",
  feed_loading:            "⟳ Loading...",
  feed_read_more:          "Read more →",
  feed_official_badge:     "✅ Official Scheme",
  feed_no_news:            "No live news right now. Try refreshing.",
  feed_no_schemes:         "No schemes available.",
  feed_notif_all_read:     "All caught up ✓",
  feed_mark_read:          "Mark all read",
  feed_new_updates:        "new update",
  feed_new_updates_plural: "new updates",

  // ── WeatherCornerWidget UI keys (NEW) ────────────────────────────────────
  wcw_title:               "Weather",
  wcw_feels:               "Feels",
  wcw_humidity:            "Humidity",
  wcw_wind:                "Wind",
  wcw_locating:            "Locating...",
  wcw_denied:              "Location access denied",
  wcw_error:               "Weather unavailable",
  wcw_rain_alert:          "Rain expected — avoid spraying crops",
  wcw_clear_alert:         "Clear skies — good day for field work",

  // ── Home stats (used in some stat bars) ──
  home_stat_lang_l:        "Languages",
  home_stat_schemes_l:     "Schemes",
  home_stat_support_l:     "AI Support",
  home_stat_cost_l:        "Always Free",
};

export async function translateText(text, targetLang) {
  if (!text || !text.trim() || targetLang === "en") return text;
  const langName = LANG_NAME_MAP[targetLang];
  if (!langName) return text;
  try {
    const res = await fetch(`${BASE_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: langName, data: { text } }),
    });
    if (!res.ok) return text;
    const result = await res.json();
    return result.text || result.translatedText || text;
  } catch {
    return text;
  }
}

export async function fetchTranslations(targetLang) {
  if (!targetLang || targetLang === "en") return BASE_TRANSLATIONS;

  const cacheKey = `ks_translations_${targetLang}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {}

  const langName = LANG_NAME_MAP[targetLang];
  if (!langName) return BASE_TRANSLATIONS;

  try {
    const res = await fetch(`${BASE_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: langName, data: BASE_TRANSLATIONS }),
    });
    if (!res.ok) return BASE_TRANSLATIONS;
    const translated = await res.json();
    localStorage.setItem(cacheKey, JSON.stringify(translated));
    return translated;
  } catch {
    return BASE_TRANSLATIONS;
  }
}

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("ks_lang") || null
  );
  const [langSelected, setLangSelected] = useState(
    () => !!localStorage.getItem("ks_lang")
  );
  const [translations, setTranslations] = useState(BASE_TRANSLATIONS);
  const [isTranslating, setIsTranslating]   = useState(false);
  const [translateError, setTranslateError] = useState(false);

  const loadTranslations = useCallback(async (code) => {
    if (!code) return;
    if (code === "en") {
      setTranslations(BASE_TRANSLATIONS);
      return;
    }
    setIsTranslating(true);
    setTranslateError(false);
    try {
      const translated = await fetchTranslations(code);
      setTranslations(translated);
    } catch {
      setTranslateError(true);
      setTranslations(BASE_TRANSLATIONS);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  useEffect(() => {
    if (lang) loadTranslations(lang);
  }, [lang, loadTranslations]);

  const selectLanguage = useCallback((code) => {
    if (!code) return;
    localStorage.removeItem(`ks_translations_${code}`);
    localStorage.setItem("ks_lang", code);
    setLang(code);
    setLangSelected(true);
  }, []);

  const t = useCallback(
    (key) => translations[key] ?? BASE_TRANSLATIONS[key] ?? key,
    [translations]
  );

  return (
    <LanguageContext.Provider value={{
      lang,
      langSelected,
      selectLanguage,
      t,
      isTranslating,
      translateError,
      SUPPORTED_LANGUAGES,
      translateText,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useTranslateInput(initial = "", skip = false) {
  const { lang } = useLanguage();
  const [value, setValue] = useState(initial);
  const [translating, setTranslating] = useState(false);
  const debounceRef  = useRef(null);
  const latestLang   = useRef(lang);

  useEffect(() => { latestLang.current = lang; }, [lang]);
  useEffect(() => { setValue(initial); }, [initial]);

  const onChange = useCallback((e) => {
    const raw = typeof e === "string" ? e : e.target.value;
    setValue(raw);
    if (skip || !raw.trim() || latestLang.current === "en") return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setTranslating(true);
      try {
        const translated = await translateText(raw, latestLang.current);
        if (translated && translated !== raw) setValue(translated);
      } finally {
        setTranslating(false);
      }
    }, 700);
  }, [skip]);

  const setValueDirect = useCallback((v) => {
    clearTimeout(debounceRef.current);
    setValue(v);
  }, []);

  return { value, onChange, isTranslating: translating, setValue: setValueDirect };
}
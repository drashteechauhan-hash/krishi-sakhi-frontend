const PREFIX = "ks_trans_v2_";

export const translationCache = {
  get(code) {
    try {
      const raw = localStorage.getItem(PREFIX + code);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  set(code, data) {
    try {
      localStorage.setItem(PREFIX + code, JSON.stringify(data));
    } catch (e) {
      console.warn("Cache write failed:", e);
    }
  },
  clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith("ks_trans_"))
      .forEach(k => localStorage.removeItem(k));
  },
};
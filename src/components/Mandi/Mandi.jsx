import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://soil-prediction-api-1.onrender.com";
const JAVA_API = "https://krishi-sakhi-backend-6.onrender.com";

const CROP_ICONS = {
  tomato: "🍅", tamatar: "🍅",
  wheat: "🌾", gehu: "🌾", gehun: "🌾",
  rice: "🍚", chawal: "🍚",
  onion: "🧅", pyaz: "🧅",
  potato: "🥔", aloo: "🥔",
  corn: "🌽", makai: "🌽",
  mango: "🥭", aam: "🥭",
  default: "🌿",
};

function getCropIcon(name = "") {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(CROP_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return CROP_ICONS.default;
}

function ListingCard({ listing }) {
  const [showPhone, setShowPhone] = useState(false);
  const [buyerPhone, setBuyerPhone] = useState("");
  const [revealing, setRevealing] = useState(false);

  const handleReveal = async () => {
    if (!buyerPhone || buyerPhone.length < 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    setRevealing(true);
    try {
      await axios.post(`${JAVA_API}/api/mandi/listings/${listing.id}/view`);
      setShowPhone(true);
    } catch (e) {
      setShowPhone(true);
    } finally {
      setRevealing(false);
    }
  };

  const icon = getCropIcon(listing.cropName);
  const hasDisease = listing.aiDisease && listing.aiDisease !== "none";

  return (
    <div className="mc-card">
      <div className="mc-card-img">
        {listing.photoUrl ? (
          <img src={listing.photoUrl} alt={listing.cropName} />
        ) : (
          <div className="mc-card-emoji">{icon}</div>
        )}
        <div className="mc-card-badges">
          {listing.aiVerified && (
            <span className="mc-badge mc-badge-verified">✓ AI Verified</span>
          )}
          {hasDisease && (
            <span className="mc-badge mc-badge-warn">⚠ {listing.aiDisease}</span>
          )}
        </div>
      </div>

      <div className="mc-card-body">
        <div className="mc-card-tag">{listing.location || "India"}</div>
        <div className="mc-card-name">{listing.cropName}</div>
        <div className="mc-card-price">
          ₹{listing.price}
          <span className="mc-card-unit">/{listing.unit || "kg"}</span>
        </div>
        {listing.quantity && (
          <div className="mc-card-qty">
            {listing.quantity} {listing.unit || "kg"} available
          </div>
        )}
        {listing.aiAdvice && (
          <div className="mc-card-advice">💡 {listing.aiAdvice}</div>
        )}
      </div>

      <div className="mc-card-footer">
        <span className="mc-cod-tag">💵 COD</span>
        {!showPhone ? (
          <div className="mc-reveal-wrap">
            {revealing ? (
              <span className="mc-revealing">Revealing…</span>
            ) : (
              <>
                <input
                  className="mc-phone-input"
                  placeholder="Your phone to see contact"
                  value={buyerPhone}
                  onChange={e => setBuyerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength={10}
                />
                <button className="mc-reveal-btn" onClick={handleReveal}>
                  See Contact →
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="mc-phone-shown">
            <span className="mc-phone-label">📞 Farmer</span>
            <a href={`tel:${listing.phone}`} className="mc-phone-num">
              {listing.phone}
            </a>
            
              href={`https://wa.me/91${listing.phone}`}
              target="_blank"
              rel="noreferrer"
              className="mc-wa-btn"
            >
              WhatsApp ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Mandi() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async (crop = "") => {
    setLoading(true);
    try {
      const url = crop
        ? `${JAVA_API}/api/mandi/listings?crop=${encodeURIComponent(crop)}`
        : `${JAVA_API}/api/mandi/listings`;
      const res = await axios.get(url);
      setListings(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(search);
  };

  const filters = ["all", "vegetables", "grains", "seeds", "equipment"];

  const filtered = filter === "all"
    ? listings
    : listings.filter(l =>
        l.cropName?.toLowerCase().includes(filter.toLowerCase())
      );

  const isLoggedIn = !!localStorage.getItem("loggedInUser");

  return (
    <>
      <style>{CSS}</style>
      <div className="mc-wrap">

        <div className="mc-hero">
          <div className="mc-hero-bg" />
          <div className="mc-hero-content">
            <div className="mc-hero-tag">🌾 KRISHI MANDI</div>
            <h1 className="mc-hero-title">
              Farm Fresh,<br /><em>Direct to You</em>
            </h1>
            <p className="mc-hero-sub">
              Buy directly from verified farmers. No middlemen. Cash on delivery.
            </p>
            <div className="mc-hero-btns">
              <form className="mc-search-form" onSubmit={handleSearch}>
                <input
                  className="mc-search-input"
                  placeholder="Search crop — tomato, wheat, onion…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button className="mc-search-btn" type="submit">Search</button>
              </form>
              {isLoggedIn && (
                <button
                  className="mc-sell-btn"
                  onClick={() => navigate("/mandi/sell")}
                >
                  + List your crop
                </button>
              )}
            </div>
          </div>

          <div className="mc-trust-bar">
            {["✓ AI Verified photos", "✓ Cash on delivery", "✓ Direct farmer contact", "✓ Free listings"].map(t => (
              <span key={t} className="mc-trust-item">{t}</span>
            ))}
          </div>
        </div>

        <div className="mc-body">
          <div className="mc-filters">
            {filters.map(f => (
              <button
                key={f}
                className={`mc-filter-chip ${filter === f ? "on" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <button
              className="mc-filter-chip mc-refresh"
              onClick={() => { setSearch(""); fetchListings(""); }}
            >
              ↺ All
            </button>
          </div>

          {loading ? (
            <div className="mc-loading">
              <div className="mc-spinner" />
              <span>Loading fresh listings…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mc-empty">
              <div style={{ fontSize: "3rem" }}>🌱</div>
              <div>No listings yet.</div>
              {isLoggedIn && (
                <button
                  className="mc-sell-btn"
                  onClick={() => navigate("/mandi/sell")}
                >
                  Be the first to sell →
                </button>
              )}
              {!isLoggedIn && (
                <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                  Login to list your crops for sale.
                </div>
              )}
            </div>
          ) : (
            <div className="mc-grid">
              {filtered.map(l => (
                <ListingCard key={l.id} listing={l} />
              ))}
              {isLoggedIn && (
                <div
                  className="mc-card mc-sell-card"
                  onClick={() => navigate("/mandi/sell")}
                >
                  <div className="mc-sell-card-inner">
                    <div style={{ fontSize: "2.5rem" }}>➕</div>
                    <div className="mc-sell-card-title">List your crop free</div>
                    <div className="mc-sell-card-sub">Reach buyers near you. No fees.</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#040c06;--surf:#081309;--green:#1a4025;--sage:#2e6b3e;
  --leaf:#4caf65;--mint:#7dd99a;--gold:#c47f1a;--amber:#e8a832;
  --cream:#f0e8d5;--warm:#d4c4a0;--muted:rgba(240,232,213,0.4);
  --border:rgba(196,127,26,0.18);--r:14px;--r-sm:9px;
}
.mc-wrap{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh;color:var(--cream);}
.mc-hero{position:relative;padding:80px 24px 0;overflow:hidden;}
.mc-hero-bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 70% 60% at 50% 0%,rgba(76,175,101,0.15) 0%,transparent 65%),linear-gradient(160deg,#040c06,#081309);}
.mc-hero-content{position:relative;z-index:2;max-width:900px;margin:0 auto;text-align:center;padding-bottom:48px;}
.mc-hero-tag{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:3px;color:var(--mint);margin-bottom:16px;}
.mc-hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2.8rem,6vw,5rem);font-weight:700;line-height:1.05;color:var(--cream);margin-bottom:16px;}
.mc-hero-title em{font-style:italic;color:var(--leaf);}
.mc-hero-sub{color:var(--muted);font-size:15px;margin-bottom:32px;line-height:1.7;}
.mc-hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;align-items:center;}
.mc-search-form{display:flex;gap:0;border-radius:12px;overflow:hidden;border:1px solid var(--border);background:rgba(255,255,255,0.04);}
.mc-search-input{padding:12px 18px;background:transparent;border:none;outline:none;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:13px;width:280px;}
.mc-search-input::placeholder{color:var(--muted);}
.mc-search-btn{padding:12px 20px;background:var(--sage);color:#fff;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;transition:background 0.2s;}
.mc-search-btn:hover{background:var(--leaf);}
.mc-sell-btn{padding:12px 24px;background:linear-gradient(135deg,var(--gold),var(--amber));color:#040c06;border:none;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.22s;box-shadow:0 4px 20px rgba(196,127,26,0.3);}
.mc-sell-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(196,127,26,0.45);}
.mc-trust-bar{display:flex;justify-content:center;flex-wrap:wrap;gap:0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:rgba(255,255,255,0.02);margin-top:0;}
.mc-trust-item{padding:10px 20px;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1px;color:var(--mint);border-right:1px solid var(--border);}
.mc-trust-item:last-child{border-right:none;}
.mc-body{max-width:1300px;margin:0 auto;padding:32px 24px 64px;}
.mc-filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px;}
.mc-filter-chip{padding:7px 18px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.18s;}
.mc-filter-chip.on{background:rgba(76,175,101,0.15);border-color:rgba(76,175,101,0.4);color:var(--mint);}
.mc-filter-chip:hover:not(.on){color:var(--warm);border-color:rgba(240,232,213,0.2);}
.mc-refresh{color:var(--amber);border-color:rgba(196,127,26,0.3);}
.mc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px;}
.mc-card{background:rgba(255,255,255,0.025);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;transition:transform 0.22s,box-shadow 0.22s;animation:fadeUp 0.4s ease both;}
.mc-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.4);}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.mc-card-img{height:140px;background:linear-gradient(135deg,rgba(26,64,37,0.4),rgba(8,19,9,0.8));position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.mc-card-img img{width:100%;height:100%;object-fit:cover;}
.mc-card-emoji{font-size:4rem;}
.mc-card-badges{position:absolute;top:8px;left:8px;display:flex;flex-direction:column;gap:4px;}
.mc-badge{font-size:9px;font-family:'Space Mono',monospace;padding:3px 8px;border-radius:6px;font-weight:700;letter-spacing:0.5px;}
.mc-badge-verified{background:rgba(76,175,101,0.85);color:#040c06;}
.mc-badge-warn{background:rgba(232,168,50,0.85);color:#040c06;}
.mc-card-body{padding:14px 16px;}
.mc-card-tag{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1.5px;color:var(--amber);margin-bottom:5px;text-transform:uppercase;}
.mc-card-name{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:var(--cream);margin-bottom:6px;}
.mc-card-price{font-size:1.5rem;font-weight:700;color:var(--leaf);font-family:'Cormorant Garamond',serif;line-height:1;}
.mc-card-unit{font-size:13px;color:var(--muted);font-family:'DM Sans',sans-serif;}
.mc-card-qty{font-size:11px;color:var(--muted);margin-top:4px;}
.mc-card-advice{font-size:10px;color:var(--warm);background:rgba(196,127,26,0.08);border:1px solid rgba(196,127,26,0.15);border-radius:6px;padding:6px 8px;margin-top:8px;line-height:1.5;}
.mc-card-footer{border-top:1px solid rgba(255,255,255,0.04);padding:12px 16px;}
.mc-cod-tag{font-size:9px;font-family:'Space Mono',monospace;background:rgba(76,175,101,0.1);border:1px solid rgba(76,175,101,0.2);color:var(--mint);padding:3px 8px;border-radius:5px;display:inline-block;margin-bottom:8px;}
.mc-reveal-wrap{display:flex;gap:6px;align-items:center;flex-wrap:wrap;}
.mc-phone-input{flex:1;min-width:130px;padding:7px 10px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:7px;color:var(--cream);font-size:11px;font-family:'DM Sans',sans-serif;outline:none;}
.mc-phone-input::placeholder{color:var(--muted);font-size:10px;}
.mc-reveal-btn{padding:7px 12px;background:var(--sage);color:#fff;border:none;border-radius:7px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background 0.2s;}
.mc-reveal-btn:hover{background:var(--leaf);}
.mc-revealing{font-size:11px;color:var(--muted);font-family:'Space Mono',monospace;}
.mc-phone-shown{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.mc-phone-label{font-size:10px;color:var(--muted);}
.mc-phone-num{font-size:14px;font-weight:700;color:var(--leaf);text-decoration:none;}
.mc-wa-btn{padding:5px 10px;background:rgba(37,211,102,0.15);border:1px solid rgba(37,211,102,0.3);color:#25d366;border-radius:6px;font-size:10px;font-weight:600;text-decoration:none;white-space:nowrap;}
.mc-sell-card{cursor:pointer;border:1.5px dashed rgba(76,175,101,0.35);background:rgba(26,64,37,0.1);}
.mc-sell-card:hover{border-color:var(--leaf);background:rgba(26,64,37,0.2);}
.mc-sell-card-inner{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:48px 24px;text-align:center;}
.mc-sell-card-title{font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:var(--leaf);}
.mc-sell-card-sub{font-size:11px;color:var(--muted);}
.mc-loading{display:flex;flex-direction:column;align-items:center;gap:14px;padding:80px 0;color:var(--muted);font-family:'Space Mono',monospace;font-size:12px;}
.mc-spinner{width:32px;height:32px;border:2px solid rgba(76,175,101,0.2);border-top-color:var(--leaf);border-radius:50%;animation:spin 0.8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.mc-empty{display:flex;flex-direction:column;align-items:center;gap:14px;padding:80px 0;color:var(--muted);font-size:14px;text-align:center;}
`;
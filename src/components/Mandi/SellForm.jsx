import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://soil-prediction-api-1.onrender.com";
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const UNITS = ["kg", "quintal", "piece", "dozen", "litre", "pack", "bundle"];

export default function SellForm() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const [form, setForm] = useState({
    cropName: "",
    price: "",
    unit: "kg",
    quantity: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const userEmail = localStorage.getItem("loggedInUser") || "";

  // ── Photo select → AI check ──
  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(file);
    setAiResult(null);
    setAiError(null);

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);

    // AI check
    setAiLoading(true);
    try {
      const b64Reader = new FileReader();
      b64Reader.onload = async (ev) => {
        const base64 = ev.target.result.split(",")[1];
        try {
          const res = await axios.post(`${API}/detect-crop`, {

            image_base64: base64,
          });
          const result = res.data;
          setAiResult(result);

          // Auto-fill crop name only if AI actually verified it as a crop
          if (result.is_crop && result.crop_type && result.crop_type !== "unknown") {
            setForm((f) => ({
              ...f,
              cropName: f.cropName || result.crop_type,
            }));
          }
        } catch (err) {
          // ✅ NO mock verified — never auto-approve on error
          setAiError("Photo verify nahi ho saki. Dobara try karein.");
          setAiResult(null);
        }
        setAiLoading(false);
      };
      b64Reader.readAsDataURL(file);
    } catch (err) {
      setAiError("Could not analyze photo. Please retake.");
      setAiLoading(false);
    }
  };

  // ── Upload photo to Supabase Storage ──
  const uploadPhoto = async (file) => {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const res = await fetch(
        `${SUPABASE_URL}/storage/v1/object/crop-photos/${fileName}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": file.type,
          },
          body: file,
        }
      );
      if (res.ok) {
        return `${SUPABASE_URL}/storage/v1/object/public/crop-photos/${fileName}`;
      }
      return null;
    } catch {
      return null;
    }
  };

  // ── Submit listing ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert("Please upload a photo of your crop");
      return;
    }

    // ✅ STRICT AI check — screenshot/non-crop images blocked
    if (!aiResult || !aiResult.is_real_photo || !aiResult.is_crop) {
      alert(
        "Kripya apni fasal ki asli photo upload karein.\nScreenshot ya koi aur cheez allowed nahi hai."
      );
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload photo
      const photoUrl = await uploadPhoto(photo);

      // 2. Save listing
      const payload = {
        userEmail,
        farmerName: userEmail.split("@")[0],
        phone: form.phone,
        location: localStorage.getItem("farmerLocation") || "",
        cropName: form.cropName,
        price: parseFloat(form.price),
        unit: form.unit,
        quantity: parseFloat(form.quantity) || null,
        photoUrl,
        aiVerified: aiResult?.is_real_photo && aiResult?.is_crop,
        aiCropType: aiResult?.crop_type || null,
        aiHealth: aiResult?.health_status || null,
        aiDisease:
          aiResult?.disease_detected === "none"
            ? null
            : aiResult?.disease_detected,
        aiAdvice: aiResult?.farmer_advice || null,
        status: "active",
      };

      await axios.post(`${API}/mandi/listings`, payload);

      setDone(true);
      setTimeout(() => navigate("/mandi"), 2000);
    } catch (err) {
      console.error(err);
      alert("Error saving listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // AI result UI flags
  const aiOk =
    aiResult?.is_real_photo && aiResult?.is_crop;
  const aiWarn =
    aiResult?.is_real_photo &&
    aiResult?.is_crop &&
    aiResult?.health_status === "diseased";
  const aiFail =
    aiResult && (!aiResult.is_real_photo || !aiResult.is_crop);

  if (done) {
    return (
      <>
        <style>{CSS}</style>
        <div className="sf-wrap">
          <div className="sf-success">
            <div className="sf-success-ic">✓</div>
            <h2 className="sf-success-t">Listing Published!</h2>
            <p className="sf-success-s">
              Buyers in your area can now see your crop.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="sf-wrap">
        <div className="sf-inner">

          {/* Header */}
          <div className="sf-header">
            <button className="sf-back" onClick={() => navigate("/mandi")}>
              ← Back
            </button>
            <div className="sf-eyebrow">SELL YOUR CROP</div>
            <h1 className="sf-title">
              List your <em>produce</em>
            </h1>
            <p className="sf-sub">
              AI verifies your photo, then buyers can contact you directly.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── STEP 1: PHOTO ── */}
            <div className="sf-step">
              <div className="sf-step-label">
                <span className="sf-step-num">1</span>
                Photo of your crop
              </div>

              <div
                className={`sf-upload ${photoPreview ? "has-photo" : ""}`}
                onClick={() => fileRef.current?.click()}
              >
                {!photoPreview ? (
                  <div className="sf-upload-placeholder">
                    <div className="sf-upload-icon">📷</div>
                    <div className="sf-upload-text">
                      Click to take or upload photo
                    </div>
                    <div className="sf-upload-sub">
                      AI will verify your crop instantly
                    </div>
                  </div>
                ) : (
                  <img
                    src={photoPreview}
                    alt="crop preview"
                    className="sf-preview-img"
                  />
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={handlePhoto}
                />
              </div>

              {/* AI Loading */}
              {aiLoading && (
                <div className="sf-ai-loading">
                  <div className="sf-spinner" />
                  <span>AI analyzing your photo…</span>
                </div>
              )}
{aiResult && !aiLoading && (
  <div className={`sf-ai-result ${aiFail ? "fail" : aiWarn ? "warn" : "ok"}`}>
    <div className="sf-ai-result-title">
      {aiFail ? "✗ Photo issue detected"
        : aiWarn ? "⚠ Disease detected"
        : "✓ Photo verified by AI"}
    </div>

    <div className="sf-ai-pills">
      <span className={`sf-ai-pill ${aiResult.is_real_photo ? "g" : "r"}`}>
        {aiResult.is_real_photo ? "Real photo ✓" : "Not real ✗"}
      </span>
      <span className={`sf-ai-pill ${aiResult.is_real_camera_photo ? "g" : "r"}`}>
        {aiResult.is_real_camera_photo ? "Camera photo ✓" : "Downloaded image ✗"}
      </span>
      <span className={`sf-ai-pill ${aiResult.is_crop ? "g" : "r"}`}>
        {aiResult.is_crop
          ? `${aiResult.crop_type_hindi || aiResult.crop_type} detected ✓`
          : "No crop found ✗"}
      </span>
      <span className={`sf-ai-pill ${aiResult.health_status === "healthy" ? "g" : "a"}`}>
        {aiResult.health_status === "healthy" ? "Healthy ✓"
          : aiResult.health_status === "diseased"
          ? `Disease: ${aiResult.disease_detected} (${aiResult.disease_severity})`
          : "Status unknown"}
      </span>
      {aiResult.quality_grade && aiResult.quality_grade !== "rejected" && (
        <span className={`sf-ai-pill ${
          aiResult.quality_grade === "A" ? "g"
          : aiResult.quality_grade === "B" ? "g"
          : "a"
        }`}>
          Grade {aiResult.quality_grade} ✓
        </span>
      )}
    </div>

    {/* Disease warning */}
    {aiResult.disease_detected && aiResult.disease_detected !== "none" && (
      <div className="sf-ai-disease-box">
        ⚠️ <strong>{aiResult.disease_detected}</strong> detected
        {aiResult.disease_severity && ` — ${aiResult.disease_severity} severity`}
        {aiResult.defects_visible?.length > 0 && (
          <div style={{marginTop: 4, fontSize: 10}}>
            Issues: {aiResult.defects_visible.join(", ")}
          </div>
        )}
      </div>
    )}

    {/* Price estimate */}
    {aiResult.estimated_price_range && aiResult.is_crop && (
      <div className="sf-ai-price">
        📊 Estimated market price: <strong>{aiResult.estimated_price_range}</strong>
      </div>
    )}

    {aiResult.farmer_advice && (
      <div className="sf-ai-advice">💡 {aiResult.farmer_advice}</div>
    )}

    {aiFail && (
      <button type="button" className="sf-retry-btn" onClick={() => {
        setPhoto(null); setPhotoPreview(null);
        setAiResult(null); setAiError(null);
      }}>
        Retake photo →
      </button>
    )}
  </div>
)}
              {/* AI Error — no mock, just show error + retry */}
              {aiError && !aiResult && (
                <div className="sf-ai-result fail">
                  <div className="sf-ai-result-title">✗ Verification failed</div>
                  <div className="sf-ai-advice">{aiError}</div>
                  <button
                    type="button"
                    className="sf-retry-btn"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                      setAiResult(null);
                      setAiError(null);
                    }}
                  >
                    Retake photo →
                  </button>
                </div>
              )}
            </div>

            {/* ── STEP 2: DETAILS ── only if photo verified (ok or warned) */}
            {(aiOk || aiWarn) && (
              <div className="sf-step">
                <div className="sf-step-label">
                  <span className="sf-step-num">2</span>
                  Crop details
                </div>

                <div className="sf-field">
                  <label className="sf-label">Crop name *</label>
                  <input
                    className="sf-input"
                    placeholder="e.g. Fresh Tomatoes, Basmati Wheat…"
                    value={form.cropName}
                    onChange={(e) =>
                      setForm({ ...form, cropName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="sf-row">
                  <div className="sf-field">
                    <label className="sf-label">Price *</label>
                    <div className="sf-input-prefix-wrap">
                      <span className="sf-prefix">₹</span>
                      <input
                        className="sf-input sf-input-prefixed"
                        type="number"
                        placeholder="0"
                        min="0"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="sf-field">
                    <label className="sf-label">Unit *</label>
                    <select
                      className="sf-input"
                      value={form.unit}
                      onChange={(e) =>
                        setForm({ ...form, unit: e.target.value })
                      }
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sf-field">
                    <label className="sf-label">Quantity available</label>
                    <input
                      className="sf-input"
                      type="number"
                      placeholder="e.g. 100"
                      min="0"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm({ ...form, quantity: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: CONTACT ── only if photo verified */}
            {(aiOk || aiWarn) && (
              <div className="sf-step">
                <div className="sf-step-label">
                  <span className="sf-step-num">3</span>
                  Your contact number
                </div>
                <div className="sf-field">
                  <label className="sf-label">
                    Phone number * (buyers will call/WhatsApp you)
                  </label>
                  <input
                    className="sf-input"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                    maxLength={10}
                    required
                  />
                </div>

                <div className="sf-cod-note">
                  💵 Payment is cash on delivery or direct — Krishi Sakhi does
                  not handle money. We just connect you with buyers!
                </div>

                <button
                  className="sf-submit-btn"
                  type="submit"
                  disabled={
                    submitting || !form.cropName || !form.price || !form.phone
                  }
                >
                  {submitting ? "⏳ Publishing…" : "✓ Publish listing free →"}
                </button>
              </div>
            )}
          </form>
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
  --border:rgba(196,127,26,0.18);--r:14px;
}
.sf-wrap{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh;color:var(--cream);padding:40px 24px 80px;}
.sf-inner{max-width:640px;margin:0 auto;}

.sf-back{background:none;border:none;color:var(--muted);cursor:pointer;font-size:13px;font-family:'DM Sans',sans-serif;margin-bottom:28px;display:block;transition:color 0.2s;}
.sf-back:hover{color:var(--cream);}
.sf-eyebrow{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:3px;color:var(--amber);margin-bottom:10px;}
.sf-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2.2rem,5vw,3.2rem);font-weight:700;color:var(--cream);margin-bottom:10px;line-height:1.1;}
.sf-title em{font-style:italic;color:var(--leaf);}
.sf-sub{color:var(--muted);font-size:14px;margin-bottom:40px;line-height:1.7;}

.sf-step{background:rgba(255,255,255,0.025);border:1px solid var(--border);border-radius:var(--r);padding:24px;margin-bottom:16px;}
.sf-step-label{display:flex;align-items:center;gap:12px;font-size:14px;font-weight:600;color:var(--warm);margin-bottom:20px;}
.sf-step-num{width:26px;height:26px;border-radius:50%;background:rgba(76,175,101,0.2);border:1px solid rgba(76,175,101,0.4);display:flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;font-size:10px;color:var(--mint);flex-shrink:0;}

/* Upload */
.sf-upload{border:2px dashed rgba(76,175,101,0.3);border-radius:var(--r);min-height:180px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.22s;overflow:hidden;background:rgba(26,64,37,0.1);}
.sf-upload:hover{border-color:var(--leaf);background:rgba(26,64,37,0.2);}
.sf-upload.has-photo{border-style:solid;border-color:rgba(76,175,101,0.5);}
.sf-upload-placeholder{text-align:center;padding:32px;}
.sf-upload-icon{font-size:3rem;margin-bottom:10px;}
.sf-upload-text{font-size:14px;font-weight:600;color:var(--leaf);margin-bottom:4px;}
.sf-upload-sub{font-size:11px;color:var(--muted);}
.sf-preview-img{width:100%;max-height:280px;object-fit:cover;}

/* AI loading */
.sf-ai-loading{display:flex;align-items:center;gap:12px;padding:14px 0;color:var(--muted);font-family:'Space Mono',monospace;font-size:11px;}
.sf-spinner{width:18px;height:18px;border:2px solid rgba(76,175,101,0.2);border-top-color:var(--leaf);border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0;}
@keyframes spin{to{transform:rotate(360deg)}}

/* AI Result */
.sf-ai-result{border-radius:10px;padding:14px 16px;margin-top:12px;}
.sf-ai-result.ok{background:rgba(76,175,101,0.08);border:1px solid rgba(76,175,101,0.25);}
.sf-ai-result.warn{background:rgba(232,168,50,0.08);border:1px solid rgba(232,168,50,0.25);}
.sf-ai-result.fail{background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.25);}
.sf-ai-result-title{font-size:13px;font-weight:600;margin-bottom:10px;}
.sf-ai-result.ok .sf-ai-result-title{color:var(--mint);}
.sf-ai-result.warn .sf-ai-result-title{color:var(--amber);}
.sf-ai-result.fail .sf-ai-result-title{color:#f87171;}
.sf-ai-pills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;}
.sf-ai-pill{font-size:10px;padding:3px 10px;border-radius:8px;font-family:'Space Mono',monospace;}
.sf-ai-pill.g{background:rgba(76,175,101,0.15);color:var(--mint);}
.sf-ai-pill.a{background:rgba(232,168,50,0.15);color:var(--amber);}
.sf-ai-pill.r{background:rgba(248,113,113,0.15);color:#f87171;}
.sf-ai-advice{font-size:11px;color:var(--warm);margin-top:6px;line-height:1.5;}
.sf-retry-btn{margin-top:10px;padding:7px 16px;background:rgba(248,113,113,0.15);border:1px solid rgba(248,113,113,0.3);color:#f87171;border-radius:8px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;}

/* Fields */
.sf-field{margin-bottom:14px;}
.sf-label{display:block;font-size:11px;font-family:'Space Mono',monospace;letter-spacing:0.5px;color:var(--muted);margin-bottom:6px;}
.sf-input{width:100%;padding:11px 14px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:9px;color:var(--cream);font-size:13px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s;}
.sf-input::placeholder{color:var(--muted);}
.sf-input:focus{border-color:rgba(76,175,101,0.45);}
select.sf-input{cursor:pointer;}
.sf-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
@media(max-width:500px){.sf-row{grid-template-columns:1fr;}}
.sf-input-prefix-wrap{position:relative;}
.sf-prefix{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--amber);font-size:14px;font-weight:600;}
.sf-input-prefixed{padding-left:26px;}

/* COD Note */
.sf-cod-note{background:rgba(232,168,50,0.06);border:1px solid rgba(232,168,50,0.2);border-radius:9px;padding:12px 14px;font-size:11px;color:var(--warm);line-height:1.6;margin:16px 0;}

/* Submit */
.sf-submit-btn{width:100%;padding:15px;background:linear-gradient(135deg,var(--sage),var(--leaf));color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.25s;box-shadow:0 6px 24px rgba(76,175,101,0.25);margin-top:8px;}
.sf-submit-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 36px rgba(76,175,101,0.35);}
.sf-submit-btn:disabled{opacity:0.5;cursor:not-allowed;}

/* Success */
.sf-success{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:16px;text-align:center;}
.sf-success-ic{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--sage),var(--leaf));display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff;box-shadow:0 0 0 20px rgba(76,175,101,0.08);animation:pop 0.5s cubic-bezier(0.34,1.56,0.64,1);}
@keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}
.sf-success-t{font-family:'Cormorant Garamond',serif;font-size:2.4rem;font-weight:700;color:var(--cream);}
.sf-success-s{color:var(--muted);font-size:14px;}
`;
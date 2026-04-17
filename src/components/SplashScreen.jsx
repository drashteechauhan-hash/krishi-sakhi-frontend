import { useEffect, useRef, useState } from "react";

const STATUSES = [
  "Connecting to AI Engine...",
  "Loading Crop Database...",
  "Initializing Voice Module...",
  "Ready to help farmers...",
];

export default function SplashScreen({ onFinish }) {
  const canvasRef = useRef(null);
  const splashRef = useRef(null);
  const [statusIdx, setStatusIdx] = useState(0);
  const [statusFade, setStatusFade] = useState(true);
  const [hiding, setHiding] = useState(false);

  /* ── Particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const splash = splashRef.current;
    if (!canvas || !splash) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = splash.offsetWidth;
      canvas.height = splash.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x      = Math.random() * canvas.width;
        this.y      = init ? Math.random() * canvas.height : canvas.height + 4;
        this.size   = Math.random() * 1.6 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -(Math.random() * 0.45 + 0.1);
        this.opacity = Math.random() * 0.5 + 0.1;
        this.life   = init ? Math.random() : 1;
        this.decay  = Math.random() * 0.003 + 0.001;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        if (this.life <= 0 || this.y < -4) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity * this.life;
        ctx.fillStyle   = "#4ade80";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: 90 }, () => new Particle());
    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── Status cycling ── */
  useEffect(() => {
    const id = setInterval(() => {
      setStatusFade(false);
      setTimeout(() => {
        setStatusIdx(i => (i + 1) % STATUSES.length);
        setStatusFade(true);
      }, 300);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  /* ── Auto-dismiss after 3.8s ── */
  useEffect(() => {
    const t = setTimeout(() => {
      setHiding(true);
      setTimeout(() => onFinish?.(), 700);
    }, 3800);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <div
      ref={splashRef}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#030d06",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        opacity: hiding ? 0 : 1,
        transition: "opacity 0.7s ease",
        pointerEvents: hiding ? "none" : "all",
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Radial glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(22,163,74,0.09) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Pulsing rings */}
      {[320, 500, 680].map((size, i) => (
        <div key={i} style={{
          position: "absolute",
          width: size, height: size,
          borderRadius: "50%",
          border: "1px solid rgba(74,222,128,0.07)",
          animation: `ringPulse 4s ease-out ${i * 1}s infinite`,
        }} />
      ))}

      {/* Bottom scan line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.35), transparent)",
        animation: "scanLine 3s ease 0.5s infinite",
      }} />

      {/* Center content */}
      <div style={{
        position: "relative", zIndex: 3,
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}>
        {/* Logo */}
        <div style={{
          width: 92, height: 92, marginBottom: 22,
          animation: "logoIn 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.3s both",
          filter: "drop-shadow(0 0 28px rgba(74,222,128,0.55))",
        }}>
          <svg viewBox="0 0 88 88" fill="none" width="92" height="92">
            <circle cx="44" cy="44" r="40" fill="rgba(22,163,74,0.12)" stroke="rgba(74,222,128,0.3)" strokeWidth="1"/>
            <circle cx="44" cy="44" r="30" fill="rgba(22,163,74,0.08)" stroke="rgba(74,222,128,0.15)" strokeWidth="0.5"/>
            <path d="M44 22 C44 22 32 30 30 42 C28 54 36 60 44 60 C52 60 60 54 58 42 C56 30 44 22 44 22Z"
              fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="1.2" strokeLinejoin="round"/>
            <line x1="44" y1="60" x2="44" y2="68" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M44 38 C50 40 53 46 54 50" stroke="rgba(74,222,128,0.5)" strokeWidth="1" strokeLinecap="round" fill="none"/>
            <path d="M44 44 C40 45 37 48 35 52" stroke="rgba(74,222,128,0.4)" strokeWidth="1" strokeLinecap="round" fill="none"/>
            <path d="M30 56 C33 52 37 54 44 52 C51 50 55 52 58 56"
              stroke="rgba(74,222,128,0.25)" strokeWidth="0.8" strokeLinecap="round" fill="none"/>
            <circle cx="44" cy="22" r="2.5" fill="#4ade80" opacity="0.8"/>
          </svg>
        </div>

        {/* Title */}
        <div style={{
          display: "flex", alignItems: "baseline", gap: 10,
          animation: "slideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.85s both",
        }}>
          <span style={{
            fontSize: 56, fontWeight: 800, letterSpacing: "-1.5px",
            color: "#4ade80",
            textShadow: "0 0 40px rgba(74,222,128,0.4)",
            lineHeight: 1,
          }}>Krishi</span>
          <span style={{
            fontSize: 56, fontWeight: 300, letterSpacing: "-1px",
            color: "rgba(255,255,255,0.88)", lineHeight: 1,
          }}>Sakhi</span>
        </div>

        {/* English tagline */}
        <div style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "5px",
          color: "rgba(74,222,128,0.55)", textTransform: "uppercase",
          marginTop: 10,
          animation: "slideUp 0.7s ease 1.4s both",
        }}>
          Your Digital Farming Companion
        </div>

        {/* Malayalam tagline */}
        <div style={{
          fontSize: 13, fontWeight: 400,
          color: "rgba(255,255,255,0.32)", marginTop: 6,
          animation: "slideUp 0.7s ease 1.7s both",
          fontFamily: "'Noto Sans Malayalam', sans-serif",
        }}>
          നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഹായി
        </div>

        {/* Progress bar */}
        <div style={{
          width: 260, marginTop: 36,
          animation: "slideUp 0.5s ease 2s both",
        }}>
          <div style={{
            width: "100%", height: 2,
            background: "rgba(74,222,128,0.10)",
            borderRadius: 2, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: 0,
              background: "linear-gradient(90deg, #16a34a, #4ade80, #86efac)",
              borderRadius: 2,
              boxShadow: "0 0 12px rgba(74,222,128,0.6)",
              animation: "loadBar 2.2s cubic-bezier(0.4,0,0.2,1) 2.1s forwards",
            }} />
          </div>
          <div style={{
            fontSize: 10, fontWeight: 500, letterSpacing: "2px",
            color: "rgba(74,222,128,0.5)", textTransform: "uppercase",
            marginTop: 10, fontFamily: "monospace",
            opacity: statusFade ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}>
            {STATUSES[statusIdx]}
          </div>
        </div>

        {/* Tech chips */}
        <div style={{
          display: "flex", gap: 8, marginTop: 28,
          animation: "slideUp 0.6s ease 2.3s both",
        }}>
          {["AI Powered", "Malayalam", "Voice", "Farming"].map((chip, i) => (
            <span key={chip} style={{
              background: "rgba(74,222,128,0.07)",
              border: "1px solid rgba(74,222,128,0.18)",
              color: "rgba(74,222,128,0.6)",
              fontSize: 10, fontWeight: 600, letterSpacing: "1px",
              padding: "5px 12px", borderRadius: 20,
              textTransform: "uppercase",
              animation: `chipPop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${2.4 + i * 0.15}s both`,
            }}>{chip}</span>
          ))}
        </div>
      </div>

      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes logoIn {
          from { opacity: 0; transform: scale(0.2) rotate(-30deg); }
          to   { opacity: 1; transform: scale(1)   rotate(0deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loadBar {
          to { width: 100%; }
        }
        @keyframes chipPop {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ringPulse {
          0%   { opacity: 0; transform: scale(0.85); }
          40%  { opacity: 1; }
          100% { opacity: 0; transform: scale(1.15); }
        }
        @keyframes scanLine {
          0%  { opacity: 0; transform: scaleX(0); }
          20% { opacity: 1; transform: scaleX(1); }
          80% { opacity: 1; transform: scaleX(1); }
          100%{ opacity: 0; transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}

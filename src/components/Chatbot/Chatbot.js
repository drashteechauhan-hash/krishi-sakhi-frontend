import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";


const BASE = "https://krishi-sakhi-backend-6.onrender.com/api";

// ─── CSS INJECTION ─────────────────────────────────────────────────────────────
const injectCSS = () => {
  if (document.getElementById("ks-styles")) return;
  const s = document.createElement("style");
  s.id = "ks-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;500;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');

    :root {
      --ks-bg0:    #050e09;
      --ks-bg1:    #081510;
      --ks-bg2:    #0e2117;
      --ks-bg3:    #163020;
      --ks-bg4:    #1e4229;
      --ks-accent: #4ade80;
      --ks-accent2:#22c55e;
      --ks-accent3:#16a34a;
      --ks-dim:    rgba(74,222,128,0.12);
      --ks-glow:   rgba(74,222,128,0.18);
      --ks-gold:   #fbbf24;
      --ks-red:    #f87171;
      --ks-blue:   #60a5fa;
      --ks-text:   rgba(255,255,255,0.90);
      --ks-text2:  rgba(255,255,255,0.55);
      --ks-text3:  rgba(255,255,255,0.30);
      --ks-border: rgba(74,222,128,0.12);
      --ks-font:   'DM Sans', 'Noto Sans Malayalam', system-ui, sans-serif;
      --ks-mono:   'DM Mono', monospace;
      --ks-radius: 24px;
      --ks-r-sm:   14px;
      --ks-r-xs:   8px;
    }

    /* ── OVERLAY ── */
    .ks-overlay {
      position: fixed; inset: 0; z-index: 99998;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(12px) saturate(0.7);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: ksOverlayIn 0.25s ease;
    }
    @keyframes ksOverlayIn { from{opacity:0} to{opacity:1} }

    .ks-window-wrapper {
      display: flex;
      gap: 12px;
      width: min(1200px, 100%);
      height: min(92vh, 920px);
      align-items: stretch;
    }

    .ks-video-panel {
      width: 320px;
      flex-shrink: 0;
      background: var(--ks-bg1);
      border-radius: var(--ks-radius);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 0 0 1px var(--ks-border), 0 40px 100px rgba(0,0,0,0.7);
      animation: ksWindowIn 0.4s cubic-bezier(0.22,1,0.36,1);
      font-family: var(--ks-font);
    }
    .ks-video-panel.hidden { display: none; }

    .ks-vp-header {
      background: var(--ks-bg0);
      padding: 14px 16px;
      border-bottom: 1px solid var(--ks-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .ks-vp-title {
      display: flex; align-items: center; gap: 8px;
      color: var(--ks-text); font-size: 13px; font-weight: 600;
    }
    .ks-vp-title-icon {
      width: 26px; height: 26px; border-radius: 7px;
      background: var(--ks-dim); border: 1px solid var(--ks-border);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; color: var(--ks-accent);
    }
    .ks-vp-close {
      width: 26px; height: 26px; border-radius: 7px; border: none;
      background: var(--ks-bg2); color: var(--ks-text3);
      font-size: 10px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s, color 0.15s;
    }
    .ks-vp-close:hover { background: var(--ks-bg3); color: var(--ks-text); }

    .ks-vp-player-wrap {
      background: #000;
      flex-shrink: 0;
      display: none;
      flex-direction: column;
    }
    .ks-vp-player-wrap.visible { display: flex; }
    .ks-vp-player-wrap video {
      width: 100%; display: block;
      max-height: 175px; object-fit: contain;
    }
    .ks-vp-progress {
      height: 3px;
      background: rgba(255,255,255,0.08);
      position: relative;
    }
    .ks-vp-now-label {
      display: flex; align-items: center; justify-content: space-between;
      padding: 7px 12px;
      background: var(--ks-bg0);
      border-bottom: 1px solid var(--ks-border);
    }
    .ks-vp-now-title {
      font-size: 11px; font-weight: 600; color: var(--ks-accent);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      max-width: 180px;
    }
    .ks-vp-now-badge {
      font-size: 8px; font-weight: 700; letter-spacing: 1px;
      background: rgba(74,222,128,0.12); color: var(--ks-accent);
      border: 1px solid rgba(74,222,128,0.22);
      padding: 2px 7px; border-radius: 4px;
      text-transform: uppercase; flex-shrink: 0;
      font-family: var(--ks-mono);
    }

    .ks-vp-list {
      flex: 1; overflow-y: auto;
      padding: 10px;
      display: flex; flex-direction: column; gap: 5px;
    }
    .ks-vp-list::-webkit-scrollbar { width: 3px; }
    .ks-vp-list::-webkit-scrollbar-thumb { background: var(--ks-border); border-radius: 3px; }

    .ks-vp-section {
      display: flex; align-items: center; gap: 8px;
      padding: 4px 2px 2px;
    }
    .ks-vp-section-line { flex: 1; height: 1px; background: var(--ks-border); }
    .ks-vp-section-text {
      font-size: 8px; font-weight: 700; letter-spacing: 1.5px;
      color: var(--ks-text3); font-family: var(--ks-mono); text-transform: uppercase;
      white-space: nowrap;
    }

    .ks-vtopic {
      background: var(--ks-bg2);
      border: 1px solid var(--ks-border);
      border-radius: 10px;
      padding: 8px 10px;
      cursor: pointer;
      transition: all 0.18s;
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .ks-vtopic:hover {
      border-color: rgba(74,222,128,0.28);
      background: var(--ks-bg3);
      transform: translateY(-1px);
    }
    .ks-vtopic.active {
      border-color: var(--ks-accent);
      background: var(--ks-bg3);
    }
    .ks-vtopic-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--ks-bg3);
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; flex-shrink: 0;
    }
    .ks-vtopic.active .ks-vtopic-icon { background: var(--ks-bg4); }
    .ks-vtopic-meta { flex: 1; min-width: 0; }
    .ks-vtopic-title {
      font-size: 12px; font-weight: 600; color: var(--ks-text);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      margin-bottom: 2px;
    }
    .ks-vtopic.active .ks-vtopic-title { color: var(--ks-accent); }
    .ks-vtopic-subtitle {
      font-size: 10px; color: var(--ks-text3);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .ks-vtopic-tags-row { display: flex; gap: 4px; flex-shrink: 0; }
    .ks-vtopic-tag {
      font-size: 8px; font-weight: 600; letter-spacing: 0.4px;
      background: rgba(74,222,128,0.07);
      border: 1px solid rgba(74,222,128,0.15);
      color: rgba(74,222,128,0.5);
      padding: 2px 5px; border-radius: 3px;
      text-transform: uppercase;
      font-family: var(--ks-mono);
      white-space: nowrap; flex-shrink: 0;
    }

    .ks-vtopic-action {
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      width: 24px; height: 24px; border-radius: 6px;
      background: rgba(74,222,128,0.1);
      border: 1px solid rgba(74,222,128,0.2);
      font-size: 9px; color: var(--ks-accent);
      transition: all 0.15s;
    }
    .ks-vtopic:hover .ks-vtopic-action { background: rgba(74,222,128,0.18); border-color: rgba(74,222,128,0.35); }
    .ks-vtopic.active .ks-vtopic-action { background: rgba(74,222,128,0.22); }

    .ks-vtopic.soon { opacity: 0.45; cursor: default; pointer-events: none; }
    .ks-vtopic-soon-badge {
      font-size: 8px; font-weight: 700; letter-spacing: 0.8px;
      background: rgba(251,191,36,0.1); color: var(--ks-gold);
      border: 1px solid rgba(251,191,36,0.2);
      padding: 2px 7px; border-radius: 4px;
      text-transform: uppercase; flex-shrink: 0;
      font-family: var(--ks-mono);
    }

    .ks-window {
      flex: 1; min-width: 0;
      background: var(--ks-bg1);
      border-radius: var(--ks-radius);
      display: flex; flex-direction: column;
      overflow: hidden;
      box-shadow:
        0 0 0 1px var(--ks-border),
        0 40px 100px rgba(0,0,0,0.7),
        0 0 80px rgba(74,222,128,0.04) inset;
      animation: ksWindowIn 0.4s cubic-bezier(0.22,1,0.36,1);
      font-family: var(--ks-font);
      position: relative;
    }
    @keyframes ksWindowIn {
      from { transform: scale(0.93) translateY(24px); opacity: 0; }
      to   { transform: scale(1)    translateY(0);    opacity: 1; }
    }
    .ks-window.closing { animation: ksWindowOut 0.22s ease forwards; }
    @keyframes ksWindowOut { to { transform: scale(0.95) translateY(16px); opacity: 0; } }

    .ks-header {
      background: var(--ks-bg0);
      padding: 16px 20px;
      display: flex; align-items: center; gap: 12px;
      border-bottom: 1px solid var(--ks-border);
      flex-shrink: 0; position: relative;
    }
    .ks-header-glow {
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--ks-accent), transparent);
      opacity: 0.5;
    }
    .ks-logo {
      width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0;
      background: linear-gradient(135deg, var(--ks-bg3), var(--ks-bg4));
      border: 1px solid var(--ks-border);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      box-shadow: 0 0 20px rgba(74,222,128,0.1);
      position: relative; overflow: hidden;
    }
    .ks-logo::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(74,222,128,0.08), transparent);
    }
    .ks-logo.pulse::before {
      content: '';
      position: absolute; inset: -4px; border-radius: 18px;
      border: 1px solid var(--ks-accent);
      opacity: 0; animation: ksPulseRing 2s ease-out infinite;
    }
    @keyframes ksPulseRing { 0%{opacity:0.6;transform:scale(1)} 100%{opacity:0;transform:scale(1.3)} }

    .ks-header-info { flex: 1; min-width: 0; }
    .ks-header-name {
      color: var(--ks-text); font-weight: 600; font-size: 15px;
      letter-spacing: -0.2px; display: flex; align-items: center; gap: 8px;
    }
    .ks-badge {
      font-size: 8px; font-weight: 700; letter-spacing: 1.2px;
      background: var(--ks-accent); color: var(--ks-bg0);
      padding: 2px 6px; border-radius: 5px; text-transform: uppercase;
    }
    .ks-header-status {
      font-size: 11.5px; color: var(--ks-text3); margin-top: 2px;
      display: flex; align-items: center; gap: 6px;
      font-family: var(--ks-mono); letter-spacing: 0.3px;
    }
    .ks-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--ks-accent); flex-shrink: 0;
      box-shadow: 0 0 6px var(--ks-accent);
    }
    .ks-dot.rec   { background: var(--ks-red);  box-shadow: 0 0 6px var(--ks-red);  animation: ksBlink 0.7s infinite; }
    .ks-dot.speak { background: var(--ks-gold); box-shadow: 0 0 6px var(--ks-gold); animation: ksBlink 1.1s infinite; }
    .ks-dot.proc  { background: var(--ks-blue); box-shadow: 0 0 6px var(--ks-blue); animation: ksBlink 0.5s infinite; }
    @keyframes ksBlink { 0%,100%{opacity:1} 50%{opacity:0.25} }

    .ks-vid-btn {
      display: flex; align-items: center; gap: 5px;
      background: var(--ks-bg2); border: 1px solid var(--ks-border);
      border-radius: var(--ks-r-xs); padding: 6px 10px;
      color: var(--ks-text2); font-size: 11px; font-weight: 600;
      cursor: pointer; font-family: var(--ks-font);
      transition: all 0.15s; letter-spacing: 0.3px; white-space: nowrap;
    }
    .ks-vid-btn:hover { border-color: var(--ks-accent); color: var(--ks-accent); background: var(--ks-dim); }
    .ks-vid-btn.active { border-color: var(--ks-accent); color: var(--ks-accent); background: var(--ks-dim); }
    .ks-vid-btn-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ks-accent); }

    .ks-close {
      width: 32px; height: 32px; border-radius: 10px; border: none;
      background: var(--ks-bg2); color: var(--ks-text3);
      font-size: 13px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s, color 0.15s; flex-shrink: 0;
    }
    .ks-close:hover { background: var(--ks-bg3); color: var(--ks-text); }

    .ks-messages {
      flex: 1; overflow-y: auto; padding: 24px 20px;
      display: flex; flex-direction: column; gap: 20px;
      background:
        radial-gradient(ellipse at 20% 0%, rgba(74,222,128,0.03) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 100%, rgba(74,222,128,0.02) 0%, transparent 50%),
        var(--ks-bg1);
    }
    .ks-messages::-webkit-scrollbar { width: 3px; }
    .ks-messages::-webkit-scrollbar-thumb { background: var(--ks-border); border-radius: 3px; }

    .ks-msg-row { display: flex; gap: 10px; animation: ksMsgIn 0.3s cubic-bezier(0.22,1,0.36,1); }
    .ks-msg-row.user { flex-direction: row-reverse; }
    @keyframes ksMsgIn { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }

    .ks-av {
      width: 32px; height: 32px; border-radius: 11px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; margin-top: 2px;
    }
    .ks-av.bot  { background: var(--ks-bg3); border: 1px solid var(--ks-border); }
    .ks-av.user { background: linear-gradient(135deg, var(--ks-bg3), var(--ks-bg4)); border: 1px solid rgba(74,222,128,0.2); }

    .ks-bubble {
      max-width: 74%; padding: 12px 16px; font-size: 14px;
      line-height: 1.75; word-break: break-word; white-space: pre-wrap;
      position: relative;
    }
    .ks-bubble.bot {
      background: var(--ks-bg2); border: 1px solid var(--ks-border);
      border-radius: 4px 18px 18px 18px; color: var(--ks-text);
    }
    .ks-bubble.user {
      background: linear-gradient(135deg, var(--ks-bg3), var(--ks-bg4));
      border: 1px solid rgba(74,222,128,0.18);
      border-radius: 18px 4px 18px 18px; color: var(--ks-text);
      box-shadow: 0 4px 24px rgba(74,222,128,0.08);
    }
    .ks-bubble-meta {
      display: flex; align-items: center; gap: 8px; margin-top: 8px; flex-wrap: wrap;
    }
    .ks-replay {
      display: flex; align-items: center; gap: 4px;
      background: none; border: none; cursor: pointer;
      color: var(--ks-accent); font-size: 11px; font-weight: 500;
      padding: 3px 8px; border-radius: 6px;
      border: 1px solid rgba(74,222,128,0.15);
      transition: all 0.15s; font-family: var(--ks-font); letter-spacing: 0.2px;
    }
    .ks-replay:hover { background: var(--ks-dim); border-color: rgba(74,222,128,0.35); }

    .ks-vid-pill {
      display: flex; align-items: center; gap: 5px;
      background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2);
      color: var(--ks-gold); font-size: 11px; font-weight: 500;
      padding: 3px 10px; border-radius: 6px;
      cursor: pointer; transition: all 0.15s; font-family: var(--ks-font);
    }
    .ks-vid-pill:hover { background: rgba(251,191,36,0.15); border-color: rgba(251,191,36,0.35); }

    .ks-typing {
      background: var(--ks-bg2); border: 1px solid var(--ks-border);
      border-radius: 4px 18px 18px 18px;
      padding: 14px 18px; display: flex; gap: 5px; align-items: center;
    }
    .ks-tdot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--ks-accent); opacity: 0.4;
      animation: ksBounce 1.3s infinite;
    }
    .ks-tdot:nth-child(2) { animation-delay: 0.18s; }
    .ks-tdot:nth-child(3) { animation-delay: 0.36s; }
    @keyframes ksBounce { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-6px);opacity:1} }

    .ks-chips-wrap {
      padding: 10px 20px 12px; border-top: 1px solid var(--ks-border);
      background: var(--ks-bg0); flex-shrink: 0;
    }
    .ks-chips-label {
      font-size: 9px; font-weight: 600; letter-spacing: 1.5px;
      color: var(--ks-text3); margin-bottom: 8px;
      font-family: var(--ks-mono); text-transform: uppercase;
    }
    .ks-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .ks-chip {
      background: var(--ks-bg2); border: 1px solid var(--ks-border);
      color: var(--ks-text2); border-radius: 20px;
      padding: 5px 13px; font-size: 12px; cursor: pointer; font-weight: 500;
      transition: all 0.15s; font-family: var(--ks-font);
    }
    .ks-chip:hover {
      background: var(--ks-dim); border-color: var(--ks-accent);
      color: var(--ks-accent); transform: translateY(-1px);
    }

    .ks-err {
      margin: 0 20px 12px;
      background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2);
      border-radius: var(--ks-r-sm); color: var(--ks-red);
      padding: 10px 14px; font-size: 12.5px; flex-shrink: 0;
      display: flex; align-items: center; gap: 8px;
    }

    .ks-input-panel {
      background: var(--ks-bg0);
      border-top: 1px solid var(--ks-border);
      padding: 16px 20px 20px; flex-shrink: 0;
    }

    .ks-wave {
      display: flex; align-items: center; gap: 2.5px;
      height: 36px; margin-bottom: 14px; padding: 0 4px;
    }
    .ks-wb {
      flex: 1; max-width: 5px; border-radius: 3px;
      background: rgba(74,222,128,0.12); height: 4px;
      transition: height 0.1s ease, background 0.2s;
    }
    .ks-wb.rec   { background: var(--ks-red); }
    .ks-wb.speak { background: var(--ks-gold); }
    .ks-wb.think { background: var(--ks-blue); }
    .ks-wb.active{ background: rgba(74,222,128,0.45); }

    .ks-mic-area {
      display: flex; flex-direction: column; align-items: center;
      margin-bottom: 16px; gap: 10px; position: relative;
    }
    .ks-mic-rings {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 80px; height: 80px; pointer-events: none;
    }
    .ks-ring {
      position: absolute; inset: 0; border-radius: 50%;
      border: 1.5px solid rgba(74,222,128,0.2);
      animation: ksRingOut 2.4s ease-out infinite;
    }
    .ks-ring:nth-child(2) { animation-delay: 1.2s; }
    .ks-ring.rec { border-color: rgba(248,113,113,0.35); animation: ksRingOutRed 0.85s ease-out infinite; }
    .ks-ring.rec:nth-child(2) { animation-delay: 0.42s; }
    @keyframes ksRingOut    { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(2);opacity:0} }
    @keyframes ksRingOutRed { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(1.9);opacity:0} }

    .ks-mic {
      width: 80px; height: 80px; border-radius: 50%; border: none;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 32px; position: relative; z-index: 1; outline: none;
      transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
      font-family: var(--ks-font); user-select: none; -webkit-user-select: none;
    }
    .ks-mic.idle {
      background: linear-gradient(145deg, var(--ks-bg3), var(--ks-bg4));
      border: 1.5px solid rgba(74,222,128,0.3);
      box-shadow: 0 8px 32px rgba(74,222,128,0.12), 0 2px 8px rgba(0,0,0,0.4);
    }
    .ks-mic.idle:hover:not(:disabled) {
      transform: scale(1.06);
      box-shadow: 0 12px 40px rgba(74,222,128,0.2), 0 2px 8px rgba(0,0,0,0.4);
      border-color: rgba(74,222,128,0.5);
    }
    .ks-mic.idle:active:not(:disabled) { transform: scale(0.96); }
    .ks-mic.rec {
      background: linear-gradient(145deg, #7f1d1d, #991b1b);
      border: 1.5px solid rgba(248,113,113,0.4);
      box-shadow: 0 8px 32px rgba(248,113,113,0.25);
      animation: ksMicRedPulse 0.85s infinite;
    }
    @keyframes ksMicRedPulse {
      0%,100% { box-shadow: 0 8px 32px rgba(248,113,113,0.25); }
      50%      { box-shadow: 0 8px 40px rgba(248,113,113,0.45); }
    }
    .ks-mic.proc {
      background: linear-gradient(145deg, #1e3a5f, #1d4ed8);
      border: 1.5px solid rgba(96,165,250,0.3);
      box-shadow: 0 8px 32px rgba(96,165,250,0.15);
      cursor: not-allowed;
    }
    .ks-mic.spk {
      background: linear-gradient(145deg, #78350f, #b45309);
      border: 1.5px solid rgba(251,191,36,0.3);
      box-shadow: 0 8px 32px rgba(251,191,36,0.15);
      cursor: not-allowed;
    }
    .ks-mic:disabled { opacity: 0.4; }

    .ks-mic-label {
      font-size: 11.5px; font-weight: 500; letter-spacing: 0.3px;
      color: var(--ks-text3); text-align: center;
      font-family: var(--ks-mono); transition: color 0.2s; min-height: 18px;
    }
    .ks-mic-label.rec  { color: var(--ks-red); }
    .ks-mic-label.proc { color: var(--ks-blue); }
    .ks-mic-label.spk  { color: var(--ks-gold); }

    .ks-div {
      display: flex; align-items: center; gap: 12px; margin: 10px 0 12px;
    }
    .ks-divl { flex: 1; height: 1px; background: var(--ks-border); }
    .ks-divt {
      font-size: 9px; font-weight: 600; letter-spacing: 1.5px;
      color: var(--ks-text3); font-family: var(--ks-mono); text-transform: uppercase;
    }

    .ks-input-row { display: flex; gap: 8px; align-items: flex-end; }
    .ks-ta {
      flex: 1; background: var(--ks-bg2); border: 1px solid var(--ks-border);
      border-radius: var(--ks-r-sm); padding: 11px 14px; color: var(--ks-text);
      font-size: 13.5px; font-family: var(--ks-font); resize: none; outline: none;
      max-height: 100px; line-height: 1.55; overflow-y: auto;
      transition: border-color 0.15s, background 0.15s;
    }
    .ks-ta::placeholder { color: var(--ks-text3); }
    .ks-ta:focus   { border-color: rgba(74,222,128,0.35); background: var(--ks-bg3); }
    .ks-ta:disabled{ background: var(--ks-bg1); color: var(--ks-text3); }

    .ks-send {
      width: 44px; height: 44px; border-radius: var(--ks-r-xs); border: none;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; flex-shrink: 0; cursor: pointer;
      font-family: var(--ks-font); transition: all 0.15s;
    }
    .ks-send.on {
      background: linear-gradient(135deg, var(--ks-bg3), var(--ks-bg4));
      border: 1px solid rgba(74,222,128,0.3); color: var(--ks-accent);
      box-shadow: 0 4px 16px rgba(74,222,128,0.1);
    }
    .ks-send.on:hover { border-color: var(--ks-accent); box-shadow: 0 4px 24px rgba(74,222,128,0.2); transform: translateY(-1px); }
    .ks-send.on:active { transform: translateY(0) scale(0.96); }
    .ks-send.off { background: var(--ks-bg2); border: 1px solid var(--ks-border); color: var(--ks-text3); cursor: not-allowed; }

    .ks-fab {
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      width: 60px; height: 60px; border-radius: 20px; border: none;
      background: linear-gradient(145deg, var(--ks-bg3), var(--ks-bg4));
      border: 1.5px solid rgba(74,222,128,0.25);
      color: var(--ks-accent); font-size: 26px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 32px rgba(74,222,128,0.12), 0 2px 8px rgba(0,0,0,0.4);
      font-family: var(--ks-font);
      transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    .ks-fab:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 16px 48px rgba(74,222,128,0.2), 0 2px 8px rgba(0,0,0,0.4);
      border-color: rgba(74,222,128,0.5);
    }
    .ks-fab.open {
      background: var(--ks-bg2); border-color: var(--ks-border);
      color: var(--ks-text2); font-size: 18px; border-radius: 14px;
    }
    .ks-fab.open:hover { transform: scale(1.06); }

    .ks-notif {
      position: absolute; top: -5px; right: -5px;
      width: 18px; height: 18px; border-radius: 50%;
      background: var(--ks-red); color: #fff; font-size: 9px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid var(--ks-bg0); font-family: var(--ks-mono);
    }

    .ks-ts {
      font-size: 10px; color: var(--ks-text3);
      font-family: var(--ks-mono); letter-spacing: 0.3px;
    }
  `;
  document.head.appendChild(s);
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "ml", label: "മലയാളം", flag: "🇮🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिंदी",   flag: "🇮🇳" },
  { code: "ta", label: "தமிழ்",  flag: "🇮🇳" },
];

const CHIPS = {
  ml: ["വിള ഉപദേശം", "കീട നിയന്ത്രണം", "വിപണി വില", "സർക്കാർ പദ്ധതികൾ", "ജലസേചനം", "വളം ഉപദേശം"],
  en: ["Crop advice", "Pest control", "Market prices", "Govt. schemes", "Irrigation", "Fertilizer tips"],
  hi: ["फसल सलाह", "कीट नियंत्रण", "बाजार भाव", "सरकारी योजनाएं", "सिंचाई", "उर्वरक सुझाव"],
  ta: ["பயிர் ஆலோசனை", "பூச்சி கட்டுப்பாடு", "சந்தை விலை", "அரசு திட்டங்கள்", "நீர்ப்பாசனம்", "உரம் ஆலோசனை"],
};

const WELCOME = {
  ml: "നമസ്കാരം 🌱\nഞാൻ Krishi Sakhi — നിങ്ങളുടെ AI കൃഷി സഹായി.\n🎙 അമർത്തി സംസാരിക്കുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക.",
  en: "Hello 🌱\nI'm Krishi Sakhi — your AI farming assistant.\nHold 🎙 to speak, or type below.",
  hi: "नमस्ते 🌱\nमैं Krishi Sakhi — आपका AI कृषि सहायक।\n🎙 दबाकर बोलें या नीचे टाइप करें।",
  ta: "வணக்கம் 🌱\nநான் Krishi Sakhi — உங்கள் AI விவசாய உதவியாளர்.\n🎙 அழுத்தி பேசுங்கள் அல்லது கீழே தட்டச்சு.",
};

const STATUS = {
  ml: { idle:"ഓൺലൈൻ • കൃഷി സഖി", rec:"🔴 കേൾക്കുന്നു...", proc:"⚙ പ്രോസസ്...", think:"✦ ചിന്തിക്കുന്നു...", speak:"🔊 സംസാരിക്കുന്നു..." },
  en: { idle:"online · farming assistant", rec:"● listening...", proc:"◌ processing...", think:"◌ thinking...", speak:"▶ speaking..." },
  hi: { idle:"ऑनलाइन · कृषि सहायक", rec:"● सुन रहा हूँ...", proc:"◌ प्रोसेस...", think:"◌ सोच रहा हूँ...", speak:"▶ बोल रहा हूँ..." },
  ta: { idle:"online · vivasāya utaviyāḷar", rec:"● kēṭkiṟēṉ...", proc:"◌ ceyal...", think:"◌ cintikka...", speak:"▶ pēcukiṟēṉ..." },
};

const MLABELS = {
  ml: { idle:"🎙 അമർത്തി സംസാരിക്കുക", rec:"↑ ബട്ടൺ വിടുക", proc:"⌛ പ്രോസസ്...", spk:"🔊 ..." },
  en: { idle:"🎙 hold to speak", rec:"↑ release to send", proc:"⌛ processing", spk:"🔊 playing..." },
  hi: { idle:"🎙 दबाकर बोलें", rec:"↑ छोड़ें", proc:"⌛ ...", spk:"🔊 ..." },
  ta: { idle:"🎙 அழுத்தி பேசுங்கள்", rec:"↑ விடுங்கள்", proc:"⌛ ...", spk:"🔊 ..." },
};

// ─── VIDEO LIBRARY ────────────────────────────────────────────────────────────
const VIDEO_LIBRARY = [
  {
    id: "rubber",
    title: "Tapping into Profits",
    titleMl: "റബ്ബർ ടാപ്പിംഗ്",
    desc: "Rubber tapping schedule & prices",
    descMl: "റബ്ബർ ടാപ്പിംഗ് ഷെഡ്യൂൾ & വില",
    icon: "🌿",
    tags: ["rubber", "income"],
    src: "https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486623/Tapping_into_profits_mpl1ci.mp4",
    available: true,
    keywords: ["rubber", "tapping", "റബ്ബർ", "ടാപ്പ്", "price", "വില"],
  },
  {
    id: "coconut",
    title: "Coconut Diseases Guide",
    titleMl: "തെങ്ങ് രോഗങ്ങൾ",
    desc: "Yellowing, root wilt & treatments",
    descMl: "മഞ്ഞളിക്കൽ, കേരക്കൊഴുപ്പ്, ചികിത്സ",
    icon: "🥥",
    tags: ["coconut", "disease"],
    src: "https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486612/Coconut_Diseases__A_Guide_q3d6aq.mp4",
    available: true,
    keywords: ["coconut", "yellowing", "root wilt", "തെങ്ങ്", "രോഗം", "മഞ്ഞ"],
  },
  {
    id: "farmerassist",
    title: "Farmer Assistance",
    titleMl: "കർഷക സഹായം",
    desc: "Government aid & support schemes",
    descMl: "സർക്കാർ സഹായം & പദ്ധതികൾ",
    icon: "🏛️",
    tags: ["scheme", "govt"],
    src: "https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486613/Farmer_Assistance__A_Guide_tjsjlg.mp4",
    available: true,
    keywords: ["scheme", "government", "subsidy", "assistance", "PM-KISAN", "പദ്ധതി", "സർക്കാർ", "കർഷക"],
  },
  {
    id: "paddy",
    title: "Protect Your Paddy",
    titleMl: "നെൽക്കൃഷി സംരക്ഷണം",
    desc: "Stem borer, blast & pest control",
    descMl: "കാണ്ഡ തുരപ്പൻ, ബ്ലാസ്റ്റ്, കീട നിയന്ത്രണം",
    icon: "🌾",
    tags: ["paddy", "pest"],
    src: "https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486632/protect_your_paddy_cultivation_vogmoy.mp4",
    available: true,
    keywords: ["paddy", "rice", "stem borer", "blast", "നെൽ", "നെൽവയൽ", "കീട"],
  },
  {
    id: "soilhealth",
    title: "Soil Health Card Guide",
    titleMl: "മണ്ണ് ആരോഗ്യ കാർഡ്",
    desc: "How to read & use your soil card",
    descMl: "കാർഡ് വായിക്കുന്നത് എങ്ങനെ",
    icon: "🌱",
    tags: ["soil", "pH"],
    src: "https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486748/Soil_health_card_jnst9g.mp4",
    available: true,
    keywords: ["soil", "health card", "മണ്ണ്", "soil card", "fertilizer", "pH", "nitrogen"],
  },
  {
    id: "irrigation",
    title: "Smart Irrigation Kerala",
    titleMl: "സ്മാർട്ട് ജലസേചനം",
    desc: "Summer water conservation & drip tips",
    descMl: "ജലസംരക്ഷണം, ഡ്രിപ്പ് ഇറിഗേഷൻ",
    icon: "💧",
    tags: ["water", "drip"],
    src: "https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486612/Summer_smart_irrigation_in_Kerala_do3mo2.mp4",
    available: true,
    keywords: ["irrigation", "water", "ജലസേചനം", "drip", "summer", "വേനൽ", "വെള്ളം"],
  },
  {
    id: "futureagriculture",
    title: "Future of Agriculture",
    titleMl: "കൃഷിയുടെ ഭാവി",
    desc: "Modern farming & technology in Kerala",
    descMl: "ആധുനിക കൃഷി & സാങ്കേതികവിദ്യ",
    icon: "🚀",
    tags: ["modern", "tech"],
    src: "https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486638/The_future_of_agriculture_in_Kerala_jyvrzb.mp4",
    available: true,
    keywords: ["modern farming", "technology", "future", "kerala", "ഭാവി", "ആധുനിക", "സാങ്കേതികം"],
  },
  {
    id: "banana",
    title: "Banana Harvest Guide",
    titleMl: "വാഴ കൃഷി മാർഗദർശി",
    desc: "Bunch care & harvest timing",
    descMl: "കുലക്കരുതൽ, വിളവെടുപ്പ്",
    icon: "🍌",
    tags: ["banana", "harvest"],
    src: "https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486632/A_guide_to_a_bountiful_banana_harvest_jbox9d.mp4",
    available: true,
    keywords: ["banana", "വാഴ", "harvest", "bunch", "കുല", "nendran", "നേന്ദ്രൻ"],
  },
];

function detectVideoForMessage(text) {
  const lower = text.toLowerCase();
  return VIDEO_LIBRARY.find(v =>
    v.keywords.some(k => lower.includes(k.toLowerCase()))
  ) || null;
}

// ─── WAV ENCODER ──────────────────────────────────────────────────────────────
function encodeWAV(ab) {
  const sr = ab.sampleRate, len = ab.length;
  const mono = new Float32Array(len);
  for (let ch = 0; ch < ab.numberOfChannels; ch++) {
    const d = ab.getChannelData(ch);
    for (let i = 0; i < len; i++) mono[i] += d[i] / ab.numberOfChannels;
  }
  const buf = new ArrayBuffer(44 + len * 2), view = new DataView(buf);
  const ws = (o, str) => { for (let i = 0; i < str.length; i++) view.setUint8(o + i, str.charCodeAt(i)); };
  ws(0,"RIFF"); view.setUint32(4, 36 + len * 2, true);
  ws(8,"WAVE"); ws(12,"fmt ");
  view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true);
  view.setUint32(24,sr,true); view.setUint32(28,sr*2,true);
  view.setUint16(32,2,true); view.setUint16(34,16,true);
  ws(36,"data"); view.setUint32(40,len*2,true);
  let off = 44;
  for (let i = 0; i < len; i++) {
    const s = Math.max(-1, Math.min(1, mono[i]));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7FFF, true); off += 2;
  }
  return buf;
}

async function toWavBlob(raw) {
  try {
    const ab  = await raw.arrayBuffer();
    const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    const dec = await ctx.decodeAudioData(ab);
    ctx.close();
    return { blob: new Blob([encodeWAV(dec)], { type:"audio/wav" }), name:"rec.wav" };
  } catch {
    const ext = raw.type.includes("ogg") ? "ogg" : raw.type.includes("mp4") ? "mp4" : "webm";
    return { blob: raw, name:`rec.${ext}` };
  }
}

const getBestMime = () =>
  ["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/ogg","audio/mp4"]
    .find(t => MediaRecorder.isTypeSupported(t)) || "audio/webm";

const b64ToAB = b64 => {
  const bin = atob(b64), buf = new ArrayBuffer(bin.length), v = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) v[i] = bin.charCodeAt(i);
  return buf;
};

const fmtTime = () => {
  const d = new Date();
  return d.getHours().toString().padStart(2,"0") + ":" + d.getMinutes().toString().padStart(2,"0");
};

// ─── WAVE BARS ────────────────────────────────────────────────────────────────
function WaveBars({ state }) {
  const barsRef = useRef([]);
  const timerRef = useRef(null);
  useEffect(() => {
    clearInterval(timerRef.current);
    const bars = barsRef.current;
    if (!bars.length) return;
    if (state === "idle") {
      bars.forEach(b => { if(b){ b.style.height="4px"; b.className="ks-wb"; } });
      return;
    }
    const cls = state==="rec" ? "ks-wb rec" : state==="speak" ? "ks-wb speak" : state==="think" ? "ks-wb think" : "ks-wb active";
    timerRef.current = setInterval(() => {
      bars.forEach(b => {
        if (!b) return;
        const h = state==="rec" ? Math.random()*30+4 : state==="speak" ? Math.random()*22+4 : Math.random()*14+4;
        b.style.height = h + "px";
        b.className = cls;
      });
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [state]);

  return (
    <div className="ks-wave">
      {Array.from({length:28},(_,i)=>(
        <div key={i} className="ks-wb" ref={el=>barsRef.current[i]=el} />
      ))}
    </div>
  );
}

// ─── VIDEO PANEL COMPONENT ────────────────────────────────────────────────────
function VideoPanel({ lang, onClose, activeVideoId, onPlayVideo }) {
  const videoRef = useRef(null);
  const activeVideo = VIDEO_LIBRARY.find(v => v.id === activeVideoId) ?? null;

  useEffect(() => {
    if (videoRef.current && activeVideo?.available) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [activeVideoId]); // eslint-disable-line

  const availableVideos  = VIDEO_LIBRARY.filter(v => v.available);
  const comingSoonVideos = VIDEO_LIBRARY.filter(v => !v.available);

  return (
    <div className="ks-video-panel">
      <div className="ks-vp-header">
        <div className="ks-vp-title">
          <div className="ks-vp-title-icon">▶</div>
          {lang === "ml" ? "വീഡിയോ പഠനം" : "Video Library"}
        </div>
        <button className="ks-vp-close" onClick={onClose} aria-label="Close">✕</button>
      </div>

      {activeVideo?.available && (
        <div className="ks-vp-player-wrap visible">
          <video ref={videoRef} controls preload="metadata">
            <source src={activeVideo.src} type="video/mp4" />
          </video>
          <div className="ks-vp-now-label">
            <span className="ks-vp-now-title">
              {lang === "ml" ? activeVideo.titleMl : activeVideo.title}
            </span>
            <span className="ks-vp-now-badge">▶ Now Playing</span>
          </div>
        </div>
      )}

      <div className="ks-vp-list">
        {availableVideos.length > 0 && (
          <>
            <div className="ks-vp-section">
              <div className="ks-vp-section-line" />
              <span className="ks-vp-section-text">
                {lang === "ml" ? "ലഭ്യമായ വീഡിയോകൾ" : `${availableVideos.length} available`}
              </span>
              <div className="ks-vp-section-line" />
            </div>
            {availableVideos.map(vid => (
              <div
                key={vid.id}
                className={`ks-vtopic ${activeVideoId === vid.id ? "active" : ""}`}
                onClick={() => onPlayVideo(vid.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && onPlayVideo(vid.id)}
              >
                <div className="ks-vtopic-icon">{vid.icon}</div>
                <div className="ks-vtopic-meta">
                  <div className="ks-vtopic-title">
                    {lang === "ml" ? vid.titleMl : vid.title}
                  </div>
                  <div className="ks-vtopic-subtitle">
                    {lang === "ml" ? vid.descMl : vid.desc}
                  </div>
                </div>
                {vid.tags?.length > 0 && (
                  <div className="ks-vtopic-tags-row">
                    {vid.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="ks-vtopic-tag">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="ks-vtopic-action">
                  {activeVideoId === vid.id ? "■" : "▶"}
                </div>
              </div>
            ))}
          </>
        )}

        {comingSoonVideos.length > 0 && (
          <>
            <div className="ks-vp-section" style={{ marginTop: availableVideos.length ? 6 : 0 }}>
              <div className="ks-vp-section-line" />
              <span className="ks-vp-section-text">Coming soon</span>
              <div className="ks-vp-section-line" />
            </div>
            {comingSoonVideos.map(vid => (
              <div key={vid.id} className="ks-vtopic soon">
                <div className="ks-vtopic-icon">{vid.icon}</div>
                <div className="ks-vtopic-meta">
                  <div className="ks-vtopic-title">
                    {lang === "ml" ? vid.titleMl : vid.title}
                  </div>
                  <div className="ks-vtopic-subtitle">
                    {lang === "ml" ? vid.descMl : vid.desc}
                  </div>
                </div>
                <span className="ks-vtopic-soon-badge">Soon</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Chatbot() {
  // ✅ Lang comes from global context now
  const { lang, selectLanguage } = useLanguage();

  const [open, setOpen]               = useState(false);
  const [closing, setClosing]         = useState(false);
  const [messages, setMessages]       = useState([{ id:0, role:"bot", text:WELCOME.ml, ts:fmtTime() }]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [recState, setRecState]       = useState("idle");
  const [isPlaying, setIsPlaying]     = useState(false);
  const [statusKey, setStatusKey]     = useState("idle");
  const [errMsg, setErrMsg]           = useState("");
  const [showChips, setShowChips]     = useState(true);
  const [unread, setUnread]           = useState(0);
  const [showVideos, setShowVideos]   = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const bottomRef = useRef(null);
  const taRef     = useRef(null);
  const mrRef     = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioRef  = useRef(null);
  const langRef   = useRef(lang);
  const speakRef  = useRef(null);

  useEffect(() => { langRef.current = lang; }, [lang]);
  useEffect(() => { injectCSS(); }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
    if (!open && messages.length > 1) setUnread(n => n+1);
  }, [messages]);
  useEffect(() => { if (open) setUnread(0); }, [open]);
  useEffect(() => {
    if (!taRef.current) return;
    taRef.current.style.height = "auto";
    taRef.current.style.height = Math.min(taRef.current.scrollHeight, 100) + "px";
  }, [input]);

  const showErr = useCallback(msg => {
    setErrMsg(msg);
    setTimeout(() => setErrMsg(""), 6000);
  }, []);

  const closeWindow = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 220);
  }, []);

  const handlePlayVideo = useCallback((videoId) => {
    setActiveVideo(videoId);
    setShowVideos(true);
  }, []);

  // ── Audio ──────────────────────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsPlaying(false);
    setStatusKey("idle");
  }, []);

  const playBuffer = useCallback(buf => {
    stopAudio();
    if (!buf || buf.byteLength === 0) return;
    const url = URL.createObjectURL(new Blob([buf], { type:"audio/mpeg" }));
    const a = new Audio(url);
    audioRef.current = a;
    setIsPlaying(true);
    setStatusKey("speak");
    a.play().catch(() => stopAudio());
    a.addEventListener("ended",  () => { stopAudio(); URL.revokeObjectURL(url); });
    a.addEventListener("error",  () => { stopAudio(); URL.revokeObjectURL(url); });
  }, [stopAudio]);

  const speakText = useCallback(async (text, langOverride) => {
    if (!text?.trim()) return;
    const activeLang = langOverride || langRef.current;
    try {
      setStatusKey("speak");
      const res = await fetch(`${BASE}/tts`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ text, lang:activeLang }),
      });
      if (res.status === 429) { setStatusKey("idle"); return; }
      if (!res.ok) throw new Error(`TTS ${res.status}`);
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 100) throw new Error("Empty audio");
      playBuffer(buf);
    } catch { setStatusKey("idle"); setIsPlaying(false); }
  }, [playBuffer]);

  useEffect(() => { speakRef.current = speakText; }, [speakText]);

  // ✅ switchLang now uses selectLanguage from context
  const switchLang = useCallback(l => {
    selectLanguage(l);
    setMessages([{ id:0, role:"bot", text:WELCOME[l]||WELCOME.en, ts:fmtTime() }]);
    setInput(""); setErrMsg(""); setStatusKey("idle"); setShowChips(true);
    stopAudio();
  }, [stopAudio, selectLanguage]);

  // ── Send text ──────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading || recState !== "idle") return;
    setInput(""); setShowChips(false);
    const uid = Date.now();
    setMessages(prev => [...prev, { id:uid, role:"user", text, ts:fmtTime() }]);
    setLoading(true); setStatusKey("think");

    const history = messages
      .filter(m => m.id !== 0)
      .map(m => ({ role:m.role==="bot"?"assistant":"user", content:m.text }));

    try {
      const res = await fetch(`${BASE}/chat`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ message:text, history, lang:langRef.current }),
      });
      if (!res.ok) throw new Error(`Chat ${res.status}`);
      const reply = (await res.json()).reply || "...";
      const suggestedVideo = detectVideoForMessage(text + " " + reply);
      setMessages(prev => [...prev, {
        id: uid+1, role: "bot", text: reply, ts: fmtTime(),
        suggestedVideoId: suggestedVideo?.id ?? null,
      }]);
      setLoading(false); setStatusKey("idle");
      await speakRef.current(reply);
    } catch (e) {
      setMessages(prev => [...prev, { id:uid+1, role:"bot", text:"❌ "+e.message, ts:fmtTime() }]);
      setLoading(false); setStatusKey("idle");
    }
  }, [input, loading, recState, messages]);

  // ── Recording ──────────────────────────────────────────────────────────────
  const startRecording = useCallback(async e => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (recState !== "idle" || isPlaying || loading) return;
    stopAudio(); setErrMsg("");
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio:{ channelCount:1, sampleRate:16000, echoCancellation:true, noiseSuppression:true, autoGainControl:true },
      });
    } catch { showErr("❌ Microphone access denied."); return; }

    streamRef.current = stream; chunksRef.current = [];
    const mime = getBestMime();
    let mr;
    try { mr = new MediaRecorder(stream, { mimeType:mime, audioBitsPerSecond:128000 }); }
    catch { mr = new MediaRecorder(stream); }
    mrRef.current = mr;

    mr.ondataavailable = e => { if (e.data?.size > 0) chunksRef.current.push(e.data); };
    mr.onerror = e => {
      showErr("❌ " + (e.error?.message || "Recording error"));
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null; setRecState("idle"); setStatusKey("idle");
    };

    mr.onstop = async () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      if (!chunksRef.current.length) {
        setRecState("idle"); setStatusKey("idle");
        showErr("❌ No audio captured — hold the button while speaking.");
        return;
      }
      setRecState("processing"); setStatusKey("proc");
      const raw = new Blob(chunksRef.current, { type:mr.mimeType||mime });
      const { blob:wavBlob, name:wavName } = await toWavBlob(raw);

      const history = messages
        .filter(m => m.id !== 0).slice(-6)
        .map(m => ({ role:m.role==="bot"?"assistant":"user", content:m.text }));

      const form = new FormData();
      form.append("audio",   wavBlob, wavName);
      form.append("lang",    langRef.current);
      form.append("history", JSON.stringify(history));

      try {
        const res = await fetch(`${BASE}/voice-chat`, { method:"POST", body:form });
        const rawText = await res.text();
        if (!res.ok) throw new Error(`Server ${res.status}: ${rawText.slice(0,150)}`);
        let data;
        try { data = JSON.parse(rawText); } catch { throw new Error("Bad JSON response"); }
        if (data.error) throw new Error(data.error);

        const userText     = data.userText    || "🎤 (voice)";
        const replyText    = data.replyText   || "...";
        const audioB64     = data.audioBase64 || "";
        const detectedLang = data.detectedLang || langRef.current;

        if (detectedLang !== langRef.current) {
          selectLanguage(detectedLang);
          langRef.current = detectedLang;
        }
        setShowChips(false);
        const suggestedVideo = detectVideoForMessage(userText + " " + replyText);
        setMessages(prev => [
          ...prev,
          { id:Date.now(),   role:"user", text:userText,  ts:fmtTime() },
          { id:Date.now()+1, role:"bot",  text:replyText, ts:fmtTime(), suggestedVideoId: suggestedVideo?.id ?? null },
        ]);
        setRecState("idle"); setStatusKey("idle");
        if (audioB64 && audioB64.length > 200) playBuffer(b64ToAB(audioB64));
        else await speakRef.current(replyText, detectedLang);
      } catch (e) {
        setRecState("idle"); setStatusKey("idle"); showErr("❌ "+e.message);
      }
    };

    mr.start(200); setRecState("recording"); setStatusKey("rec"); setShowChips(false);
  }, [recState, isPlaying, loading, messages, stopAudio, showErr, playBuffer, selectLanguage]);

  const stopRecording = useCallback(e => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (recState !== "recording") return;
    if (mrRef.current?.state === "recording") { mrRef.current.requestData(); mrRef.current.stop(); }
  }, [recState]);

  useEffect(() => () => {
    mrRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    stopAudio();
  }, [stopAudio]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const isRec       = recState === "recording";
  const isProc      = recState === "processing";
  const micDisabled = isProc || loading;
  const waveState   = isRec ? "rec" : isPlaying ? "speak" : loading ? "think" : "idle";
  const micCls      = isRec ? "rec" : isProc ? "proc" : isPlaying ? "spk" : "idle";
  const micIcon     = isRec ? "⏹" : isProc ? "⌛" : isPlaying ? "🔊" : "🎙";
  const micLbl      = isRec ? "rec" : isProc ? "proc" : isPlaying ? "spk" : "idle";
  const micLblCls   = isRec ? "rec" : isProc ? "proc" : isPlaying ? "spk" : "";
  const dotCls      = statusKey==="rec" ? "rec" : statusKey==="speak" ? "speak" : statusKey==="proc"||statusKey==="think" ? "proc" : "";
  const st = STATUS[lang] || STATUS.en;
  const ml = MLABELS[lang] || MLABELS.en;
  const chips = CHIPS[lang] || CHIPS.en;

  const playBtn = (text) => (
    <button className="ks-replay" onClick={() => speakText(text)}>
      ▶ {lang==="ml"?"വീണ്ടും":lang==="hi"?"फिर सुनें":lang==="ta"?"மீண்டும்":"play again"}
    </button>
  );

  const videoSuggestBtn = (videoId) => {
    const vid = VIDEO_LIBRARY.find(x => x.id === videoId);
    if (!vid) return null;
    return (
      <button className="ks-vid-pill" onClick={() => handlePlayVideo(videoId)}>
        ▶ {lang === "ml" ? vid.titleMl : vid.title}
      </button>
    );
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      {open && (
        <div className="ks-overlay" onClick={e => { if(e.target.classList.contains("ks-overlay")) closeWindow(); }}>
          <div className="ks-window-wrapper">

            {showVideos && (
              <VideoPanel
                lang={lang}
                onClose={() => setShowVideos(false)}
                activeVideoId={activeVideo}
                onPlayVideo={handlePlayVideo}
              />
            )}

            <div className={`ks-window${closing?" closing":""}`}>

              {/* HEADER — no language select dropdown, lang comes from global context */}
              <div className="ks-header">
                <div className="ks-header-glow" />
                <div className={`ks-logo${statusKey!=="idle"?" pulse":""}`}>🌾</div>
                <div className="ks-header-info">
                  <div className="ks-header-name">
                    Krishi Sakhi
                    <span className="ks-badge">AI</span>
                  </div>
                  <div className="ks-header-status">
                    <span className={`ks-dot ${dotCls}`} />
                    {st[statusKey] || st.idle}
                  </div>
                </div>

                <button
                  className={`ks-vid-btn ${showVideos ? "active" : ""}`}
                  onClick={() => setShowVideos(v => !v)}
                >
                  <div className="ks-vid-btn-dot" />
                  {lang === "ml" ? "വീഡിയോ" : "Videos"}
                </button>

                <button className="ks-close" onClick={closeWindow}>✕</button>
              </div>

              {/* MESSAGES */}
              <div className="ks-messages">
                {messages.map(m => (
                  <div key={m.id} className={`ks-msg-row ${m.role==="user"?"user":""}`}>
                    <div className={`ks-av ${m.role==="bot"?"bot":"user"}`}>
                      {m.role==="bot" ? "🌿" : "👤"}
                    </div>
                    <div>
                      <div className={`ks-bubble ${m.role==="bot"?"bot":"user"}`}>{m.text}</div>
                      <div className="ks-bubble-meta">
                        {m.ts && <span className="ks-ts">{m.ts}</span>}
                        {m.role==="bot" && m.id!==0 && playBtn(m.text)}
                        {m.role==="bot" && m.suggestedVideoId && videoSuggestBtn(m.suggestedVideoId)}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="ks-msg-row">
                    <div className="ks-av bot">🌿</div>
                    <div className="ks-typing">
                      <span className="ks-tdot"/><span className="ks-tdot"/><span className="ks-tdot"/>
                    </div>
                  </div>
                )}
                <div ref={bottomRef}/>
              </div>

              {/* CHIPS */}
              {showChips && (
                <div className="ks-chips-wrap">
                  <div className="ks-chips-label">Quick questions</div>
                  <div className="ks-chips">
                    {chips.map(c => (
                      <button key={c} className="ks-chip" onClick={() => sendMessage(c)}>{c}</button>
                    ))}
                  </div>
                </div>
              )}

              {errMsg && <div className="ks-err">⚠ {errMsg}</div>}

              {/* INPUT PANEL */}
              <div className="ks-input-panel">
                <WaveBars state={waveState} />

                <div className="ks-mic-area">
                  <div className="ks-mic-rings">
                    <div className={`ks-ring ${isRec?"rec":""}`}/>
                    <div className={`ks-ring ${isRec?"rec":""}`}/>
                  </div>
                  <button
                    className={`ks-mic ${micCls}`}
                    disabled={micDisabled && !isRec}
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    onTouchCancel={stopRecording}
                  >
                    {micIcon}
                  </button>
                  <div className={`ks-mic-label ${micLblCls}`}>{ml[micLbl]}</div>
                </div>

                <div className="ks-div">
                  <div className="ks-divl"/><span className="ks-divt">or type</span><div className="ks-divl"/>
                </div>

                <div className="ks-input-row">
                  <textarea
                    ref={taRef}
                    rows={1}
                    className="ks-ta"
                    placeholder={
                      lang==="ml" ? "സന്ദേശം ടൈപ്പ് ചെയ്യുക…"
                    : lang==="hi" ? "संदेश टाइप करें…"
                    : lang==="ta" ? "செய்தி தட்டச்சு செய்யுங்கள்…"
                    : "Type a message…"
                    }
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();} }}
                    disabled={loading || recState!=="idle"}
                  />
                  <button
                    className={`ks-send ${input.trim()&&!loading&&recState==="idle"?"on":"off"}`}
                    onClick={sendMessage}
                    disabled={!input.trim()||loading||recState!=="idle"}
                  >➤</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <button className={`ks-fab ${open?"open":""}`} onClick={() => open ? closeWindow() : setOpen(true)}>
        {unread>0 && !open && <div className="ks-notif">{unread>9?"9+":unread}</div>}
        {open ? "✕" : "🌾"}
      </button>
    </>
  );
}
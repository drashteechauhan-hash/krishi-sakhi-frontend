import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage, translateText } from "../../context/LanguageContext";

const BASE = "https://krishi-sakhi-backend-6.onrender.com/api";

// ─── CSS INJECTION ─────────────────────────────────────────────────────────────
const injectCSS = () => {
  if (document.getElementById("ks-styles")) return;
  const s = document.createElement("style");
  s.id = "ks-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;500;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
    :root {
      --ks-bg0:#f0faf2;
      --ks-bg1:#e8f5eb;
      --ks-bg2:#d4ecca;
      --ks-bg3:#c2e0c8;
      --ks-bg4:#a8d4b0;
      --ks-bg5:#8ec898;
      --ks-accent:#16a34a;
      --ks-accent2:#15803d;
      --ks-accent3:#166534;
      --ks-accent-soft:rgba(22,163,74,0.12);
      --ks-dim:rgba(22,163,74,0.15);
      --ks-gold:#d97706;
      --ks-red:#dc2626;
      --ks-blue:#2563eb;
      --ks-text:#14532d;
      --ks-text2:#166534;
      --ks-text3:#4d7c5a;
      --ks-text4:#86b894;
      --ks-border:rgba(22,163,74,0.20);
      --ks-border2:rgba(22,163,74,0.32);
      --ks-border3:rgba(22,163,74,0.48);
      --ks-font:'DM Sans','Noto Sans Malayalam',system-ui,sans-serif;
      --ks-mono:'DM Mono',monospace;
      --ks-radius:16px;
      --ks-r-sm:12px;
      --ks-r-xs:8px;
      --ks-shadow:0 8px 32px rgba(0,0,0,0.10),0 2px 8px rgba(0,0,0,0.06),0 0 0 1px var(--ks-border);
      --ks-shadow-sm:0 4px 16px rgba(0,0,0,0.08),0 0 0 1px var(--ks-border);
    }

    .ks-overlay{
      position:fixed;inset:0;z-index:99998;
      background:rgba(0,0,0,0.25);
      backdrop-filter:blur(6px);
      display:flex;align-items:flex-end;justify-content:flex-end;
      padding:0 24px 92px 0;
      animation:ksOverlayIn 0.2s ease;
    }
    @keyframes ksOverlayIn{from{opacity:0}to{opacity:1}}

    .ks-window-wrapper{
      display:flex;gap:12px;
      align-items:flex-end;
    }

    /* Video Panel - separate, same height as chatbot */
    .ks-video-panel{
      width:270px;flex-shrink:0;
      height:min(85vh,600px);
      background:var(--ks-bg0);
      border-radius:var(--ks-radius);
      display:flex;flex-direction:column;
      overflow:hidden;
      box-shadow:var(--ks-shadow);
      animation:ksSlideIn 0.25s cubic-bezier(0.22,1,0.36,1);
      font-family:var(--ks-font);
      border:1px solid var(--ks-border2);
    }
    @keyframes ksSlideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}

    .ks-vp-header{
      background:var(--ks-accent);
      padding:11px 13px;
      display:flex;align-items:center;justify-content:space-between;flex-shrink:0;
    }
    .ks-vp-title{display:flex;align-items:center;gap:6px;color:#fff;font-size:12px;font-weight:700;}
    .ks-vp-title-icon{font-size:14px;}
    .ks-vp-close{
      width:22px;height:22px;border-radius:6px;border:none;
      background:rgba(255,255,255,0.2);color:#fff;
      font-size:11px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      transition:all 0.15s;
    }
    .ks-vp-close:hover{background:rgba(255,255,255,0.35);}

    .ks-vp-player-wrap{background:#000;flex-shrink:0;display:none;flex-direction:column;}
    .ks-vp-player-wrap.visible{display:flex;}
    .ks-vp-player-wrap video{width:100%;display:block;max-height:130px;object-fit:contain;}
    .ks-vp-now-label{
      display:flex;align-items:center;justify-content:space-between;
      padding:6px 10px;background:var(--ks-bg1);
      border-bottom:1px solid var(--ks-border);
    }
    .ks-vp-now-title{font-size:10px;font-weight:600;color:var(--ks-accent);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;}
    .ks-vp-now-badge{font-size:7px;font-weight:700;background:var(--ks-accent-soft);color:var(--ks-accent);border:1px solid var(--ks-border2);padding:2px 6px;border-radius:4px;text-transform:uppercase;flex-shrink:0;}

    .ks-vp-list{flex:1;overflow-y:auto;padding:8px;display:flex;flex-direction:column;gap:4px;}
    .ks-vp-list::-webkit-scrollbar{width:3px;}
    .ks-vp-list::-webkit-scrollbar-thumb{background:var(--ks-border2);border-radius:3px;}

    .ks-vp-section{display:flex;align-items:center;gap:6px;padding:6px 2px 3px;}
    .ks-vp-section-line{flex:1;height:1px;background:var(--ks-border);}
    .ks-vp-section-text{font-size:8px;font-weight:700;letter-spacing:1px;color:var(--ks-text3);text-transform:uppercase;white-space:nowrap;}

    .ks-vtopic{
      background:#fff;border:1px solid var(--ks-border);
      border-radius:10px;padding:8px 10px;
      cursor:pointer;transition:all 0.15s;
      display:flex;align-items:center;gap:8px;
    }
    .ks-vtopic:hover{border-color:var(--ks-accent);background:var(--ks-accent-soft);transform:translateX(2px);}
    .ks-vtopic.active{border-color:var(--ks-accent);background:var(--ks-accent-soft);}
    .ks-vtopic-icon{width:30px;height:30px;border-radius:8px;background:var(--ks-bg1);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;border:1px solid var(--ks-border);}
    .ks-vtopic-meta{flex:1;min-width:0;}
    .ks-vtopic-title{font-size:11px;font-weight:600;color:var(--ks-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:1px;}
    .ks-vtopic.active .ks-vtopic-title{color:var(--ks-accent);}
    .ks-vtopic-subtitle{font-size:9px;color:var(--ks-text3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .ks-vtopic-tags-row{display:flex;gap:3px;flex-shrink:0;}
    .ks-vtopic-tag{font-size:7px;font-weight:600;background:var(--ks-accent-soft);border:1px solid var(--ks-border2);color:var(--ks-accent);padding:1px 4px;border-radius:3px;text-transform:uppercase;white-space:nowrap;}
    .ks-vtopic-action{flex-shrink:0;width:20px;height:20px;border-radius:6px;background:var(--ks-accent-soft);border:1px solid var(--ks-border2);display:flex;align-items:center;justify-content:center;font-size:8px;color:var(--ks-accent);}
    .ks-vtopic.soon{opacity:0.4;cursor:default;pointer-events:none;}
    .ks-vtopic-soon-badge{font-size:7px;font-weight:700;background:rgba(217,119,6,0.08);color:var(--ks-gold);border:1px solid rgba(217,119,6,0.2);padding:2px 6px;border-radius:4px;text-transform:uppercase;flex-shrink:0;}

    /* Main Chatbot Window - fixed size, doesn't change when video opens */
    .ks-window{
      width:360px;flex-shrink:0;
      height:min(85vh,600px);
      background:var(--ks-bg0);
      border-radius:var(--ks-radius);
      display:flex;flex-direction:column;
      overflow:hidden;
      box-shadow:var(--ks-shadow);
      animation:ksWindowIn 0.28s cubic-bezier(0.22,1,0.36,1);
      font-family:var(--ks-font);
      border:1px solid var(--ks-border2);
    }
    @keyframes ksWindowIn{from{transform:scale(0.96) translateY(10px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
    .ks-window.closing{animation:ksWindowOut 0.18s ease forwards;}
    @keyframes ksWindowOut{to{transform:scale(0.97) translateY(8px);opacity:0}}

    /* Header */
    .ks-header{
      background:var(--ks-accent);
      padding:12px 14px;
      display:flex;align-items:center;gap:10px;
      flex-shrink:0;
    }
    .ks-header-orb{display:none;}

    .ks-logo{
      width:36px;height:36px;border-radius:10px;flex-shrink:0;
      background:rgba(255,255,255,0.2);
      border:1.5px solid rgba(255,255,255,0.4);
      display:flex;align-items:center;justify-content:center;
      font-size:18px;position:relative;overflow:hidden;
    }
    .ks-logo.pulse::before{
      content:'';position:absolute;inset:-3px;border-radius:13px;
      border:1.5px solid rgba(255,255,255,0.6);opacity:0;
      animation:ksPulseRing 1.8s ease-out infinite;
    }
    @keyframes ksPulseRing{0%{opacity:0.6;transform:scale(1)}100%{opacity:0;transform:scale(1.4)}}

    .ks-header-info{flex:1;min-width:0;}
    .ks-header-name{color:#fff;font-weight:700;font-size:14px;display:flex;align-items:center;gap:7px;}
    .ks-badge{font-size:7px;font-weight:800;letter-spacing:1px;background:rgba(255,255,255,0.25);color:#fff;padding:2px 6px;border-radius:4px;text-transform:uppercase;border:1px solid rgba(255,255,255,0.3);}
    .ks-header-status{font-size:10px;color:rgba(255,255,255,0.75);margin-top:2px;display:flex;align-items:center;gap:5px;font-family:var(--ks-mono);}
    .ks-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.8);flex-shrink:0;}
    .ks-dot.rec{background:#fca5a5;animation:ksBlink 0.65s infinite;}
    .ks-dot.speak{background:#fde68a;animation:ksBlink 1s infinite;}
    .ks-dot.proc{background:#93c5fd;animation:ksBlink 0.45s infinite;}
    @keyframes ksBlink{0%,100%{opacity:1}50%{opacity:0.2}}

    .ks-vid-btn{
      display:flex;align-items:center;gap:5px;
      background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);
      border-radius:var(--ks-r-xs);padding:5px 10px;
      color:#fff;font-size:11px;font-weight:600;
      cursor:pointer;font-family:var(--ks-font);transition:all 0.15s;white-space:nowrap;
    }
    .ks-vid-btn:hover{background:rgba(255,255,255,0.28);}
    .ks-vid-btn.active{background:rgba(255,255,255,0.3);border-color:rgba(255,255,255,0.5);}
    .ks-vid-btn-dot{width:5px;height:5px;border-radius:50%;background:#fff;}

    .ks-close{
      width:28px;height:28px;border-radius:8px;border:none;
      background:rgba(255,255,255,0.18);color:#fff;
      font-size:12px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      transition:all 0.15s;flex-shrink:0;
    }
    .ks-close:hover{background:rgba(255,255,255,0.32);}

    /* Messages */
    .ks-messages{
      flex:1;overflow-y:auto;padding:14px 12px;
      display:flex;flex-direction:column;gap:12px;
      background:var(--ks-bg1);
    }
    .ks-messages::-webkit-scrollbar{width:3px;}
    .ks-messages::-webkit-scrollbar-thumb{background:var(--ks-border2);border-radius:3px;}

    .ks-msg-row{display:flex;gap:8px;animation:ksMsgIn 0.22s ease;}
    .ks-msg-row.user{flex-direction:row-reverse;}
    @keyframes ksMsgIn{from{transform:translateY(6px);opacity:0}to{transform:translateY(0);opacity:1}}

    .ks-av{width:28px;height:28px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;margin-top:2px;}
    .ks-av.bot{background:var(--ks-accent);border:1px solid var(--ks-accent2);}
    .ks-av.user{background:var(--ks-bg3);border:1px solid var(--ks-border2);}

    .ks-bubble{max-width:80%;padding:9px 12px;font-size:13px;line-height:1.65;word-break:break-word;white-space:pre-wrap;}
    .ks-bubble.bot{background:#fff;border:1px solid var(--ks-border);border-radius:4px 14px 14px 14px;color:var(--ks-text);box-shadow:0 1px 4px rgba(0,0,0,0.06);}
    .ks-bubble.user{background:var(--ks-accent);border-radius:14px 4px 14px 14px;color:#fff;}
    .ks-bubble-meta{display:flex;align-items:center;gap:6px;margin-top:5px;flex-wrap:wrap;}

    .ks-replay{display:flex;align-items:center;gap:3px;background:none;border:1px solid var(--ks-border2);cursor:pointer;color:var(--ks-accent);font-size:10px;font-weight:500;padding:2px 7px;border-radius:5px;transition:all 0.15s;font-family:var(--ks-font);}
    .ks-replay:hover{background:var(--ks-accent-soft);}

    .ks-vid-pill{display:flex;align-items:center;gap:4px;background:rgba(217,119,6,0.08);border:1px solid rgba(217,119,6,0.22);color:var(--ks-gold);font-size:10px;font-weight:500;padding:2px 8px;border-radius:5px;cursor:pointer;transition:all 0.15s;font-family:var(--ks-font);}
    .ks-vid-pill:hover{background:rgba(217,119,6,0.15);}

    /* Typing */
    .ks-typing{background:#fff;border:1px solid var(--ks-border);border-radius:4px 14px 14px 14px;padding:10px 14px;display:flex;gap:4px;align-items:center;}
    .ks-tdot{width:6px;height:6px;border-radius:50%;background:var(--ks-accent);opacity:0.4;animation:ksBounce 1.4s infinite;}
    .ks-tdot:nth-child(2){animation-delay:0.18s;}
    .ks-tdot:nth-child(3){animation-delay:0.36s;}
    @keyframes ksBounce{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-5px);opacity:1}}

    /* Chips */
    .ks-chips-wrap{padding:8px 12px 10px;border-top:1px solid var(--ks-border);background:var(--ks-bg0);flex-shrink:0;}
    .ks-chips-label{font-size:8px;font-weight:700;letter-spacing:1.5px;color:var(--ks-text3);margin-bottom:6px;text-transform:uppercase;}
    .ks-chips{display:flex;flex-wrap:wrap;gap:5px;}
    .ks-chip{background:#fff;border:1px solid var(--ks-border2);color:var(--ks-text2);border-radius:16px;padding:4px 11px;font-size:11px;cursor:pointer;font-weight:500;transition:all 0.15s;font-family:var(--ks-font);}
    .ks-chip:hover{background:var(--ks-accent);border-color:var(--ks-accent);color:#fff;}

    /* Error */
    .ks-err{margin:0 12px 8px;background:rgba(220,38,38,0.06);border:1px solid rgba(220,38,38,0.2);border-radius:var(--ks-r-sm);color:var(--ks-red);padding:8px 12px;font-size:12px;flex-shrink:0;display:flex;align-items:center;gap:6px;}

    /* Input Panel */
    .ks-input-panel{background:var(--ks-bg0);border-top:1px solid var(--ks-border);padding:10px 12px 12px;flex-shrink:0;}

    /* Wave */
    .ks-wave{display:flex;align-items:center;gap:2px;height:18px;margin-bottom:8px;padding:0 2px;}
    .ks-wb{flex:1;max-width:4px;border-radius:2px;background:rgba(22,163,74,0.15);height:2px;transition:height 0.08s ease,background 0.2s;}
    .ks-wb.rec{background:var(--ks-red);}
    .ks-wb.speak{background:var(--ks-gold);}
    .ks-wb.think{background:var(--ks-accent);}
    .ks-wb.active{background:rgba(22,163,74,0.5);}

    /* Mic - compact row */
    .ks-mic-area{display:flex;flex-direction:row;align-items:center;justify-content:center;margin-bottom:8px;gap:10px;}
    .ks-mic-rings{display:none;}

    .ks-mic{
      width:38px;height:38px;border-radius:10px;border:none;
      cursor:pointer;display:flex;align-items:center;justify-content:center;
      font-size:17px;outline:none;transition:all 0.18s;
      user-select:none;-webkit-user-select:none;
    }
    .ks-mic.idle{background:var(--ks-accent);color:#fff;box-shadow:0 2px 8px rgba(22,163,74,0.3);}
    .ks-mic.idle:hover:not(:disabled){background:var(--ks-accent2);transform:scale(1.05);}
    .ks-mic.idle:active:not(:disabled){transform:scale(0.95);}
    .ks-mic.rec{background:#dc2626;color:#fff;animation:ksMicRedPulse 0.8s infinite;}
    @keyframes ksMicRedPulse{0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,0.3)}50%{box-shadow:0 0 0 8px rgba(220,38,38,0)}}
    .ks-mic.proc{background:var(--ks-bg3);color:var(--ks-blue);cursor:not-allowed;}
    .ks-mic.spk{background:#fef3c7;color:var(--ks-gold);cursor:not-allowed;}
    .ks-mic:disabled{opacity:0.5;}

    .ks-mic-label{font-size:11px;font-weight:500;color:var(--ks-text3);font-family:var(--ks-mono);transition:color 0.2s;}
    .ks-mic-label.rec{color:var(--ks-red);}
    .ks-mic-label.proc{color:var(--ks-blue);}
    .ks-mic-label.spk{color:var(--ks-gold);}

    /* Divider */
    .ks-div{display:flex;align-items:center;gap:8px;margin:4px 0 8px;}
    .ks-divl{flex:1;height:1px;background:var(--ks-border);}
    .ks-divt{font-size:8px;font-weight:600;letter-spacing:1px;color:var(--ks-text3);text-transform:uppercase;}

    /* Text input */
    .ks-input-row{display:flex;gap:7px;align-items:flex-end;}
    .ks-input-wrap{flex:1;position:relative;}
    .ks-ta{
      width:100%;background:#fff;
      border:1px solid var(--ks-border2);border-radius:var(--ks-r-sm);
      padding:9px 32px 9px 12px;color:var(--ks-text);font-size:13px;
      font-family:var(--ks-font);resize:none;outline:none;max-height:80px;
      line-height:1.5;overflow-y:auto;transition:border-color 0.15s,box-shadow 0.15s;
    }
    .ks-ta::placeholder{color:var(--ks-text4);}
    .ks-ta:focus{border-color:var(--ks-accent);box-shadow:0 0 0 3px rgba(22,163,74,0.10);}
    .ks-ta:disabled{background:var(--ks-bg2);color:var(--ks-text3);}

    .ks-translating-spin{position:absolute;right:9px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--ks-accent);animation:ksSpin 1s linear infinite;}
    @keyframes ksSpin{from{transform:translateY(-50%) rotate(0deg)}to{transform:translateY(-50%) rotate(360deg)}}

    .ks-send{width:38px;height:38px;border-radius:var(--ks-r-xs);border:none;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;cursor:pointer;transition:all 0.15s;}
    .ks-send.on{background:var(--ks-accent);color:#fff;box-shadow:0 2px 8px rgba(22,163,74,0.3);}
    .ks-send.on:hover{background:var(--ks-accent2);transform:translateY(-1px);}
    .ks-send.on:active{transform:scale(0.95);}
    .ks-send.off{background:var(--ks-bg2);border:1px solid var(--ks-border);color:var(--ks-text4);cursor:not-allowed;}

    /* FAB */
    .ks-fab{
      position:fixed;bottom:24px;right:24px;z-index:99999;
      width:52px;height:52px;border-radius:16px;border:none;
      background:var(--ks-accent);color:#fff;font-size:22px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 4px 16px rgba(22,163,74,0.40),0 2px 6px rgba(0,0,0,0.10);
      font-family:var(--ks-font);
      transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    .ks-fab:hover{transform:scale(1.08) translateY(-2px);box-shadow:0 8px 24px rgba(22,163,74,0.45);}
    .ks-fab.open{background:var(--ks-bg2);color:var(--ks-text2);font-size:16px;box-shadow:var(--ks-shadow-sm);}
    .ks-notif{
      position:absolute;top:-5px;right:-5px;width:18px;height:18px;border-radius:50%;
      background:var(--ks-red);color:#fff;font-size:8px;font-weight:700;
      display:flex;align-items:center;justify-content:center;
      border:2px solid #fff;
    }

    .ks-ts{font-size:9px;color:var(--ks-text3);font-family:var(--ks-mono);}
  `;
  document.head.appendChild(s);
}

// ─── WELCOME messages ─────────────────────────────────────────────────────────
const getWelcome = (l) => {
  const map = {
    ml:  "നമസ്കാരം 🌱\nഞാൻ Krishi Sakhi — നിങ്ങളുടെ AI കൃഷി സഹായി.\n🎙 അമർത്തി സംസാരിക്കുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക.",
    en:  "Hello 🌱\nI'm Krishi Sakhi — your AI farming assistant.\nHold 🎙 to speak, or type below.",
    hi:  "नमस्ते 🌱\nमैं Krishi Sakhi हूँ — आपका AI कृषि सहायक।\n🎙 बटन दबाकर बोलें या नीचे टाइप करें।",
    ta:  "வணக்கம் 🌱\nநான் Krishi Sakhi — உங்கள் AI விவசாய உதவியாளர்.\n🎙 அழுத்தி பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்.",
    te:  "నమస్కారం 🌱\nనేను Krishi Sakhi — మీ AI వ్యవసాయ సహాయకుడు.\n🎙 నొక్కి మాట్లాడండి లేదా టైప్ చేయండి.",
    kn:  "ನಮಸ್ಕಾರ 🌱\nನಾನು Krishi Sakhi — ನಿಮ್ಮ AI ಕೃಷಿ ಸಹಾಯಕ.\n🎙 ಒತ್ತಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.",
    bn:  "নমস্কার 🌱\nআমি Krishi Sakhi — আপনার AI কৃষি সহায়ক।\n🎙 ধরে কথা বলুন অথবা টাইপ করুন।",
    mr:  "नमस्कार 🌱\nमी Krishi Sakhi — तुमचा AI शेती सहाय्यक.\n🎙 दाबून बोला किंवा खाली टाइप करा.",
    gu:  "નમસ્તે 🌱\nહું Krishi Sakhi — તમારો AI ખેતી સહાયક.\n🎙 દબાવીને બોલો અથવા ટાઇપ કરો.",
    pa:  "ਸਤ ਸ੍ਰੀ ਅਕਾਲ 🌱\nਮੈਂ Krishi Sakhi — ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਹਾਇਕ।\n🎙 ਦਬਾ ਕੇ ਬੋਲੋ ਜਾਂ ਟਾਈਪ ਕਰੋ।",
    ur:  "السلام علیکم 🌱\nمیں Krishi Sakhi — آپ کا AI زراعت معاون۔\n🎙 دبا کر بولیں یا نیچے ٹائپ کریں۔",
  };
  return map[l] || map.en;
};

// ─── CHIPS ────────────────────────────────────────────────────────────────────
const getChips = (l) => {
  const map = {
    ml: ["വിള ഉപദേശം","കീട നിയന്ത്രണം","വിപണി വില","സർക്കാർ പദ്ധതികൾ","ജലസേചനം","വളം ഉപദേശം"],
    en: ["Crop advice","Pest control","Market prices","Govt. schemes","Irrigation","Fertilizer tips"],
    hi: ["फसल सलाह","कीट नियंत्रण","बाजार भाव","सरकारी योजनाएं","सिंचाई","उर्वरक सुझाव"],
    ta: ["பயிர் ஆலோசனை","பூச்சி கட்டுப்பாடு","சந்தை விலை","அரசு திட்டங்கள்","நீர்ப்பாசனம்","உரம்"],
    te: ["పంట సలహా","తెగులు నియంత్రణ","మార్కెట్ ధర","ప్రభుత్వ పథకాలు","నీటిపారుదల","ఎరువు"],
    kn: ["ಬೆಳೆ ಸಲಹೆ","ಕೀಟ ನಿಯಂತ್ರಣ","ಮಾರುಕಟ್ಟೆ ಬೆಲೆ","ಸರ್ಕಾರಿ ಯೋಜನೆ","ನೀರಾವರಿ","ಗೊಬ್ಬರ"],
    bn: ["ফসলের পরামর্শ","কীটপতঙ্গ নিয়ন্ত্রণ","বাজার মূল্য","সরকারি প্রকল্প","সেচ","সার"],
    mr: ["पीक सल्ला","कीड नियंत्रण","बाजारभाव","सरकारी योजना","सिंचन","खत"],
    gu: ["પાક સલાહ","જીવાત નિયંત્રણ","બજાર ભાવ","સરકારી યોજના","સિંચાઈ","ખાતર"],
    pa: ["ਫਸਲ ਸਲਾਹ","ਕੀੜੇ ਨਿਯੰਤਰਣ","ਮੰਡੀ ਭਾਅ","ਸਰਕਾਰੀ ਯੋਜਨਾ","ਸਿੰਚਾਈ","ਖਾਦ"],
    ur: ["فصل مشورہ","کیڑوں کا کنٹرول","منڈی قیمت","سرکاری اسکیم","آبپاشی","کھاد"],
  };
  return map[l] || map.en;
};

const STATUS = {
  ml: { idle:"ഓൺലൈൻ • കൃഷി സഖി",rec:"🔴 കേൾക്കുന്നു...",proc:"⚙ പ്രോസസ്...",think:"✦ ചിന്തിക്കുന്നു...",speak:"🔊 സംസാരിക്കുന്നു..." },
  en: { idle:"online · farming assistant",rec:"● listening...",proc:"◌ processing...",think:"◌ thinking...",speak:"▶ speaking..." },
  hi: { idle:"ऑनलाइन · कृषि सहायक",rec:"● सुन रहा हूँ...",proc:"◌ प्रोसेस...",think:"◌ सोच रहा हूँ...",speak:"▶ बोल रहा हूँ..." },
  ta: { idle:"ஆன்லைன் · விவசாய உதவியாளர்",rec:"● கேட்கிறேன்...",proc:"◌ செயல்...",think:"◌ சிந்திக்கிறேன்...",speak:"▶ பேசுகிறேன்..." },
  te: { idle:"ఆన్‌లైన్ · వ్యవసాయ సహాయకుడు",rec:"● వింటున్నాను...",proc:"◌ ప్రాసెస్...",think:"◌ ఆలోచిస్తున్నాను...",speak:"▶ మాట్లాడుతున్నాను..." },
  kn: { idle:"ಆನ್‌ಲೈನ್ · ಕೃಷಿ ಸಹಾಯಕ",rec:"● ಕೇಳುತ್ತಿದ್ದೇನೆ...",proc:"◌ ಪ್ರಕ್ರಿಯೆ...",think:"◌ ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...",speak:"▶ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ..." },
  bn: { idle:"অনলাইন · কৃষি সহায়ক",rec:"● শুনছি...",proc:"◌ প্রক্রিয়া...",think:"◌ ভাবছি...",speak:"▶ বলছি..." },
  mr: { idle:"ऑनलाइन · शेती सहाय्यक",rec:"● ऐकतो आहे...",proc:"◌ प्रक्रिया...",think:"◌ विचार...",speak:"▶ बोलतो आहे..." },
  gu: { idle:"ઓનલાઇન · ખેતી સહાયક",rec:"● સાંભળું છું...",proc:"◌ પ્રક્રિયા...",think:"◌ વિચારું છું...",speak:"▶ બોલું છું..." },
  pa: { idle:"ਔਨਲਾਈਨ · ਖੇਤੀ ਸਹਾਇਕ",rec:"● ਸੁਣ ਰਿਹਾ ਹਾਂ...",proc:"◌ ਪ੍ਰਕਿਰਿਆ...",think:"◌ ਸੋਚ ਰਿਹਾ ਹਾਂ...",speak:"▶ ਬੋਲ ਰਿਹਾ ਹਾਂ..." },
  ur: { idle:"آن لائن · زراعت معاون",rec:"● سن رہا ہوں...",proc:"◌ پراسیس...",think:"◌ سوچ رہا ہوں...",speak:"▶ بول رہا ہوں..." },
};

const MLABELS = {
  ml: { idle:"🎙 അമർത്തി സംസാരിക്കുക",rec:"↑ ബട്ടൺ വിടുക",proc:"⌛ പ്രോസസ്...",spk:"🔊 ..." },
  en: { idle:"🎙 hold to speak",rec:"↑ release to send",proc:"⌛ processing",spk:"🔊 playing..." },
  hi: { idle:"🎙 दबाकर बोलें",rec:"↑ छोड़ें भेजने के लिए",proc:"⌛ प्रोसेस हो रहा है",spk:"🔊 सुनाई दे रहा है..." },
  ta: { idle:"🎙 அழுத்தி பேசுங்கள்",rec:"↑ விட்டுவிடுங்கள்",proc:"⌛ ...",spk:"🔊 ..." },
  te: { idle:"🎙 నొక్కి మాట్లాడండి",rec:"↑ వదలండి",proc:"⌛ ...",spk:"🔊 ..." },
  kn: { idle:"🎙 ಒತ್ತಿ ಮಾತನಾಡಿ",rec:"↑ ಬಿಡಿ",proc:"⌛ ...",spk:"🔊 ..." },
  bn: { idle:"🎙 ধরে কথা বলুন",rec:"↑ ছাড়ুন",proc:"⌛ ...",spk:"🔊 ..." },
  mr: { idle:"🎙 दाबून बोला",rec:"↑ सोडा",proc:"⌛ ...",spk:"🔊 ..." },
  gu: { idle:"🎙 દબાવીને બોલો",rec:"↑ છોડો",proc:"⌛ ...",spk:"🔊 ..." },
  pa: { idle:"🎙 ਦਬਾ ਕੇ ਬੋਲੋ",rec:"↑ ਛੱਡੋ",proc:"⌛ ...",spk:"🔊 ..." },
  ur: { idle:"🎙 دبا کر بولیں",rec:"↑ چھوڑیں",proc:"⌛ ...",spk:"🔊 ..." },
};

// ─── VIDEO LIBRARY ────────────────────────────────────────────────────────────
const VIDEO_LIBRARY = [
  { id:"rubber",   title:"Tapping into Profits",    titleMl:"റബ്ബർ ടാപ്പിംഗ്",       desc:"Rubber tapping schedule & prices",       descMl:"റബ്ബർ ടാപ്പിംഗ് ഷെഡ്യൂൾ & വില",     icon:"🌿", tags:["rubber","income"],   src:"https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486623/Tapping_into_profits_mpl1ci.mp4",             available:true, keywords:["rubber","tapping","റബ്ബർ","ടാപ്പ്","price","വില"] },
  { id:"coconut",  title:"Coconut Diseases Guide",  titleMl:"തെങ്ങ് രോഗങ്ങൾ",         desc:"Yellowing, root wilt & treatments",       descMl:"മഞ്ഞളിക്കൽ, കേരക്കൊഴുപ്പ്, ചികിത്സ", icon:"🥥", tags:["coconut","disease"],  src:"https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486612/Coconut_Diseases__A_Guide_q3d6aq.mp4",          available:true, keywords:["coconut","yellowing","root wilt","തെങ്ങ്","രോഗം","മഞ്ഞ"] },
  { id:"farmerassist",title:"Farmer Assistance",   titleMl:"കർഷക സഹായം",            desc:"Government aid & support schemes",        descMl:"സർക്കാർ സഹായം & പദ്ധതികൾ",          icon:"🏛️",tags:["scheme","govt"],    src:"https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486613/Farmer_Assistance__A_Guide_tjsjlg.mp4",        available:true, keywords:["scheme","government","subsidy","assistance","PM-KISAN","പദ്ധതി","സർക്കാർ","കർഷക"] },
  { id:"paddy",    title:"Protect Your Paddy",      titleMl:"നെൽക്കൃഷി സംരക്ഷണം",    desc:"Stem borer, blast & pest control",        descMl:"കാണ്ഡ തുരപ്പൻ, ബ്ലാസ്റ്റ്",          icon:"🌾", tags:["paddy","pest"],      src:"https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486632/protect_your_paddy_cultivation_vogmoy.mp4",    available:true, keywords:["paddy","rice","stem borer","blast","നെൽ","നെൽവയൽ","കീട"] },
  { id:"soilhealth",title:"Soil Health Card Guide", titleMl:"മണ്ണ് ആരോഗ്യ കാർഡ്",    desc:"How to read & use your soil card",        descMl:"കാർഡ് വായിക്കുന്നത് എങ്ങനെ",         icon:"🌱", tags:["soil","pH"],         src:"https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486748/Soil_health_card_jnst9g.mp4",                 available:true, keywords:["soil","health card","മണ്ണ്","soil card","fertilizer","pH","nitrogen"] },
  { id:"irrigation",title:"Smart Irrigation Kerala",titleMl:"സ്മാർട്ട് ജലസേചനം",     desc:"Summer water conservation & drip tips",   descMl:"ജലസംരക്ഷണം, ഡ്രിപ്പ് ഇറിഗേഷൻ",      icon:"💧", tags:["water","drip"],      src:"https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486612/Summer_smart_irrigation_in_Kerala_do3mo2.mp4",  available:true, keywords:["irrigation","water","ജലസേചനം","drip","summer","വേനൽ","വെള്ളം"] },
  { id:"futureagriculture",title:"Future of Agriculture",titleMl:"കൃഷിയുടെ ഭാവി",desc:"Modern farming & technology in Kerala",   descMl:"ആധുനിക കൃഷി & സാങ്കേതികവിദ്യ",       icon:"🚀", tags:["modern","tech"],     src:"https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486638/The_future_of_agriculture_in_Kerala_jyvrzb.mp4",  available:true, keywords:["modern farming","technology","future","kerala","ഭാവി","ആധുനിക","സാങ്കേതികം"] },
  { id:"banana",   title:"Banana Harvest Guide",    titleMl:"വാഴ കൃഷി മാർഗദർശി",     desc:"Bunch care & harvest timing",             descMl:"കുലക്കരുതൽ, വിളവെടുപ്പ്",             icon:"🍌", tags:["banana","harvest"],  src:"https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486632/A_guide_to_a_bountiful_banana_harvest_jbox9d.mp4", available:true, keywords:["banana","വാഴ","harvest","bunch","കുല","nendran","നേന്ദ്രൻ"] },
];

function detectVideoForMessage(text) {
  const lower = text.toLowerCase();
  return VIDEO_LIBRARY.find(v => v.keywords.some(k => lower.includes(k.toLowerCase()))) || null;
}

// ─── WAV ENCODER ──────────────────────────────────────────────────────────────
function encodeWAV(ab) {
  const sr=ab.sampleRate,len=ab.length,mono=new Float32Array(len);
  for(let ch=0;ch<ab.numberOfChannels;ch++){const d=ab.getChannelData(ch);for(let i=0;i<len;i++)mono[i]+=d[i]/ab.numberOfChannels;}
  const buf=new ArrayBuffer(44+len*2),view=new DataView(buf);
  const ws=(o,str)=>{for(let i=0;i<str.length;i++)view.setUint8(o+i,str.charCodeAt(i));};
  ws(0,"RIFF");view.setUint32(4,36+len*2,true);ws(8,"WAVE");ws(12,"fmt ");
  view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);
  view.setUint32(24,sr,true);view.setUint32(28,sr*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);
  ws(36,"data");view.setUint32(40,len*2,true);
  let off=44;for(let i=0;i<len;i++){const s=Math.max(-1,Math.min(1,mono[i]));view.setInt16(off,s<0?s*0x8000:s*0x7FFF,true);off+=2;}
  return buf;
}
async function toWavBlob(raw){
  try{const ab=await raw.arrayBuffer();const ctx=new(window.AudioContext||window.webkitAudioContext)({sampleRate:16000});const dec=await ctx.decodeAudioData(ab);ctx.close();return{blob:new Blob([encodeWAV(dec)],{type:"audio/wav"}),name:"rec.wav"};}
  catch{const ext=raw.type.includes("ogg")?"ogg":raw.type.includes("mp4")?"mp4":"webm";return{blob:raw,name:`rec.${ext}`};}
}
const getBestMime=()=>["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/ogg","audio/mp4"].find(t=>MediaRecorder.isTypeSupported(t))||"audio/webm";
const b64ToAB=b64=>{const bin=atob(b64),buf=new ArrayBuffer(bin.length),v=new Uint8Array(buf);for(let i=0;i<bin.length;i++)v[i]=bin.charCodeAt(i);return buf;};
const fmtTime=()=>{const d=new Date();return d.getHours().toString().padStart(2,"0")+":"+d.getMinutes().toString().padStart(2,"0");};

// ─── WAVE BARS ────────────────────────────────────────────────────────────────
function WaveBars({state}){
  const barsRef=useRef([]),timerRef=useRef(null);
  useEffect(()=>{
    clearInterval(timerRef.current);const bars=barsRef.current;if(!bars.length)return;
    if(state==="idle"){bars.forEach(b=>{if(b){b.style.height="3px";b.className="ks-wb";}});return;}
    const cls=state==="rec"?"ks-wb rec":state==="speak"?"ks-wb speak":state==="think"?"ks-wb think":"ks-wb active";
    timerRef.current=setInterval(()=>{bars.forEach(b=>{if(!b)return;const h=state==="rec"?Math.random()*28+3:state==="speak"?Math.random()*20+3:Math.random()*12+3;b.style.height=h+"px";b.className=cls;});},90);
    return()=>clearInterval(timerRef.current);
  },[state]);
  return(<div className="ks-wave">{Array.from({length:32},(_,i)=>(<div key={i} className="ks-wb" ref={el=>barsRef.current[i]=el}/>))}</div>);
}

// ─── VIDEO PANEL ──────────────────────────────────────────────────────────────
function VideoPanel({lang,onClose,activeVideoId,onPlayVideo}){
  const videoRef=useRef(null);
  const activeVideo=VIDEO_LIBRARY.find(v=>v.id===activeVideoId)??null;
  useEffect(()=>{if(videoRef.current&&activeVideo?.available){videoRef.current.load();videoRef.current.play().catch(()=>{});}},[activeVideoId]);
  const availableVideos=VIDEO_LIBRARY.filter(v=>v.available);
  const comingSoonVideos=VIDEO_LIBRARY.filter(v=>!v.available);
  return(
    <div className="ks-video-panel">
      <div className="ks-vp-header">
        <div className="ks-vp-title">
          <div className="ks-vp-title-icon">▶</div>
          {lang==="ml"?"വീഡിയോ പഠനം":lang==="hi"?"वीडियो लाइब्रेरी":lang==="bn"?"ভিডিও লাইব্রেরি":lang==="ta"?"வீடியோ நூலகம்":"Video Library"}
        </div>
        <button className="ks-vp-close" onClick={onClose}>✕</button>
      </div>
      {activeVideo?.available&&(
        <div className="ks-vp-player-wrap visible">
          <video ref={videoRef} controls preload="metadata"><source src={activeVideo.src} type="video/mp4"/></video>
          <div className="ks-vp-now-label">
            <span className="ks-vp-now-title">{lang==="ml"?activeVideo.titleMl:activeVideo.title}</span>
            <span className="ks-vp-now-badge">▶ Now Playing</span>
          </div>
        </div>
      )}
      <div className="ks-vp-list">
        {availableVideos.length>0&&(
          <>
            <div className="ks-vp-section"><div className="ks-vp-section-line"/><span className="ks-vp-section-text">{`${availableVideos.length} available`}</span><div className="ks-vp-section-line"/></div>
            {availableVideos.map(vid=>(
              <div key={vid.id} className={`ks-vtopic ${activeVideoId===vid.id?"active":""}`} onClick={()=>onPlayVideo(vid.id)} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&onPlayVideo(vid.id)}>
                <div className="ks-vtopic-icon">{vid.icon}</div>
                <div className="ks-vtopic-meta">
                  <div className="ks-vtopic-title">{lang==="ml"?vid.titleMl:vid.title}</div>
                  <div className="ks-vtopic-subtitle">{lang==="ml"?vid.descMl:vid.desc}</div>
                </div>
                {vid.tags?.length>0&&<div className="ks-vtopic-tags-row">{vid.tags.slice(0,2).map(tag=>(<span key={tag} className="ks-vtopic-tag">{tag}</span>))}</div>}
                <div className="ks-vtopic-action">{activeVideoId===vid.id?"■":"▶"}</div>
              </div>
            ))}
          </>
        )}
        {comingSoonVideos.length>0&&(
          <>
            <div className="ks-vp-section" style={{marginTop:6}}><div className="ks-vp-section-line"/><span className="ks-vp-section-text">Coming soon</span><div className="ks-vp-section-line"/></div>
            {comingSoonVideos.map(vid=>(<div key={vid.id} className="ks-vtopic soon"><div className="ks-vtopic-icon">{vid.icon}</div><div className="ks-vtopic-meta"><div className="ks-vtopic-title">{lang==="ml"?vid.titleMl:vid.title}</div><div className="ks-vtopic-subtitle">{lang==="ml"?vid.descMl:vid.desc}</div></div><span className="ks-vtopic-soon-badge">Soon</span></div>))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Chatbot() {
  const { lang, selectLanguage } = useLanguage();

  const [open, setOpen]               = useState(false);
  const [closing, setClosing]         = useState(false);
  // FIX: use lang from context directly — not localStorage — for welcome message
  const [messages, setMessages]       = useState(() => [{ id:0, role:"bot", text:getWelcome(lang||"en"), ts:fmtTime() }]);
  const [input, setInput]             = useState("");
  const [inputTranslating, setInputTranslating] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [recState, setRecState]       = useState("idle");
  const [isPlaying, setIsPlaying]     = useState(false);
  const [statusKey, setStatusKey]     = useState("idle");
  const [errMsg, setErrMsg]           = useState("");
  const [showChips, setShowChips]     = useState(true);
  const [unread, setUnread]           = useState(0);
  const [showVideos, setShowVideos]   = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const bottomRef   = useRef(null);
  const taRef       = useRef(null);
  const mrRef       = useRef(null);
  const chunksRef   = useRef([]);
  const streamRef   = useRef(null);
  const audioRef    = useRef(null);
  const langRef     = useRef(lang);
  const speakRef    = useRef(null);
  const inputDebRef = useRef(null);

  useEffect(() => { langRef.current = lang; }, [lang]);
  useEffect(() => { injectCSS(); }, []);

  // FIX: Update welcome message when lang changes (using context lang, not localStorage)
  useEffect(() => {
    if (lang) {
      setMessages([{ id:0, role:"bot", text:getWelcome(lang), ts:fmtTime() }]);
      setShowChips(true);
      setInput("");
      setErrMsg("");
    }
  }, [lang]);

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

  const showErr = useCallback(msg => { setErrMsg(msg); setTimeout(() => setErrMsg(""), 6000); }, []);
  const closeWindow = useCallback(() => { setClosing(true); setTimeout(() => { setOpen(false); setClosing(false); }, 220); }, []);
  const handlePlayVideo = useCallback((videoId) => { setActiveVideo(videoId); setShowVideos(true); }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src=""; audioRef.current=null; }
    setIsPlaying(false); setStatusKey("idle");
  }, []);

  const playBuffer = useCallback(buf => {
    stopAudio();
    if (!buf || buf.byteLength === 0) return;
    const url = URL.createObjectURL(new Blob([buf], { type:"audio/mpeg" }));
    const a = new Audio(url);
    audioRef.current = a;
    setIsPlaying(true); setStatusKey("speak");
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
        method:"POST", headers:{ "Content-Type":"application/json" },
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

  const switchLang = useCallback(l => {
    selectLanguage(l);
    setInput(""); setErrMsg(""); setStatusKey("idle"); setShowChips(true);
    stopAudio();
  }, [stopAudio, selectLanguage]);

  // FIX: Input translation — only translate non-native scripts to help backend understand
  // Don't auto-translate the input since user types in their own language
  const handleInputChange = useCallback((e) => {
    const raw = e.target.value;
    setInput(raw);
  }, []);

  // ── Send text — FIX: pass lang instruction to ensure response in correct language ──
  const sendMessage = useCallback(async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading || recState !== "idle") return;
    clearTimeout(inputDebRef.current);
    setInput(""); setShowChips(false);
    const uid = Date.now();
    setMessages(prev => [...prev, { id:uid, role:"user", text, ts:fmtTime() }]);
    setLoading(true); setStatusKey("think");

    const history = messages
      .filter(m => m.id !== 0)
      .map(m => ({ role:m.role==="bot"?"assistant":"user", content:m.text }));

    const currentLang = langRef.current;

    try {
      const res = await fetch(`${BASE}/chat`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          message: text,
          history,
          lang: currentLang,
          // FIX: Explicit system instruction for language enforcement
          systemInstruction: `CRITICAL INSTRUCTION: You MUST respond ONLY in the language with BCP-47 code "${currentLang}". Never switch to English or any other language. If the user writes in English but has selected "${currentLang}", still reply in "${currentLang}" language only. Language code meanings: hi=Hindi, bn=Bengali, ta=Tamil, te=Telugu, kn=Kannada, ml=Malayalam, mr=Marathi, gu=Gujarati, pa=Punjabi, ur=Urdu, en=English.`,
        }),
      });
      if (!res.ok) throw new Error(`Chat ${res.status}`);
      const reply = (await res.json()).reply || "...";
      const suggestedVideo = detectVideoForMessage(text + " " + reply);
      setMessages(prev => [...prev, { id:uid+1, role:"bot", text:reply, ts:fmtTime(), suggestedVideoId:suggestedVideo?.id??null }]);
      setLoading(false); setStatusKey("idle");
      await speakRef.current(reply);
    } catch (e) {
      setMessages(prev => [...prev, { id:uid+1, role:"bot", text:"❌ "+e.message, ts:fmtTime() }]);
      setLoading(false); setStatusKey("idle");
    }
  }, [input, loading, recState, messages]);

  // ── Recording ──
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
      const history = messages.filter(m=>m.id!==0).slice(-6).map(m=>({role:m.role==="bot"?"assistant":"user",content:m.text}));
      const form = new FormData();
      form.append("audio", wavBlob, wavName);
      form.append("lang", langRef.current);
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
          { id:Date.now()+1, role:"bot",  text:replyText, ts:fmtTime(), suggestedVideoId:suggestedVideo?.id??null },
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
    clearTimeout(inputDebRef.current);
    mrRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    stopAudio();
  }, [stopAudio]);

  // ── Derived ──
  const isRec       = recState === "recording";
  const isProc      = recState === "processing";
  const micDisabled = isProc || loading;
  const waveState   = isRec ? "rec" : isPlaying ? "speak" : loading ? "think" : "idle";
  const micCls      = isRec ? "rec" : isProc ? "proc" : isPlaying ? "spk" : "idle";
  const micIcon     = isRec ? "⏹" : isProc ? "⌛" : isPlaying ? "🔊" : "🎙";
  const micLbl      = isRec ? "rec" : isProc ? "proc" : isPlaying ? "spk" : "idle";
  const micLblCls   = isRec ? "rec" : isProc ? "proc" : isPlaying ? "spk" : "";
  const dotCls      = statusKey==="rec"?"rec":statusKey==="speak"?"speak":statusKey==="proc"||statusKey==="think"?"proc":"";
  const st  = STATUS[lang]  || STATUS.en;
  const ml  = MLABELS[lang] || MLABELS.en;
  const chips = getChips(lang);

  // Play again button label per language
  const playAgainLabel = {
    ml:"വീണ്ടും", hi:"फिर सुनें", ta:"மீண்டும்", te:"మళ్ళీ",
    kn:"ಮತ್ತೆ", bn:"আবার", mr:"पुन्हा", gu:"ફરી", pa:"ਫਿਰ", ur:"دوبارہ"
  }[lang] || "play again";

  const playBtn = (text) => (
    <button className="ks-replay" onClick={() => speakText(text)}>
      ▶ {playAgainLabel}
    </button>
  );

  const videoSuggestBtn = (videoId) => {
    const vid = VIDEO_LIBRARY.find(x => x.id === videoId);
    if (!vid) return null;
    return (
      <button className="ks-vid-pill" onClick={() => handlePlayVideo(videoId)}>
        ▶ {lang==="ml" ? vid.titleMl : vid.title}
      </button>
    );
  };

  // Input placeholder per language
  const placeholder = {
    ml:"സന്ദേശം ടൈപ്പ് ചെയ്യുക…",
    hi:"संदेश टाइप करें…",
    ta:"செய்தி தட்டச்சு செய்யுங்கள்…",
    te:"సందేశం టైప్ చేయండి…",
    kn:"ಸಂದೇಶ ಟೈಪ್ ಮಾಡಿ…",
    bn:"বার্তা টাইপ করুন…",
    mr:"संदेश टाइप करा…",
    gu:"સંદેશ ટાઇપ કરો…",
    pa:"ਸੁਨੇਹਾ ਟਾਈਪ ਕਰੋ…",
    ur:"پیغام ٹائپ کریں…",
  }[lang] || "Type a message…";

  // ── RENDER ──
  return (
    <>
      {open && (
        <div className="ks-overlay" onClick={e => { if(e.target.classList.contains("ks-overlay")) closeWindow(); }}>
          <div className="ks-window-wrapper">
            {showVideos && (
              <VideoPanel lang={lang} onClose={() => setShowVideos(false)} activeVideoId={activeVideo} onPlayVideo={handlePlayVideo} />
            )}
            <div className={`ks-window${closing?" closing":""}`}>
              <div className="ks-header">
                <div className="ks-header-orb" />
                <div className={`ks-logo${statusKey!=="idle"?" pulse":""}`}>🌾</div>
                <div className="ks-header-info">
                  <div className="ks-header-name">Krishi Sakhi <span className="ks-badge">AI</span></div>
                  <div className="ks-header-status"><span className={`ks-dot ${dotCls}`} />{st[statusKey]||st.idle}</div>
                </div>
                <button className={`ks-vid-btn ${showVideos?"active":""}`} onClick={() => setShowVideos(v => !v)}>
                  <div className="ks-vid-btn-dot" />
                  {lang==="ml"?"വീഡിയോ":lang==="hi"?"वीडियो":lang==="bn"?"ভিডিও":lang==="ta"?"வீடியோ":"Videos"}
                </button>
                <button className="ks-close" onClick={closeWindow}>✕</button>
              </div>

              <div className="ks-messages">
                {messages.map(m => (
                  <div key={m.id} className={`ks-msg-row ${m.role==="user"?"user":""}`}>
                    <div className={`ks-av ${m.role==="bot"?"bot":"user"}`}>{m.role==="bot"?"🌿":"👤"}</div>
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
                    <div className="ks-typing"><span className="ks-tdot"/><span className="ks-tdot"/><span className="ks-tdot"/></div>
                  </div>
                )}
                <div ref={bottomRef}/>
              </div>

              {showChips && (
                <div className="ks-chips-wrap">
                  <div className="ks-chips-label">
                    {lang==="hi"?"त्वरित प्रश्न":lang==="ml"?"ചോദ്യങ്ങൾ":lang==="bn"?"দ্রুত প্রশ্ন":"Quick questions"}
                  </div>
                  <div className="ks-chips">
                    {chips.map(c => (<button key={c} className="ks-chip" onClick={() => sendMessage(c)}>{c}</button>))}
                  </div>
                </div>
              )}

              {errMsg && <div className="ks-err">⚠ {errMsg}</div>}

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
                    onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording}
                    onTouchStart={startRecording} onTouchEnd={stopRecording} onTouchCancel={stopRecording}
                  >
                    {micIcon}
                  </button>
                  <div className={`ks-mic-label ${micLblCls}`}>{ml[micLbl]}</div>
                </div>
                <div className="ks-div">
                  <div className="ks-divl"/>
                  <span className="ks-divt">
                    {lang==="hi"?"या टाइप करें":lang==="ml"?"അല്ലെങ്കിൽ ടൈപ്പ്":lang==="bn"?"অথবা টাইপ করুন":"or type"}
                  </span>
                  <div className="ks-divl"/>
                </div>
                <div className="ks-input-row">
                  <div className="ks-input-wrap">
                    <textarea
                      ref={taRef}
                      rows={1}
                      className="ks-ta"
                      placeholder={placeholder}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();} }}
                      disabled={loading || recState!=="idle"}
                    />
                    {inputTranslating && <span className="ks-translating-spin">⟳</span>}
                  </div>
                  <button
                    className={`ks-send ${input.trim()&&!loading&&recState==="idle"?"on":"off"}`}
                    onClick={() => sendMessage()}
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
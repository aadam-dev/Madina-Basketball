"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Download, ArrowLeft, RefreshCw, Check } from "lucide-react";

/* ─── Constants ─────────────────────────────────────────────────── */
const SIZE = 1080;

/* ─── Types ─────────────────────────────────────────────────────── */
interface FlyerData {
  eventName: string;
  gameType: "rivalry" | "top4";
  teams: [string, string, string, string];
  date: string;
  time: string;
  venue: string;
  tagline: string;
  showCountdown: boolean;
}

interface LoadedImages {
  hero:    HTMLImageElement | null;
  logo:    HTMLImageElement | null;
  playerA: HTMLImageElement | null;  // optional — Team A featured player
  playerB: HTMLImageElement | null;  // optional — Team B featured player
}

const DEFAULTS: FlyerData = {
  eventName: "Night of Legends",
  gameType: "rivalry",
  teams: ["Madina Old Gees", "Kawukudi Eagles", "Zurak", "TBD"],
  date: "December 27, 2025",
  time: "4:00 PM",
  venue: "Madina Court",
  tagline: "Community Basketball · Accra, Ghana",
  showCountdown: false,
};

const TEMPLATE_NAMES = ["Dark Banger", "Split Court", "Night Gold", "Photo Court"];

/* ─── Announcement types ─────────────────────────────────────────── */
type TierKey = "urgent" | "important" | "notice" | "update" | "celebration";

interface AnnouncementData {
  type: TierKey;
  headline: string;
  body: string;
  date: string;
  cta: string;
}

const ANN_DEFAULTS: AnnouncementData = {
  type: "important",
  headline: "Registration Now Open",
  body: "Season 2 registration is officially open. All players must sign up before the deadline to secure their spot on the court.",
  date: "Deadline: January 15, 2026",
  cta: "Register at madinaball.vercel.app",
};

interface TierConfig { key: TierKey; label: string; color: string; bg: string; dark: boolean; }
const TIERS: TierConfig[] = [
  { key: "urgent",      label: "URGENT NOTICE",  color: "#dc2626", bg: "#120202", dark: false },
  { key: "important",   label: "IMPORTANT",       color: "#ff6b35", bg: "#0d0603", dark: false },
  { key: "notice",      label: "NOTICE",          color: "#3b82f6", bg: "#02050f", dark: false },
  { key: "update",      label: "UPDATE",          color: "#16a34a", bg: "#020a04", dark: false },
  { key: "celebration", label: "CELEBRATION",     color: "#ffd23f", bg: "#0b0800", dark: true  },
];

/* ─── Helpers ────────────────────────────────────────────────────── */
function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxSize: number,
  minSize = 36
): number {
  let size = maxSize;
  ctx.font = `900 ${size}px 'Arial Black', Impact, Arial, sans-serif`;
  while (ctx.measureText(text).width > maxWidth && size > minSize) {
    size -= 4;
    ctx.font = `900 ${size}px 'Arial Black', Impact, Arial, sans-serif`;
  }
  return size;
}

function getCountdown(date: string, time: string): string {
  if (!date) return "";
  try {
    const d = new Date(`${date} ${time || "00:00"}`);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    if (isNaN(diff)) return "";
    if (diff < 0) return "WATCH THE REPLAY";
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days === 0 && hours < 1) return "HAPPENING NOW";
    if (days === 0) return `${hours}H TO TIP-OFF`;
    if (days === 1) return "TOMORROW";
    return `${days} DAYS AWAY`;
  } catch { return ""; }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function countdownBadge(
  ctx: CanvasRenderingContext2D,
  data: FlyerData,
  x: number, y: number,
  color = "#ff6b35", textColor = "#fff"
) {
  if (!data.showCountdown) return;
  const cd = getCountdown(data.date, data.time);
  if (!cd) return;
  ctx.font = "bold 26px Arial, sans-serif";
  const bw = ctx.measureText(cd).width + 48;
  const bh = 50;
  roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 25);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.fillStyle = textColor;
  ctx.font = "bold 24px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(cd, x, y + 9);
}

function coverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number
) {
  const ar = img.width / img.height;
  let sw = w, sh = w / ar;
  let sx = x, sy = y + (h - sh) / 2;
  if (sh < h) { sh = h; sw = h * ar; sx = x + (w - sw) / 2; sy = y; }
  ctx.drawImage(img, sx, sy, sw, sh);
}

/**
 * drawPlayer — NBA-style player silhouette blend.
 * Renders to an off-screen canvas so destination-out fades don't punch holes
 * in the main background, then composites the result onto ctx.
 * fadeDir: which inner edge fades (A fades right toward centre, B fades left).
 */
function drawPlayer(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number,
  fadeDir: "left" | "right"
) {
  const oc = document.createElement("canvas");
  oc.width = w; oc.height = h;
  const oc2 = oc.getContext("2d")!;

  // Cover-fit the player photo into the off-screen canvas
  const ar = img.width / img.height;
  let sw = w, sh = w / ar, sx = 0, sy = (h - sh) / 2;
  if (sh < h) { sh = h; sw = h * ar; sx = (w - sw) / 2; sy = 0; }
  oc2.drawImage(img, sx, sy, sw, sh);

  oc2.globalCompositeOperation = "destination-out";

  // Top fade — head eases in from the top edge
  const topF = oc2.createLinearGradient(0, 0, 0, h * 0.08);
  topF.addColorStop(0, "rgba(0,0,0,1)"); topF.addColorStop(1, "rgba(0,0,0,0)");
  oc2.fillStyle = topF; oc2.fillRect(0, 0, w, h * 0.08);

  // Bottom fade — feet dissolve from ~55 % down
  const botF = oc2.createLinearGradient(0, h * 0.5, 0, h);
  botF.addColorStop(0, "rgba(0,0,0,0)"); botF.addColorStop(1, "rgba(0,0,0,1)");
  oc2.fillStyle = botF; oc2.fillRect(0, h * 0.45, w, h * 0.55);

  // Inner-edge fade — player melts toward the centre divider
  const sideF = fadeDir === "right"
    ? oc2.createLinearGradient(w * 0.52, 0, w, 0)   // A: left panel, fades right
    : oc2.createLinearGradient(w * 0.48, 0, 0, 0);  // B: right panel, fades left
  sideF.addColorStop(0, "rgba(0,0,0,0)"); sideF.addColorStop(1, "rgba(0,0,0,1)");
  oc2.fillStyle = sideF; oc2.fillRect(0, 0, w, h);

  oc2.globalCompositeOperation = "source-over";
  ctx.drawImage(oc, x, y);
}

/* ─── wrapText ───────────────────────────────────────────────────── */
/** Word-wraps text on canvas. Returns the y position of the last line. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, curY);
      line = word + " ";
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, curY);
  return curY;
}

/* ─── Template: Announcement ─────────────────────────────────────── */
function drawAnnouncement(
  ctx: CanvasRenderingContext2D,
  d: AnnouncementData,
  img: LoadedImages
) {
  const W = SIZE, H = SIZE;
  const tier = TIERS.find(t => t.key === d.type) ?? TIERS[1];
  ctx.clearRect(0, 0, W, H);

  /* ── Background ── */
  ctx.fillStyle = tier.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle central radial lift — stops it looking flat
  const lift = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, W * 0.7);
  lift.addColorStop(0, "rgba(255,255,255,0.03)");
  lift.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = lift; ctx.fillRect(0, 0, W, H);

  // Bottom darkening — adds depth
  const bot = ctx.createLinearGradient(0, H * 0.6, 0, H);
  bot.addColorStop(0, "rgba(0,0,0,0)"); bot.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = bot; ctx.fillRect(0, H * 0.6, W, H * 0.4);

  // Celebration: gold star field
  if (d.type === "celebration") {
    [[80,90],[320,60],[780,80],[1000,120],[40,380],[1042,350],
     [155,750],[960,700],[520,40],[260,900],[845,920],[600,980],
     [440,200],[700,160],[190,490],[900,530]].forEach(([sx, sy]) => {
      ctx.fillStyle = "rgba(255,210,63,0.55)"; ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,210,63,0.1)";  ctx.beginPath(); ctx.arc(sx, sy, 9,   0, Math.PI * 2); ctx.fill();
    });
  }

  /* ── Top accent bar ── */
  const topG = ctx.createLinearGradient(0, 0, W, 0);
  topG.addColorStop(0, "transparent"); topG.addColorStop(0.08, tier.color);
  topG.addColorStop(0.92, tier.color); topG.addColorStop(1, "transparent");
  ctx.fillStyle = topG; ctx.fillRect(0, 0, W, 6);

  /* ── Left side accent strip ── */
  const sideG = ctx.createLinearGradient(0, 110, 0, H - 130);
  sideG.addColorStop(0, "rgba(0,0,0,0)"); sideG.addColorStop(0.1, tier.color);
  sideG.addColorStop(0.9, tier.color);    sideG.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sideG; ctx.fillRect(0, 110, 5, H - 240);

  /* ── Header: logo + org name + date ── */
  if (img.logo) ctx.drawImage(img.logo, 48, 28, 60, 60);
  const hx = img.logo ? 124 : 48;
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = "bold 26px Arial, sans-serif"; ctx.textAlign = "left";
  ctx.fillText("MADINA BASKETBALL", hx, 57);
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.font = "18px Arial, sans-serif";
  ctx.fillText("Libya Quarters · Madina · Accra, Ghana", hx, 80);

  if (d.date) {
    ctx.fillStyle = "rgba(255,255,255,0.38)";
    ctx.font = "18px Arial, sans-serif"; ctx.textAlign = "right";
    ctx.fillText(d.date, W - 48, 57);
  }

  // Header rule
  ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(48, 108); ctx.lineTo(W - 48, 108); ctx.stroke();

  /* ── Type badge ── */
  ctx.textAlign = "left";
  ctx.font = "bold 22px Arial, sans-serif";
  const bw = ctx.measureText(tier.label).width + 54;
  const bh = 44, bx = 48, by = 140;
  roundRect(ctx, bx, by, bw, bh, 22);
  ctx.fillStyle = tier.color; ctx.fill();
  // Inner dot
  ctx.fillStyle = tier.dark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.35)";
  ctx.beginPath(); ctx.arc(bx + 22, by + 22, 5, 0, Math.PI * 2); ctx.fill();
  // Text
  ctx.fillStyle = tier.dark ? "#000" : "#fff";
  ctx.font = "bold 22px Arial, sans-serif"; ctx.textAlign = "left";
  ctx.fillText(tier.label, bx + 36, by + 30);

  /* ── Headline ── */
  const headline = (d.headline || "ANNOUNCEMENT").toUpperCase();
  const hlSize = fitText(ctx, headline, W - 96, 112, 52);
  ctx.save();
  if (d.type === "celebration") {
    ctx.shadowColor = "rgba(255,210,63,0.45)"; ctx.shadowBlur = 32;
  } else if (d.type === "urgent") {
    ctx.shadowColor = "rgba(220,38,38,0.35)"; ctx.shadowBlur = 20;
  }
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${hlSize}px 'Arial Black', Impact, Arial, sans-serif`;
  ctx.textAlign = "left"; ctx.fillText(headline, 48, 340);
  ctx.restore();

  // Headline underline — tier colour fading right
  const measured = ctx.measureText(headline);
  ctx.font = `900 ${hlSize}px 'Arial Black', Impact, Arial, sans-serif`;
  const ulW = Math.min(measured.width, W - 96);
  const ulG = ctx.createLinearGradient(48, 0, 48 + ulW * 0.7, 0);
  ulG.addColorStop(0, tier.color); ulG.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = ulG; ctx.fillRect(48, 356, ulW, 4);

  /* ── Body text ── */
  if (d.body) {
    ctx.fillStyle = "rgba(255,255,255,0.68)";
    ctx.font = "30px Arial, sans-serif"; ctx.textAlign = "left";
    wrapText(ctx, d.body, 48, 436, W - 96, 52);
  }

  /* ── CTA line ── */
  if (d.cta) {
    ctx.fillStyle = tier.color;
    ctx.font = "bold 27px Arial, sans-serif"; ctx.textAlign = "left";
    ctx.fillText(d.cta, 48, 642);
  }

  /* ── Footer ── */
  ctx.fillStyle = "rgba(0,0,0,0.52)"; ctx.fillRect(0, H - 124, W, 124);
  // Thin tier-colour top border on footer
  const ftG = ctx.createLinearGradient(0, 0, W, 0);
  ftG.addColorStop(0, "transparent"); ftG.addColorStop(0.05, tier.color);
  ftG.addColorStop(0.95, tier.color); ftG.addColorStop(1, "transparent");
  ctx.fillStyle = ftG; ctx.fillRect(0, H - 124, W, 2);

  // Logo in footer
  if (img.logo) ctx.drawImage(img.logo, 48, H - 100, 44, 44);
  const flx = img.logo ? 104 : 48;
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "bold 19px Arial, sans-serif"; ctx.textAlign = "left";
  ctx.fillText("Madina Basketball", flx, H - 74);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "17px Arial, sans-serif";
  ctx.fillText("Libya Quarters, Accra", flx, H - 50);

  // Website — centre
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.font = "17px Arial, sans-serif"; ctx.textAlign = "center";
  ctx.fillText("madinaball.vercel.app", W / 2, H - 74);
  ctx.fillStyle = tier.color;
  ctx.font = "bold 20px Arial, sans-serif";
  ctx.fillText("@madinabball", W / 2, H - 48);

  // Social — right
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "17px Arial, sans-serif"; ctx.textAlign = "right";
  ctx.fillText("Follow us", W - 48, H - 74);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "bold 19px Arial, sans-serif";
  ctx.fillText("IG · FB · WhatsApp", W - 48, H - 48);
}

/* ─── Template 1: Dark Banger ────────────────────────────────────── */
function drawBanger(ctx: CanvasRenderingContext2D, d: FlyerData, img: LoadedImages) {
  const W = SIZE, H = SIZE;
  ctx.clearRect(0, 0, W, H);

  // Base bg
  ctx.fillStyle = "#090909";
  ctx.fillRect(0, 0, W, H);

  // Stage floor — court photo only in bottom 44%, heavily colour-graded
  if (img.hero) {
    ctx.save();
    ctx.beginPath(); ctx.rect(0, H * 0.56, W, H * 0.44); ctx.clip();
    ctx.filter = "brightness(0.28) saturate(0.42) contrast(0.95)";
    coverImage(ctx, img.hero, 0, H * 0.56, W, H * 0.44);
    ctx.filter = "none";
    ctx.restore();
    // Fade the photo zone into the dark background above
    const fade = ctx.createLinearGradient(0, H * 0.56, 0, H * 0.72);
    fade.addColorStop(0, "rgba(9,9,9,1)"); fade.addColorStop(1, "rgba(9,9,9,0)");
    ctx.fillStyle = fade; ctx.fillRect(0, H * 0.56, W, H * 0.17);
  }

  // Subtle grid
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Orange diagonal slabs
  ctx.save();
  ctx.globalAlpha = 0.11;
  ctx.fillStyle = "#ff6b35";
  ctx.beginPath(); ctx.moveTo(-60, 350); ctx.lineTo(260, 350); ctx.lineTo(120, H + 60); ctx.lineTo(-60, H + 60); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 0.08;
  ctx.beginPath(); ctx.moveTo(W + 60, 250); ctx.lineTo(W - 180, 250); ctx.lineTo(W - 50, H + 60); ctx.lineTo(W + 60, H + 60); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();

  // Player silhouettes (rivalry only, optional)
  if (d.gameType === "rivalry") {
    if (img.playerA) drawPlayer(ctx, img.playerA,   0, 220, 480, 680, "right");
    if (img.playerB) drawPlayer(ctx, img.playerB, 600, 220, 480, 680, "left");
  }

  // Top accent line
  const tg = ctx.createLinearGradient(0, 0, W, 0);
  tg.addColorStop(0, "transparent"); tg.addColorStop(0.15, "#ff6b35");
  tg.addColorStop(0.85, "#ff6b35"); tg.addColorStop(1, "transparent");
  ctx.fillStyle = tg; ctx.fillRect(0, 0, W, 5);

  // Logo + branding top-left
  if (img.logo) { ctx.drawImage(img.logo, 52, 46, 76, 76); }
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "bold 24px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("MADINA BASKETBALL", img.logo ? 144 : 60, 78);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "18px Arial, sans-serif";
  ctx.fillText("Libya Quarters · Madina · Accra", img.logo ? 144 : 60, 106);

  // Countdown badge top-right
  if (d.showCountdown) countdownBadge(ctx, d, W - 160, 80);

  if (d.gameType === "rivalry") {
    // Event name
    ctx.fillStyle = "#ff6b35";
    ctx.font = "bold 58px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d.eventName.toUpperCase(), W / 2, 240);
    ctx.strokeStyle = "rgba(255,107,53,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(W / 2 - 230, 262); ctx.lineTo(W / 2 + 230, 262); ctx.stroke();

    // Team A
    const sA = fitText(ctx, (d.teams[0] || "TEAM A").toUpperCase(), W - 90, 155, 60);
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${sA}px 'Arial Black', Impact, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText((d.teams[0] || "TEAM A").toUpperCase(), W / 2, 430);

    // VS
    ctx.fillStyle = "#ff6b35";
    ctx.font = "900 88px 'Arial Black', Impact, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VS", W / 2, 540);

    // Team B
    const sB = fitText(ctx, (d.teams[1] || "TEAM B").toUpperCase(), W - 90, 155, 60);
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${sB}px 'Arial Black', Impact, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText((d.teams[1] || "TEAM B").toUpperCase(), W / 2, 700);
  } else {
    // TOP 4 layout
    ctx.fillStyle = "#ff6b35";
    ctx.font = "bold 58px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d.eventName.toUpperCase(), W / 2, 210);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "bold 28px Arial, sans-serif";
    ctx.fillText("TOP 4 · SEMI-FINALS", W / 2, 252);

    // Semi 1
    ctx.fillStyle = "rgba(255,107,53,0.12)";
    roundRect(ctx, 60, 295, W - 120, 88, 14); ctx.fill();
    ctx.strokeStyle = "rgba(255,107,53,0.3)"; ctx.lineWidth = 1.5;
    roundRect(ctx, 60, 295, W - 120, 88, 14); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "bold 20px Arial, sans-serif"; ctx.textAlign = "left";
    ctx.fillText("SEMI 1", 88, 326);
    const sS1A = fitText(ctx, (d.teams[0] || "TEAM A").toUpperCase(), 340, 66, 36);
    ctx.fillStyle = "#fff"; ctx.font = `900 ${sS1A}px 'Arial Black', Impact, Arial, sans-serif`;
    ctx.textAlign = "center"; ctx.fillText((d.teams[0] || "TEAM A").toUpperCase(), 310, 362);
    ctx.fillStyle = "#ff6b35"; ctx.font = "900 42px 'Arial Black', Impact, Arial, sans-serif";
    ctx.textAlign = "center"; ctx.fillText("VS", W / 2, 362);
    const sS1B = fitText(ctx, (d.teams[1] || "TEAM B").toUpperCase(), 340, 66, 36);
    ctx.fillStyle = "#fff"; ctx.font = `900 ${sS1B}px 'Arial Black', Impact, Arial, sans-serif`;
    ctx.textAlign = "center"; ctx.fillText((d.teams[1] || "TEAM B").toUpperCase(), 770, 362);

    // Semi 2
    ctx.fillStyle = "rgba(0,78,137,0.12)";
    roundRect(ctx, 60, 415, W - 120, 88, 14); ctx.fill();
    ctx.strokeStyle = "rgba(0,78,137,0.35)"; ctx.lineWidth = 1.5;
    roundRect(ctx, 60, 415, W - 120, 88, 14); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "bold 20px Arial, sans-serif"; ctx.textAlign = "left";
    ctx.fillText("SEMI 2", 88, 446);
    const sS2A = fitText(ctx, (d.teams[2] || "TEAM C").toUpperCase(), 340, 66, 36);
    ctx.fillStyle = "#fff"; ctx.font = `900 ${sS2A}px 'Arial Black', Impact, Arial, sans-serif`;
    ctx.textAlign = "center"; ctx.fillText((d.teams[2] || "TEAM C").toUpperCase(), 310, 482);
    ctx.fillStyle = "#004e89"; ctx.font = "900 42px 'Arial Black', Impact, Arial, sans-serif";
    ctx.fillText("VS", W / 2, 482);
    const sS2B = fitText(ctx, (d.teams[3] || "TEAM D").toUpperCase(), 340, 66, 36);
    ctx.fillStyle = "#fff"; ctx.font = `900 ${sS2B}px 'Arial Black', Impact, Arial, sans-serif`;
    ctx.textAlign = "center"; ctx.fillText((d.teams[3] || "TEAM D").toUpperCase(), 770, 482);

    // Final teaser
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    roundRect(ctx, 200, 536, W - 400, 62, 12); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "bold 26px Arial, sans-serif";
    ctx.textAlign = "center"; ctx.fillText("FINAL · WINNER TAKES ALL", W / 2, 576);
  }

  // Divider + details
  const dY = d.gameType === "rivalry" ? 760 : 640;
  ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, dY); ctx.lineTo(W - 80, dY); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.88)"; ctx.font = "bold 44px Arial, sans-serif"; ctx.textAlign = "center";
  ctx.fillText(d.date, W / 2, dY + 70);
  ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.font = "32px Arial, sans-serif";
  ctx.fillText(`${d.time}  ·  ${d.venue}`, W / 2, dY + 124);
  if (d.tagline) { ctx.fillStyle = "rgba(255,107,53,0.6)"; ctx.font = "italic 26px Arial, sans-serif"; ctx.fillText(d.tagline, W / 2, dY + 172); }

  // Bottom bar
  ctx.fillStyle = "#ff6b35"; ctx.fillRect(0, H - 70, W, 70);
  ctx.fillStyle = "#000"; ctx.font = "bold 24px Arial, sans-serif"; ctx.textAlign = "center";
  ctx.fillText("MADINA BASKETBALL  ·  LIBYA QUARTERS, MADINA  ·  ACCRA, GHANA", W / 2, H - 18);
}

/* ─── Template 2: Split Court ─────────────────────────────────────── */
function drawSplit(ctx: CanvasRenderingContext2D, d: FlyerData, img: LoadedImages) {
  const W = SIZE, H = SIZE;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#080808"; ctx.fillRect(0, 0, W, H);

  // Court texture under coloured zones — dark + desaturated so zones read clearly
  if (img.hero) {
    ctx.save();
    ctx.filter = "brightness(0.2) saturate(0.35) contrast(1.05)";
    coverImage(ctx, img.hero, 0, 0, W, H);
    ctx.filter = "none";
    ctx.restore();
  }

  // Player silhouettes sit between the court texture and the colour zones
  if (d.gameType === "rivalry") {
    if (img.playerA) drawPlayer(ctx, img.playerA,   0, 200, 450, 650, "right");
    if (img.playerB) drawPlayer(ctx, img.playerB, 630, 200, 450, 650, "left");
  }

  if (d.gameType === "rivalry") {
    // Left orange zone
    ctx.save();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W * 0.52, 0); ctx.lineTo(W * 0.48, H); ctx.lineTo(0, H); ctx.closePath();
    const lg = ctx.createLinearGradient(0, 0, W * 0.5, 0);
    lg.addColorStop(0, "rgba(255,107,53,0.38)"); lg.addColorStop(1, "rgba(255,107,53,0.06)");
    ctx.fillStyle = lg; ctx.fill(); ctx.restore();

    // Right blue zone
    ctx.save();
    ctx.beginPath(); ctx.moveTo(W * 0.52, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(W * 0.48, H); ctx.closePath();
    const rg = ctx.createLinearGradient(W * 0.5, 0, W, 0);
    rg.addColorStop(0, "rgba(0,78,137,0.06)"); rg.addColorStop(1, "rgba(0,78,137,0.38)");
    ctx.fillStyle = rg; ctx.fill(); ctx.restore();

    // Diagonal divider
    ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W * 0.52, 0); ctx.lineTo(W * 0.48, H); ctx.stroke();

    // VS circle
    const cx = W / 2, cy = H * 0.515;
    ctx.beginPath(); ctx.arc(cx, cy, 76, 0, Math.PI * 2);
    ctx.fillStyle = "#0a0a0a"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#ff6b35"; ctx.font = "900 68px 'Arial Black', Impact, Arial, sans-serif";
    ctx.textAlign = "center"; ctx.fillText("VS", cx, cy + 24);

    // Event name
    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = "bold 54px Arial, sans-serif";
    ctx.textAlign = "center"; ctx.fillText(d.eventName.toUpperCase(), W / 2, 140);
    ctx.strokeStyle = "#ff6b35"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(W / 2 - 210, 160); ctx.lineTo(W / 2 - 24, 160); ctx.stroke();
    ctx.strokeStyle = "#004e89";
    ctx.beginPath(); ctx.moveTo(W / 2 + 24, 160); ctx.lineTo(W / 2 + 210, 160); ctx.stroke();

    // Team A (left)
    const sA = fitText(ctx, (d.teams[0] || "TEAM A").toUpperCase(), W * 0.44 - 30, 110, 44);
    ctx.fillStyle = "#fff"; ctx.font = `900 ${sA}px 'Arial Black', Impact, Arial, sans-serif`;
    ctx.textAlign = "center"; ctx.fillText((d.teams[0] || "TEAM A").toUpperCase(), W * 0.24, cy - 10);
    ctx.fillStyle = "#ff6b35"; ctx.font = "bold 20px Arial, sans-serif";
    ctx.fillText("■", W * 0.24, cy + 36);

    // Team B (right)
    const sB = fitText(ctx, (d.teams[1] || "TEAM B").toUpperCase(), W * 0.44 - 30, 110, 44);
    ctx.fillStyle = "#fff"; ctx.font = `900 ${sB}px 'Arial Black', Impact, Arial, sans-serif`;
    ctx.textAlign = "center"; ctx.fillText((d.teams[1] || "TEAM B").toUpperCase(), W * 0.76, cy - 10);
    ctx.fillStyle = "#004e89"; ctx.font = "bold 20px Arial, sans-serif";
    ctx.fillText("■", W * 0.76, cy + 36);
  } else {
    // Top 4: 4 quadrants
    ctx.fillStyle = "rgba(255,107,53,0.14)"; ctx.fillRect(0, 0, W / 2, H / 2);
    ctx.fillStyle = "rgba(0,78,137,0.14)"; ctx.fillRect(W / 2, 0, W / 2, H / 2);
    ctx.fillStyle = "rgba(0,78,137,0.10)"; ctx.fillRect(0, H / 2, W / 2, H / 2);
    ctx.fillStyle = "rgba(255,107,53,0.10)"; ctx.fillRect(W / 2, H / 2, W / 2, H / 2);
    ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();

    const colors = ["#ff6b35", "#004e89", "#004e89", "#ff6b35"];
    const qx = [W * 0.25, W * 0.75, W * 0.25, W * 0.75];
    const qy = [H * 0.3, H * 0.3, H * 0.72, H * 0.72];
    const teams4 = [...d.teams].slice(0, 4);
    teams4.forEach((t, i) => {
      const name = (t || `TEAM ${i + 1}`).toUpperCase();
      const ts = fitText(ctx, name, W / 2 - 60, 96, 40);
      ctx.fillStyle = "#fff"; ctx.font = `900 ${ts}px 'Arial Black', Impact, Arial, sans-serif`;
      ctx.textAlign = "center"; ctx.fillText(name, qx[i], qy[i]);
      ctx.fillStyle = colors[i]; ctx.font = "bold 22px Arial, sans-serif";
      ctx.fillText(`TEAM ${i + 1}`, qx[i], qy[i] + 38);
    });

    // Center badge
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 64, 0, Math.PI * 2);
    ctx.fillStyle = "#0a0a0a"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#ff6b35"; ctx.font = "bold 22px Arial, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("TOP", W / 2, H / 2 - 4); ctx.fillText("4", W / 2, H / 2 + 26);

    ctx.fillStyle = "#fff"; ctx.font = "bold 52px Arial, sans-serif";
    ctx.textAlign = "center"; ctx.fillText(d.eventName.toUpperCase(), W / 2, 96);
  }

  // Bottom strip
  ctx.fillStyle = "rgba(0,0,0,0.65)"; ctx.fillRect(0, H - 170, W, 170);
  ctx.fillStyle = "rgba(255,255,255,0.88)"; ctx.font = "bold 40px Arial, sans-serif"; ctx.textAlign = "center";
  ctx.fillText(d.date, W / 2, H - 114);
  ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "30px Arial, sans-serif";
  ctx.fillText(`${d.time}  ·  ${d.venue}`, W / 2, H - 68);
  if (d.showCountdown) countdownBadge(ctx, d, W / 2, H - 24, "#ff6b35");
  if (img.logo) { ctx.drawImage(img.logo, W - 88, H - 166, 64, 64); }
}

/* ─── Template 3: Night Gold ─────────────────────────────────────── */
function drawGold(ctx: CanvasRenderingContext2D, d: FlyerData, img: LoadedImages) {
  const W = SIZE, H = SIZE;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#030912"; ctx.fillRect(0, 0, W, H);

  // Court photo — bottom half only, cool night treatment (hue-rotated blue-teal)
  if (img.hero) {
    ctx.save();
    ctx.beginPath(); ctx.rect(0, H * 0.48, W, H * 0.52); ctx.clip();
    ctx.filter = "brightness(0.15) saturate(0.28) hue-rotate(195deg) contrast(0.9)";
    coverImage(ctx, img.hero, 0, H * 0.48, W, H * 0.52);
    ctx.filter = "none";
    ctx.restore();
    // Fade top of photo zone into deep bg
    const fade = ctx.createLinearGradient(0, H * 0.48, 0, H * 0.64);
    fade.addColorStop(0, "rgba(3,9,18,1)"); fade.addColorStop(1, "rgba(3,9,18,0)");
    ctx.fillStyle = fade; ctx.fillRect(0, H * 0.48, W, H * 0.16);
    // Subtle overall tint to blend any colour fringing
    ctx.fillStyle = "rgba(3,9,18,0.28)"; ctx.fillRect(0, H * 0.48, W, H * 0.52);
  }

  // Star sparkles
  [[120,160],[290,80],[820,130],[960,210],[55,470],[1025,490],[190,860],[910,810],[545,55],[435,985],[700,40],[140,600]].forEach(([sx, sy]) => {
    ctx.fillStyle = "rgba(255,210,63,0.7)"; ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,210,63,0.15)"; ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.fill();
  });

  // Gold top/bottom lines
  const gg = ctx.createLinearGradient(0, 0, W, 0);
  gg.addColorStop(0, "transparent"); gg.addColorStop(0.2, "#ffd23f"); gg.addColorStop(0.8, "#ffd23f"); gg.addColorStop(1, "transparent");
  ctx.fillStyle = gg; ctx.fillRect(0, 0, W, 4); ctx.fillRect(0, H - 4, W, 4);

  // Corner brackets
  [[0, 0, 1, 1], [W, 0, -1, 1], [0, H, 1, -1], [W, H, -1, -1]].forEach(([cx, cy, dx, dy]) => {
    ctx.strokeStyle = "rgba(255,210,63,0.35)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx + dx * 65, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * 65); ctx.stroke();
  });

  // Player silhouettes (rivalry only, optional)
  if (d.gameType === "rivalry") {
    if (img.playerA) drawPlayer(ctx, img.playerA,   0, 220, 470, 650, "right");
    if (img.playerB) drawPlayer(ctx, img.playerB, 610, 220, 470, 650, "left");
  }

  // Logo + branding
  if (img.logo) { ctx.drawImage(img.logo, W / 2 - 42, 55, 84, 84); }
  ctx.fillStyle = "rgba(255,210,63,0.75)"; ctx.font = "bold 26px Arial, sans-serif"; ctx.textAlign = "center";
  ctx.fillText("MADINA BASKETBALL", W / 2, img.logo ? 170 : 120);
  ctx.strokeStyle = "rgba(255,210,63,0.3)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W / 2 - 190, img.logo ? 184 : 134); ctx.lineTo(W / 2 + 190, img.logo ? 184 : 134); ctx.stroke();

  // Countdown
  if (d.showCountdown) countdownBadge(ctx, d, W - 160, 75, "#ffd23f", "#000");

  const eY = img.logo ? 265 : 215;
  ctx.fillStyle = "#fff"; ctx.font = "bold 62px Arial, sans-serif"; ctx.textAlign = "center";
  ctx.fillText(d.eventName.toUpperCase(), W / 2, eY);

  if (d.gameType === "rivalry") {
    const sA = fitText(ctx, (d.teams[0] || "TEAM A").toUpperCase(), W - 90, 148, 60);
    ctx.fillStyle = "#ffd23f"; ctx.font = `900 ${sA}px 'Arial Black', Impact, Arial, sans-serif`;
    ctx.textAlign = "center"; ctx.fillText((d.teams[0] || "TEAM A").toUpperCase(), W / 2, eY + 168);

    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "900 64px 'Arial Black', Impact, Arial, sans-serif";
    ctx.textAlign = "center"; ctx.fillText("VS", W / 2, eY + 270);

    const sB = fitText(ctx, (d.teams[1] || "TEAM B").toUpperCase(), W - 90, 148, 60);
    ctx.fillStyle = "#ffffff"; ctx.font = `900 ${sB}px 'Arial Black', Impact, Arial, sans-serif`;
    ctx.textAlign = "center"; ctx.fillText((d.teams[1] || "TEAM B").toUpperCase(), W / 2, eY + 408);
  } else {
    const teams4 = [...d.teams].slice(0, 4);
    teams4.forEach((t, i) => {
      const name = (t || `TEAM ${i + 1}`).toUpperCase();
      const ty = eY + 110 + i * 148;
      const ts = fitText(ctx, name, W - 110, 108, 48);
      ctx.fillStyle = i % 2 === 0 ? "#ffd23f" : "#ffffff";
      ctx.font = `900 ${ts}px 'Arial Black', Impact, Arial, sans-serif`; ctx.textAlign = "center"; ctx.fillText(name, W / 2, ty);
      if (i < 3) { ctx.strokeStyle = "rgba(255,210,63,0.13)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(180, ty + 28); ctx.lineTo(W - 180, ty + 28); ctx.stroke(); }
    });
  }

  // Bottom details
  const dY = H - 220;
  ctx.strokeStyle = "rgba(255,210,63,0.25)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(100, dY); ctx.lineTo(W - 100, dY); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.font = "bold 40px Arial, sans-serif"; ctx.textAlign = "center";
  ctx.fillText(d.date, W / 2, dY + 60);
  ctx.fillStyle = "rgba(255,210,63,0.6)"; ctx.font = "30px Arial, sans-serif";
  ctx.fillText(`${d.time}  ·  ${d.venue}`, W / 2, dY + 108);
  if (d.tagline) { ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "italic 26px Arial, sans-serif"; ctx.fillText(d.tagline, W / 2, dY + 152); }
}

/* ─── Template 4: Photo Court ─────────────────────────────────────── */
function drawPhoto(ctx: CanvasRenderingContext2D, d: FlyerData, img: LoadedImages) {
  const W = SIZE, H = SIZE;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#050505"; ctx.fillRect(0, 0, W, H);

  if (img.hero) {
    // Colour-graded photo — slightly warm, punchy contrast
    ctx.save();
    ctx.filter = "brightness(0.74) contrast(1.14) saturate(0.82)";
    coverImage(ctx, img.hero, 0, 0, W, H);
    ctx.filter = "none";
    ctx.restore();

    // Warm orange screen blend — adds brand atmosphere without muddying shadows
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = "rgba(255,107,53,0.055)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();

    // Radial vignette — pulls focus to centre, darkens corners
    const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.26, W / 2, H / 2, W * 0.76);
    vig.addColorStop(0, "rgba(5,5,5,0)"); vig.addColorStop(1, "rgba(5,5,5,0.86)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

    // Top text-zone gradient (branding area stays legible)
    const topG = ctx.createLinearGradient(0, 0, 0, 150);
    topG.addColorStop(0, "rgba(5,5,5,0.9)"); topG.addColorStop(1, "rgba(5,5,5,0)");
    ctx.fillStyle = topG; ctx.fillRect(0, 0, W, 150);

    // Bottom text-zone gradient (date / venue block)
    const botG = ctx.createLinearGradient(0, H - 280, 0, H);
    botG.addColorStop(0, "rgba(5,5,5,0)"); botG.addColorStop(1, "rgba(5,5,5,0.97)");
    ctx.fillStyle = botG; ctx.fillRect(0, H - 280, W, 280);
  }

  // Player silhouettes — drawn before glow so brand light sits on top of them
  if (d.gameType === "rivalry") {
    if (img.playerA) drawPlayer(ctx, img.playerA,   0, 180, 490, 700, "right");
    if (img.playerB) drawPlayer(ctx, img.playerB, 590, 180, 490, 700, "left");
  }

  // Orange centre glow
  const rg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 420);
  rg.addColorStop(0, "rgba(255,107,53,0.09)"); rg.addColorStop(1, "transparent");
  ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);

  // Top branding bar
  ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, W, 108);
  if (img.logo) {
    ctx.drawImage(img.logo, 48, 16, 76, 76);
    ctx.fillStyle = "#fff"; ctx.font = "bold 28px Arial, sans-serif"; ctx.textAlign = "left";
    ctx.fillText("MADINA BASKETBALL", 140, 52);
    ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "20px Arial, sans-serif";
    ctx.fillText("Libya Quarters · Madina · Accra, Ghana", 140, 80);
  } else {
    ctx.fillStyle = "#fff"; ctx.font = "bold 32px Arial, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("MADINA BASKETBALL", W / 2, 62);
  }
  if (d.showCountdown) countdownBadge(ctx, d, W - 156, 58);

  // Event name
  ctx.fillStyle = "#ff6b35"; ctx.font = "bold 62px Arial, sans-serif"; ctx.textAlign = "center";
  ctx.fillText(d.eventName.toUpperCase(), W / 2, 228);
  ctx.strokeStyle = "rgba(255,107,53,0.5)"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W / 2 - 230, 250); ctx.lineTo(W / 2 + 230, 250); ctx.stroke();

  if (d.gameType === "rivalry") {
    ctx.save();
    const sA = fitText(ctx, (d.teams[0] || "TEAM A").toUpperCase(), W - 80, 165, 70);
    ctx.shadowColor = "rgba(0,0,0,0.9)"; ctx.shadowBlur = 24;
    ctx.fillStyle = "#ffffff"; ctx.font = `900 ${sA}px 'Arial Black', Impact, Arial, sans-serif`;
    ctx.textAlign = "center"; ctx.fillText((d.teams[0] || "TEAM A").toUpperCase(), W / 2, 436);
    ctx.shadowColor = "rgba(255,107,53,0.8)"; ctx.shadowBlur = 30;
    ctx.fillStyle = "#ff6b35"; ctx.font = "900 96px 'Arial Black', Impact, Arial, sans-serif";
    ctx.fillText("VS", W / 2, 558);
    ctx.shadowColor = "rgba(0,0,0,0.9)"; ctx.shadowBlur = 24;
    const sB = fitText(ctx, (d.teams[1] || "TEAM B").toUpperCase(), W - 80, 165, 70);
    ctx.fillStyle = "#ffffff"; ctx.font = `900 ${sB}px 'Arial Black', Impact, Arial, sans-serif`;
    ctx.fillText((d.teams[1] || "TEAM B").toUpperCase(), W / 2, 712);
    ctx.restore();
  } else {
    ctx.save();
    const teams4 = [...d.teams].slice(0, 4);
    const startY = 360;
    teams4.forEach((t, i) => {
      const name = (t || `TEAM ${i + 1}`).toUpperCase();
      ctx.shadowColor = "rgba(0,0,0,0.9)"; ctx.shadowBlur = 20;
      const ts = fitText(ctx, name, W - 90, 118, 52);
      ctx.fillStyle = i % 2 === 0 ? "#fff" : "#ff6b35";
      ctx.font = `900 ${ts}px 'Arial Black', Impact, Arial, sans-serif`;
      ctx.textAlign = "center"; ctx.fillText(name, W / 2, startY + i * 130);
    });
    ctx.restore();
  }

  // Bottom details
  ctx.fillStyle = "rgba(0,0,0,0.72)"; ctx.fillRect(0, H - 168, W, 168);
  ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = "bold 42px Arial, sans-serif"; ctx.textAlign = "center";
  ctx.fillText(d.date, W / 2, H - 114);
  ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "30px Arial, sans-serif";
  ctx.fillText(`${d.time}  ·  ${d.venue}`, W / 2, H - 66);
  if (d.tagline) { ctx.fillStyle = "rgba(255,107,53,0.7)"; ctx.font = "italic 26px Arial, sans-serif"; ctx.fillText(d.tagline, W / 2, H - 24); }
}

/* ─── Draw functions array ────────────────────────────────────────── */
const DRAWERS = [drawBanger, drawSplit, drawGold, drawPhoto];

/* ─── Page Component ─────────────────────────────────────────────── */
type Mode = "game" | "announcement";

export default function FlyerPage() {
  const [mode, setMode]       = useState<Mode>("game");
  const [data, setData]       = useState<FlyerData>(DEFAULTS);
  const [annData, setAnnData] = useState<AnnouncementData>(ANN_DEFAULTS);
  const [images, setImages]   = useState<LoadedImages>({ hero: null, logo: null, playerA: null, playerB: null });
  const [previews,    setPreviews]    = useState<string[]>(["", "", "", ""]);
  const [annPreviews, setAnnPreviews] = useState<string[]>(["", "", "", "", ""]);
  const [selected,    setSelected]    = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [playerPreviews, setPlayerPreviews] = useState<[string | null, string | null]>([null, null]);
  const renderRef = useRef(0);
  const playerUrlRef = useRef<[string | null, string | null]>([null, null]);
  const playerInputRef0 = useRef<HTMLInputElement>(null);
  const playerInputRef1 = useRef<HTMLInputElement>(null);
  const playerInputRefs = [playerInputRef0, playerInputRef1] as const;

  // Load static images once
  useEffect(() => {
    Promise.all([
      loadImg("/images/journey/after/completed-evening.jpg").catch(() => null),
      loadImg("/images/logo/madina-basketball-logo.png").catch(() => null),
    ]).then(([hero, logo]) => setImages(prev => ({ ...prev, hero, logo })));
  }, []);

  // Player file pick handler
  const handlePlayerFile = useCallback((idx: 0 | 1, file: File | null) => {
    // Revoke previous object URL to free memory
    if (playerUrlRef.current[idx]) {
      URL.revokeObjectURL(playerUrlRef.current[idx]!);
      playerUrlRef.current[idx] = null;
    }
    if (!file) return;
    const url = URL.createObjectURL(file);
    playerUrlRef.current[idx] = url;
    setPlayerPreviews(p => { const n = [...p] as [string | null, string | null]; n[idx] = url; return n; });
    loadImg(url)
      .then(img => setImages(prev => ({ ...prev, [idx === 0 ? "playerA" : "playerB"]: img })))
      .catch(() => {/* silently ignore bad files */});
  }, []);

  const clearPlayer = useCallback((idx: 0 | 1) => {
    if (playerUrlRef.current[idx]) {
      URL.revokeObjectURL(playerUrlRef.current[idx]!);
      playerUrlRef.current[idx] = null;
    }
    setPlayerPreviews(p => { const n = [...p] as [string | null, string | null]; n[idx] = null; return n; });
    setImages(prev => ({ ...prev, [idx === 0 ? "playerA" : "playerB"]: null }));
    const ref = [playerInputRef0, playerInputRef1][idx];
    if (ref.current) ref.current.value = "";
  }, []);

  // Re-render all 4 game previews on change
  const renderPreviews = useCallback(() => {
    const id = ++renderRef.current;
    requestAnimationFrame(() => {
      if (id !== renderRef.current) return;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE; canvas.height = SIZE;
      const ctx = canvas.getContext("2d")!;
      const urls = DRAWERS.map(draw => {
        ctx.clearRect(0, 0, SIZE, SIZE);
        draw(ctx, data, images);
        return canvas.toDataURL("image/png");
      });
      setPreviews(urls);
    });
  }, [data, images]);

  // Re-render all 5 announcement tier previews on change
  const renderAnnPreviews = useCallback(() => {
    const id = ++renderRef.current;
    requestAnimationFrame(() => {
      if (id !== renderRef.current) return;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE; canvas.height = SIZE;
      const ctx = canvas.getContext("2d")!;
      const urls = TIERS.map(tier => {
        ctx.clearRect(0, 0, SIZE, SIZE);
        drawAnnouncement(ctx, { ...annData, type: tier.key }, images);
        return canvas.toDataURL("image/png");
      });
      setAnnPreviews(urls);
    });
  }, [annData, images]);

  useEffect(() => { if (mode === "game")         renderPreviews();    }, [renderPreviews,    mode]);
  useEffect(() => { if (mode === "announcement") renderAnnPreviews(); }, [renderAnnPreviews, mode]);
  // Re-render whichever mode is active when images first load
  useEffect(() => { renderPreviews(); renderAnnPreviews(); }, [images]); // eslint-disable-line react-hooks/exhaustive-deps

  const download = () => {
    setDownloading(true);
    const canvas = document.createElement("canvas");
    canvas.width = SIZE; canvas.height = SIZE;
    const ctx = canvas.getContext("2d")!;
    if (mode === "game") {
      DRAWERS[selected](ctx, data, images);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${data.eventName.toLowerCase().replace(/\s+/g, "-")}-flyer.png`;
      a.click();
    } else {
      drawAnnouncement(ctx, annData, images);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `madina-${annData.type}-${annData.headline.toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
    }
    setTimeout(() => setDownloading(false), 1200);
  };

  const set = (key: keyof FlyerData, val: unknown) =>
    setData(prev => ({ ...prev, [key]: val }));
  const setTeam = (i: number, val: string) =>
    setData(prev => { const t = [...prev.teams] as FlyerData["teams"]; t[i] = val; return { ...prev, teams: t }; });
  const setAnn = (key: keyof AnnouncementData, val: string) =>
    setAnnData(prev => ({ ...prev, [key]: val }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Header ── */}
      <div className="border-b border-white/8 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/tools" className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Tools
            </Link>
            <div className="w-px h-4 bg-white/15" />
            <div>
              <h1 className="text-white font-black text-base uppercase tracking-tight">Flyer Generator</h1>
              <p className="text-white/35 text-xs">Game posters &amp; official announcements</p>
            </div>
          </div>
          <button
            onClick={download}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#ff6b35] text-white text-sm font-bold rounded-xl hover:bg-[#e55a2b] transition-colors uppercase tracking-wider disabled:opacity-60"
          >
            {downloading
              ? <><Check className="w-4 h-4" /> Saved!</>
              : <><Download className="w-4 h-4" /> Download PNG</>
            }
          </button>
        </div>

        {/* ── Mode tabs ── */}
        <div className="container mx-auto px-6 lg:px-8 pb-0 flex gap-1">
          {(["game", "announcement"] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-t-xl transition-colors border-b-2 ${
                mode === m
                  ? "text-[#ff6b35] border-[#ff6b35] bg-[#ff6b35]/6"
                  : "text-white/35 border-transparent hover:text-white/60"
              }`}
            >
              {m === "game" ? "🏀 Game Flyer" : "📢 Announcement"}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-6 max-w-[1400px]">
        <div className="flex flex-col xl:flex-row gap-6">

        {/* ══════════════════════════════════════════════
            ANNOUNCEMENT MODE
        ══════════════════════════════════════════════ */}
        {mode === "announcement" && (<>

          {/* ── Announcement Form ── */}
          <div className="xl:w-[340px] flex-shrink-0 space-y-4">

            {/* Tier selector */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">Type / Urgency</p>
              <div className="space-y-2">
                {TIERS.map(tier => (
                  <button
                    key={tier.key}
                    onClick={() => setAnn("type", tier.key)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      annData.type === tier.key
                        ? "border-current text-white"
                        : "border-white/8 text-white/40 hover:border-white/20 hover:text-white/70"
                    }`}
                    style={annData.type === tier.key ? { color: tier.color, borderColor: tier.color, background: `${tier.color}18` } : {}}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: tier.color }}
                    />
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-3">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Content</p>

              <div>
                <label className="text-white/40 text-xs font-semibold block mb-1">Headline</label>
                <input
                  type="text"
                  value={annData.headline}
                  onChange={e => setAnn("headline", e.target.value)}
                  placeholder="e.g. Court Closed Tomorrow"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff6b35]/50"
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-semibold block mb-1">Body</label>
                <textarea
                  value={annData.body}
                  onChange={e => setAnn("body", e.target.value)}
                  placeholder="Full announcement details..."
                  rows={4}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff6b35]/50 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-semibold block mb-1">Date / Deadline (optional)</label>
                <input
                  type="text"
                  value={annData.date}
                  onChange={e => setAnn("date", e.target.value)}
                  placeholder="e.g. Effective: December 28"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff6b35]/50"
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-semibold block mb-1">Call to Action (optional)</label>
                <input
                  type="text"
                  value={annData.cta}
                  onChange={e => setAnn("cta", e.target.value)}
                  placeholder="e.g. Contact us on WhatsApp"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff6b35]/50"
                />
              </div>
            </div>

            {/* Refresh */}
            <button
              onClick={renderAnnPreviews}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/6 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 text-sm font-bold rounded-xl transition-colors uppercase tracking-wide"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Previews
            </button>
          </div>

          {/* ── Tier Previews ── */}
          <div className="flex-1 min-w-0">
            <p className="text-white/35 text-xs font-bold uppercase tracking-widest mb-4">
              Select a tier — same content, different urgency level
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TIERS.map((tier, i) => (
                <div
                  key={tier.key}
                  onClick={() => setAnn("type", tier.key)}
                  className="relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200"
                  style={
                    annData.type === tier.key
                      ? { borderColor: tier.color, boxShadow: `0 0 32px ${tier.color}30` }
                      : { borderColor: "rgba(255,255,255,0.08)" }
                  }
                >
                  {annPreviews[i] ? (
                    <img src={annPreviews[i]} alt={tier.label} className="w-full aspect-square object-cover block" draggable={false} />
                  ) : (
                    <div className="w-full aspect-square bg-[#111] flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-[#ff6b35] rounded-full animate-spin" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent px-4 py-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide" style={{ color: tier.color }}>
                      <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ background: tier.color }} />
                      {tier.label}
                    </span>
                    {annData.type === tier.key && (
                      <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide" style={{ color: tier.color }}>
                        <Check className="w-3.5 h-3.5" /> Selected
                      </span>
                    )}
                  </div>
                  {annData.type === tier.key && (
                    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: `2px solid ${tier.color}` }} />
                  )}
                </div>
              ))}
            </div>

            {/* Download CTA */}
            <div className="mt-6 bg-[#111] border border-white/8 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-bold text-sm">
                  {TIERS.find(t => t.key === annData.type)?.label} · {annData.headline || "Announcement"}
                </p>
                <p className="text-white/40 text-xs mt-0.5">1080 × 1080 px · PNG · Ready for WhatsApp &amp; Instagram</p>
              </div>
              <button
                onClick={download}
                disabled={downloading}
                className="flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-white font-bold text-sm rounded-xl hover:bg-[#e55a2b] transition-colors uppercase tracking-wider whitespace-nowrap disabled:opacity-60"
              >
                {downloading ? <><Check className="w-4 h-4" /> Saved!</> : <><Download className="w-4 h-4" /> Download</>}
              </button>
            </div>
          </div>

        </>)}

        {/* ══════════════════════════════════════════════
            GAME FLYER MODE
        ══════════════════════════════════════════════ */}
        {mode === "game" && (<>

          {/* ── Form Panel ── */}
          <div className="xl:w-[340px] flex-shrink-0 space-y-4">

            {/* Game Type */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">Game Type</p>
              <div className="grid grid-cols-2 gap-2">
                {(["rivalry", "top4"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => set("gameType", t)}
                    className={`py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-colors ${
                      data.gameType === t
                        ? "bg-[#ff6b35] text-white"
                        : "bg-white/6 text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {t === "rivalry" ? "Rivalry (2)" : "Top 4"}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-3">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Event Details</p>
              {[
                { key: "eventName", label: "Event Name", placeholder: "Night of Legends" },
                { key: "date",      label: "Date",        placeholder: "December 27, 2025" },
                { key: "time",      label: "Time",        placeholder: "4:00 PM" },
                { key: "venue",     label: "Venue",       placeholder: "Libya Quarters Court, Madina" },
                { key: "tagline",   label: "Tagline (optional)", placeholder: "Community Basketball · Accra" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-white/40 text-xs font-semibold block mb-1">{label}</label>
                  <input
                    type="text"
                    value={data[key as keyof FlyerData] as string}
                    onChange={e => set(key as keyof FlyerData, e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff6b35]/50"
                  />
                </div>
              ))}
            </div>

            {/* Teams */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-3">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                {data.gameType === "rivalry" ? "Teams" : "Top 4 Teams"}
              </p>
              {Array.from({ length: data.gameType === "rivalry" ? 2 : 4 }).map((_, i) => (
                <div key={i}>
                  <label className="text-white/40 text-xs font-semibold block mb-1">
                    {data.gameType === "rivalry"
                      ? (i === 0 ? "Home Team" : "Away Team")
                      : `Team ${i + 1}`}
                  </label>
                  <input
                    type="text"
                    value={data.teams[i]}
                    onChange={e => setTeam(i, e.target.value)}
                    placeholder={`Team ${i + 1} name`}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ff6b35]/50"
                  />
                </div>
              ))}
            </div>

            {/* Hidden file inputs */}
            {([0, 1] as const).map(i => (
              <input
                key={i}
                ref={playerInputRefs[i]}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handlePlayerFile(i, e.target.files?.[0] ?? null)}
              />
            ))}

            {/* Featured Players — rivalry only */}
            {data.gameType === "rivalry" && (
              <div className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-4">
                <div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Featured Players</p>
                  <p className="text-white/25 text-xs mt-1">Optional · for special rivalry games</p>
                </div>
                {([0, 1] as const).map(i => (
                  <div key={i}>
                    <label className="text-white/40 text-xs font-semibold block mb-2">
                      {(i === 0 ? data.teams[0] : data.teams[1]) || (i === 0 ? "Team A" : "Team B")} — Player Photo
                    </label>
                    {playerPreviews[i] ? (
                      <div className="relative">
                        <img
                          src={playerPreviews[i]!}
                          alt={`Player ${i + 1} preview`}
                          className="w-full h-28 object-cover object-top rounded-xl border border-white/10"
                        />
                        <button
                          onClick={() => clearPlayer(i)}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/75 text-white/70 text-xs rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors leading-none"
                          aria-label="Remove player photo"
                        >✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => playerInputRefs[i].current?.click()}
                        className="w-full h-20 border border-dashed border-white/12 rounded-xl flex flex-col items-center justify-center gap-1 text-white/25 hover:border-[#ff6b35]/40 hover:text-white/50 transition-colors"
                      >
                        <span className="text-xl leading-none">+</span>
                        <span className="text-xs">Upload photo</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Options */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">Options</p>
              <button
                onClick={() => set("showCountdown", !data.showCountdown)}
                className={`flex items-center justify-between w-full py-2 px-3 rounded-xl transition-colors ${
                  data.showCountdown ? "bg-[#ff6b35]/15 border border-[#ff6b35]/30" : "bg-white/4 border border-white/8 hover:bg-white/8"
                }`}
              >
                <span className="text-sm font-semibold text-white">Show Countdown Badge</span>
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.showCountdown ? "border-[#ff6b35] bg-[#ff6b35]" : "border-white/25"}`}>
                  {data.showCountdown && <Check className="w-3 h-3 text-white" />}
                </span>
              </button>
              {data.showCountdown && (
                <p className="text-white/35 text-xs mt-2 pl-1">
                  Based on the date &amp; time you entered: <span className="text-[#ff6b35]">{getCountdown(data.date, data.time) || "—"}</span>
                </p>
              )}
            </div>

            {/* Re-render button */}
            <button
              onClick={renderPreviews}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/6 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 text-sm font-bold rounded-xl transition-colors uppercase tracking-wide"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Previews
            </button>
          </div>

          {/* ── Template Grid ── */}
          <div className="flex-1 min-w-0">
            <p className="text-white/35 text-xs font-bold uppercase tracking-widest mb-4">
              Click a template to select it, then download
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEMPLATE_NAMES.map((name, i) => (
                <div
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                    selected === i
                      ? "border-[#ff6b35] shadow-xl shadow-[#ff6b35]/20"
                      : "border-white/8 hover:border-white/25"
                  }`}
                >
                  {/* Preview image */}
                  {previews[i] ? (
                    <img
                      src={previews[i]}
                      alt={name}
                      className="w-full aspect-square object-cover block"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full aspect-square bg-[#111] flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-[#ff6b35] rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Template label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 flex items-center justify-between">
                    <span className="text-white font-bold text-sm uppercase tracking-wide">{name}</span>
                    {selected === i && (
                      <span className="flex items-center gap-1 text-[#ff6b35] text-xs font-bold uppercase tracking-wide">
                        <Check className="w-3.5 h-3.5" /> Selected
                      </span>
                    )}
                  </div>

                  {/* Selected ring overlay */}
                  {selected === i && (
                    <div className="absolute inset-0 border-2 border-[#ff6b35] rounded-2xl pointer-events-none" />
                  )}
                </div>
              ))}
            </div>

            {/* Download CTA */}
            <div className="mt-6 bg-[#111] border border-white/8 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-bold text-sm">
                  {TEMPLATE_NAMES[selected]} selected
                </p>
                <p className="text-white/40 text-xs mt-0.5">1080 × 1080 px · PNG · Ready for WhatsApp &amp; Instagram</p>
              </div>
              <button
                onClick={download}
                disabled={downloading}
                className="flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-white font-bold text-sm rounded-xl hover:bg-[#e55a2b] transition-colors uppercase tracking-wider whitespace-nowrap disabled:opacity-60"
              >
                {downloading ? <><Check className="w-4 h-4" /> Saved!</> : <><Download className="w-4 h-4" /> Download</>}
              </button>
            </div>
          </div>

        </>)}
        </div>
      </div>
    </div>
  );
}

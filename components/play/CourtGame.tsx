"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Mode = "freethrow" | "contest" | "pickup";

type Stats = {
  makes: number;
  misses: number;
  streak: number;
  bestStreak: number;
  bestScore: number;
};

const STORAGE_KEY = "madina-play-stats-v1";

const emptyStats = (): Stats => ({
  makes: 0,
  misses: 0,
  streak: 0,
  bestStreak: 0,
  bestScore: 0,
});

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  flying: boolean;
  scored: boolean;
};

type Spot = { x: number; y: number; label: string; points: number };

type TrailPoint = { x: number; y: number };

const CONTEST_SPOTS: Spot[] = [
  { x: 0.5, y: 0.78, label: "FT", points: 1 },
  { x: 0.22, y: 0.62, label: "L wing", points: 2 },
  { x: 0.78, y: 0.62, label: "R wing", points: 2 },
  { x: 0.18, y: 0.48, label: "L corner", points: 3 },
  { x: 0.82, y: 0.48, label: "R corner", points: 3 },
];

const MODES = [
  ["freethrow", "Free throw"],
  ["contest", "Contest"],
  ["pickup", "Pickup"],
] as const;

function loadStats(): Stats {
  if (typeof window === "undefined") return emptyStats();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStats();
    return { ...emptyStats(), ...JSON.parse(raw) };
  } catch {
    return emptyStats();
  }
}

function saveStats(stats: Stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    /* ignore */
  }
}

function drawCourt(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const asphalt = ctx.createLinearGradient(0, 0, 0, h);
  asphalt.addColorStop(0, "#2a241c");
  asphalt.addColorStop(0.35, "#3a3228");
  asphalt.addColorStop(1, "#1e1a14");
  ctx.fillStyle = asphalt;
  ctx.fillRect(0, 0, w, h);

  // Subtle grit
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  for (let i = 0; i < 40; i++) {
    const gx = ((i * 97) % 100) / 100;
    const gy = ((i * 53) % 100) / 100;
    ctx.fillRect(gx * w, gy * h, 2, 2);
  }

  const padX = w * 0.06;
  const padTop = h * 0.1;
  const padBot = h * 0.08;
  const courtW = w - padX * 2;
  const courtH = h - padTop - padBot;

  // Painted key / lane
  const keyX = padX + courtW * 0.28;
  const keyW = courtW * 0.44;
  const keyTop = padTop;
  const keyH = courtH * 0.48;
  const keyGrad = ctx.createLinearGradient(keyX, keyTop, keyX + keyW, keyTop);
  keyGrad.addColorStop(0, "#4a3a28");
  keyGrad.addColorStop(0.5, "#5c4832");
  keyGrad.addColorStop(1, "#4a3a28");
  ctx.fillStyle = keyGrad;
  ctx.fillRect(keyX, keyTop, keyW, keyH);

  ctx.strokeStyle = "#ff6b35";
  ctx.lineWidth = Math.max(2, w * 0.006);
  ctx.lineJoin = "round";
  ctx.strokeRect(keyX, keyTop, keyW, keyH);

  // Baseline
  ctx.beginPath();
  ctx.moveTo(padX, padTop);
  ctx.lineTo(padX + courtW, padTop);
  ctx.stroke();

  // Sidelines hint
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.moveTo(padX, padTop);
  ctx.lineTo(padX, padTop + courtH * 0.92);
  ctx.moveTo(padX + courtW, padTop);
  ctx.lineTo(padX + courtW, padTop + courtH * 0.92);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Free-throw line + circle
  const ftY = keyTop + keyH;
  const ftCx = w * 0.5;
  ctx.beginPath();
  ctx.moveTo(keyX, ftY);
  ctx.lineTo(keyX + keyW, ftY);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(ftCx, ftY, courtW * 0.14, 0, Math.PI * 2);
  ctx.stroke();

  // Short outdoor 3-point arc
  ctx.beginPath();
  ctx.arc(ftCx, padTop + h * 0.04, courtW * 0.48, 0.12 * Math.PI, 0.88 * Math.PI);
  ctx.stroke();

  // Backboard with depth
  const boardY = padTop - h * 0.01;
  const boardW = courtW * 0.2;
  const boardH = h * 0.028;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(ftCx - boardW / 2 + 3, boardY + 3, boardW, boardH);
  const boardGrad = ctx.createLinearGradient(0, boardY, 0, boardY + boardH);
  boardGrad.addColorStop(0, "#f8f6f2");
  boardGrad.addColorStop(1, "#d8d4cc");
  ctx.fillStyle = boardGrad;
  ctx.fillRect(ftCx - boardW / 2, boardY, boardW, boardH);
  ctx.strokeStyle = "rgba(255,107,53,0.7)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(ftCx - boardW * 0.22, boardY + boardH * 0.25, boardW * 0.44, boardH * 0.5);

  // Rim
  const rimY = padTop + h * 0.055;
  const rimRx = w * 0.048;
  const rimRy = h * 0.014;
  ctx.strokeStyle = "#ff6b35";
  ctx.lineWidth = Math.max(3, w * 0.008);
  ctx.beginPath();
  ctx.ellipse(ftCx, rimY, rimRx, rimRy, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Net
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const sx = ftCx - rimRx + t * rimRx * 2;
    const ex = ftCx - rimRx * 0.55 + t * rimRx * 1.1;
    ctx.beginPath();
    ctx.moveTo(sx, rimY + rimRy * 0.3);
    ctx.quadraticCurveTo(sx * 0.3 + ex * 0.7, rimY + h * 0.04, ex, rimY + h * 0.055);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.ellipse(ftCx, rimY + h * 0.055, rimRx * 0.55, rimRy * 0.7, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Soft vignette
  const vig = ctx.createRadialGradient(w * 0.5, h * 0.4, h * 0.15, w * 0.5, h * 0.5, h * 0.75);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);

  // Court mark
  ctx.fillStyle = "rgba(255,107,53,0.55)";
  ctx.font = `600 ${Math.max(10, Math.floor(w * 0.032))}px Poppins, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("MADINA COURT", w * 0.5, h * 0.965);
}

function drawBall(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  br: number,
  flying: boolean
) {
  // Shadow
  const shadowY = by + br * (flying ? 2.2 : 1.4);
  const shadowScale = flying ? 0.55 : 0.85;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(bx, shadowY, br * shadowScale, br * 0.28 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  const grad = ctx.createRadialGradient(bx - br * 0.35, by - br * 0.4, br * 0.1, bx, by, br);
  grad.addColorStop(0, "#ff9a5c");
  grad.addColorStop(0.55, "#ff6b35");
  grad.addColorStop(1, "#c44512");
  ctx.beginPath();
  ctx.arc(bx, by, br, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = "rgba(30,20,12,0.75)";
  ctx.lineWidth = Math.max(1.5, br * 0.12);
  ctx.beginPath();
  ctx.arc(bx, by, br, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx - br * 0.92, by);
  ctx.quadraticCurveTo(bx, by - br * 0.35, bx + br * 0.92, by);
  ctx.moveTo(bx, by - br * 0.92);
  ctx.quadraticCurveTo(bx + br * 0.25, by, bx, by + br * 0.92);
  ctx.stroke();
}

export default function CourtGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("freethrow");
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [power, setPower] = useState(0.55);
  const [aim, setAim] = useState(0);
  const [message, setMessage] = useState("Dial power & aim, then shoot.");
  const [feedbackFlash, setFeedbackFlash] = useState(false);
  const [shootPressed, setShootPressed] = useState(false);
  const [contestIndex, setContestIndex] = useState(0);
  const [contestScore, setContestScore] = useState(0);
  const [contestLeft, setContestLeft] = useState(45);
  const [contestActive, setContestActive] = useState(false);
  const [pickupScore, setPickupScore] = useState({ you: 0, them: 0 });
  const [defenderX, setDefenderX] = useState(0.5);

  const ballRef = useRef<Ball>({ x: 0.5, y: 0.82, vx: 0, vy: 0, flying: false, scored: false });
  const trailRef = useRef<TrailPoint[]>([]);
  const animRef = useRef<number>(0);
  const modeRef = useRef(mode);
  const contestSpotRef = useRef(0);
  const contestActiveRef = useRef(false);
  const powerRef = useRef(power);
  const aimRef = useRef(aim);
  const defenderRef = useRef(0.5);
  const dragRef = useRef<{ active: boolean; startX: number; startY: number } | null>(null);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    powerRef.current = power;
  }, [power]);
  useEffect(() => {
    aimRef.current = aim;
  }, [aim]);
  useEffect(() => {
    contestSpotRef.current = contestIndex;
  }, [contestIndex]);
  useEffect(() => {
    contestActiveRef.current = contestActive;
  }, [contestActive]);
  useEffect(() => {
    defenderRef.current = defenderX;
  }, [defenderX]);

  useEffect(() => {
    if (!message) return;
    setFeedbackFlash(true);
    const t = window.setTimeout(() => setFeedbackFlash(false), 420);
    return () => window.clearTimeout(t);
  }, [message]);

  const recordShot = useCallback(
    (made: boolean, points = 1) => {
      setStats((prev) => {
        const next = { ...prev };
        if (made) {
          next.makes += 1;
          next.streak += 1;
          next.bestStreak = Math.max(next.bestStreak, next.streak);
          if (modeRef.current === "contest") {
            next.bestScore = Math.max(next.bestScore, contestScore + points);
          }
        } else {
          next.misses += 1;
          next.streak = 0;
        }
        saveStats(next);
        return next;
      });
    },
    [contestScore]
  );

  const resetBall = useCallback((spot?: Spot) => {
    const s =
      spot ||
      (modeRef.current === "contest" ? CONTEST_SPOTS[contestSpotRef.current] : { x: 0.5, y: 0.82 });
    ballRef.current = { x: s.x, y: s.y, vx: 0, vy: 0, flying: false, scored: false };
    trailRef.current = [];
  }, []);

  const shoot = useCallback(() => {
    const ball = ballRef.current;
    if (ball.flying) return;

    if (modeRef.current === "contest" && !contestActiveRef.current) {
      setMessage("Start the contest first.");
      return;
    }

    const rimX = 0.5;
    const rimY = 0.16;
    let powerVal = powerRef.current;
    let aimVal = aimRef.current;

    if (modeRef.current === "pickup") {
      const pressure = Math.abs(ball.x - defenderRef.current);
      if (pressure < 0.08) {
        powerVal *= 0.82;
        aimVal += (Math.random() - 0.5) * 0.12;
        setMessage("Contested!");
      }
    }

    const dx = rimX - ball.x + aimVal * 0.12;
    const dy = rimY - ball.y;
    const speed = 0.012 + powerVal * 0.028;
    const dist = Math.hypot(dx, dy) || 1;
    ball.vx = (dx / dist) * speed;
    ball.vy = (dy / dist) * speed * 1.15 - 0.004;
    ball.flying = true;
    ball.scored = false;
    trailRef.current = [{ x: ball.x, y: ball.y }];
  }, []);

  useEffect(() => {
    if (mode !== "contest" || !contestActive) return;
    if (contestLeft <= 0) {
      setContestActive(false);
      setMessage(`Contest over · ${contestScore} pts`);
      setStats((prev) => {
        const next = { ...prev, bestScore: Math.max(prev.bestScore, contestScore) };
        saveStats(next);
        return next;
      });
      return;
    }
    const timer = window.setTimeout(() => setContestLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [mode, contestActive, contestLeft, contestScore]);

  useEffect(() => {
    if (mode !== "pickup") return;
    const timer = window.setInterval(() => {
      setDefenderX((x) => {
        const ball = ballRef.current;
        const target = ball.flying ? 0.5 : ball.x;
        const next = x + (target - x) * 0.08;
        return Math.max(0.28, Math.min(0.72, next));
      });
    }, 40);
    return () => window.clearInterval(timer);
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const ball = ballRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawCourt(ctx, w, h);

      if (modeRef.current === "contest") {
        CONTEST_SPOTS.forEach((spot, i) => {
          const active = i === contestSpotRef.current;
          ctx.beginPath();
          ctx.arc(spot.x * w, spot.y * h, active ? 9 : 6, 0, Math.PI * 2);
          ctx.fillStyle = active ? "#ffd23f" : "rgba(255,255,255,0.28)";
          ctx.fill();
          if (active) {
            ctx.strokeStyle = "rgba(255,210,63,0.5)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(spot.x * w, spot.y * h, 14, 0, Math.PI * 2);
            ctx.stroke();
          }
        });
      }

      if (modeRef.current === "pickup") {
        const dx = defenderRef.current * w;
        const dy = h * 0.42;
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.ellipse(dx, dy + 14, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1a4a6e";
        ctx.beginPath();
        ctx.arc(dx, dy - 16, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2563a8";
        ctx.fillRect(dx - 11, dy - 5, 22, 26);
      }

      if (ball.flying) {
        ball.vy += 0.00055;
        ball.x += ball.vx;
        ball.y += ball.vy;
        trailRef.current.push({ x: ball.x, y: ball.y });
        if (trailRef.current.length > 14) trailRef.current.shift();

        const rimX = 0.5;
        const rimY = 0.16;
        const dist = Math.hypot(ball.x - rimX, ball.y - rimY);
        if (!ball.scored && dist < 0.04 && ball.vy > 0) {
          ball.scored = true;
          ball.flying = false;
          ball.x = rimX;
          ball.y = rimY + 0.02;
          trailRef.current = [];
          const points =
            modeRef.current === "contest" ? CONTEST_SPOTS[contestSpotRef.current].points : 1;
          recordShot(true, points);
          if (modeRef.current === "contest") {
            const nextIndex = (contestSpotRef.current + 1) % CONTEST_SPOTS.length;
            setContestScore((s) => s + points);
            setContestIndex(nextIndex);
            setMessage(`Bucket · +${points}`);
            window.setTimeout(() => resetBall(CONTEST_SPOTS[nextIndex]), 400);
          } else if (modeRef.current === "pickup") {
            setPickupScore((s) => {
              const you = s.you + 1;
              if (you >= 5) setMessage("You win · first to 5");
              else setMessage(`Make · ${you}–${s.them}`);
              return { ...s, you };
            });
            window.setTimeout(() => resetBall(), 500);
          } else {
            setMessage("Swish");
            window.setTimeout(() => resetBall(), 500);
          }
        } else if (ball.y > 1.05 || ball.x < -0.1 || ball.x > 1.1) {
          ball.flying = false;
          trailRef.current = [];
          recordShot(false);
          if (modeRef.current === "pickup") {
            setPickupScore((s) => {
              const them = s.them + 1;
              if (them >= 5) setMessage("Defender wins · try again");
              else setMessage(`Miss · ${s.you}–${them}`);
              return { ...s, them };
            });
          } else if (modeRef.current === "contest") {
            setContestIndex((i) => (i + 1) % CONTEST_SPOTS.length);
            setMessage("Miss · next spot");
          } else {
            setMessage("Off the mark");
          }
          window.setTimeout(() => resetBall(), 350);
        }
      }

      // Arc trail
      const trail = trailRef.current;
      if (trail.length > 1) {
        for (let i = 1; i < trail.length; i++) {
          const a = i / trail.length;
          ctx.strokeStyle = `rgba(255,107,53,${a * 0.55})`;
          ctx.lineWidth = 2 + a * 3;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x * w, trail[i - 1].y * h);
          ctx.lineTo(trail[i].x * w, trail[i].y * h);
          ctx.stroke();
        }
      }

      const bx = ball.x * w;
      const by = ball.y * h;
      const br = Math.max(11, w * 0.03);
      drawBall(ctx, bx, by, br, ball.flying);

      if (!ball.flying) {
        const guideX = (ball.x + aimRef.current * 0.08) * w;
        const guideY = (ball.y - 0.12 - powerRef.current * 0.2) * h;
        ctx.strokeStyle = "rgba(255,210,63,0.65)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 7]);
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(guideX, guideY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255,210,63,0.9)";
        ctx.beginPath();
        ctx.arc(guideX, guideY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [recordShot, resetBall]);

  useEffect(() => {
    resetBall(mode === "contest" ? CONTEST_SPOTS[0] : undefined);
    setMessage(
      mode === "freethrow"
        ? "Free throws · dial in, then shoot"
        : mode === "contest"
          ? "Five spots · beat the clock"
          : "Pickup to 5 · shake the defender"
    );
    setContestIndex(0);
    setContestScore(0);
    setContestLeft(45);
    setContestActive(false);
    setPickupScore({ you: 0, them: 0 });
    setDefenderX(0.5);
  }, [mode, resetBall]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const resize = () => {
      const width = Math.min(560, wrap.clientWidth || 360);
      const height = Math.round(width * 1.18);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Drag-to-aim on freethrow canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pointerPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const onDown = (e: PointerEvent) => {
      if (modeRef.current !== "freethrow" || ballRef.current.flying) return;
      const p = pointerPos(e);
      dragRef.current = { active: true, startX: p.x, startY: p.y };
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current?.active) return;
      const p = pointerPos(e);
      const dx = p.x - dragRef.current.startX;
      const dy = dragRef.current.startY - p.y;
      setAim(Math.max(-1, Math.min(1, dx * 3)));
      setPower(Math.max(0.25, Math.min(1, 0.35 + dy * 1.8)));
    };
    const onUp = () => {
      dragRef.current = null;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const accuracy =
    stats.makes + stats.misses === 0
      ? 0
      : Math.round((stats.makes / (stats.makes + stats.misses)) * 100);

  const startContest = () => {
    setContestActive(true);
    setContestLeft(45);
    setContestScore(0);
    setContestIndex(0);
    resetBall(CONTEST_SPOTS[0]);
    setMessage("Go");
  };

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-2xl ring-1 ring-white/10"
        style={{
          boxShadow: "0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* HUD overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-3 sm:p-4">
          <div className="pointer-events-auto flex justify-center gap-1.5">
            {MODES.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={`min-h-[40px] rounded-full px-3.5 text-xs font-bold uppercase tracking-wide transition sm:px-4 sm:text-[13px] ${
                  mode === id
                    ? "bg-[#ff6b35] text-white"
                    : "bg-black/45 text-white/70 backdrop-blur-sm hover:bg-black/55 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-start justify-between gap-2 px-0.5">
            <div className="min-w-0 rounded-lg bg-black/40 px-2.5 py-1.5 backdrop-blur-sm">
              {mode === "contest" ? (
                <p className="font-mono text-sm tabular-nums text-white">
                  <span className="text-[#ffd23f]">{contestScore}</span>
                  <span className="mx-1.5 text-white/30">·</span>
                  <span>{contestLeft}s</span>
                  <span className="ml-1.5 text-white/45">{CONTEST_SPOTS[contestIndex]?.label}</span>
                </p>
              ) : mode === "pickup" ? (
                <p className="font-mono text-sm tabular-nums text-white">
                  You {pickupScore.you}
                  <span className="mx-1 text-white/30">–</span>
                  {pickupScore.them} Def
                </p>
              ) : (
                <p className="text-xs font-medium text-white/55">Drag ball to aim</p>
              )}
            </div>
            {mode === "contest" && !contestActive ? (
              <button
                type="button"
                onClick={startContest}
                className="pointer-events-auto rounded-full bg-[#ff6b35] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#e55a2b] active:scale-95"
              >
                Start 45s
              </button>
            ) : null}
          </div>
        </div>

        <canvas ref={canvasRef} className="block w-full touch-none select-none" />

        {/* Feedback */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[42%] z-10 flex justify-center px-4">
          <p
            className={`rounded-full bg-black/50 px-4 py-1.5 text-center text-sm font-semibold tracking-wide text-[#ffd23f] backdrop-blur-sm transition duration-300 ease-out ${
              feedbackFlash ? "scale-105 opacity-100" : "scale-100 opacity-90"
            }`}
          >
            {message}
          </p>
        </div>

        {/* Court-side meters + shoot */}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4">
          <div className="flex items-end gap-3 sm:gap-4">
            <Meter
              label="Power"
              value={power}
              display={`${Math.round(power * 100)}`}
              min={0.25}
              max={1}
              onChange={setPower}
            />
            <button
              type="button"
              onPointerDown={() => setShootPressed(true)}
              onPointerUp={() => setShootPressed(false)}
              onPointerLeave={() => setShootPressed(false)}
              onClick={shoot}
              className={`flex h-14 min-w-[7.5rem] shrink-0 items-center justify-center rounded-2xl bg-[#ff6b35] text-base font-black uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(255,107,53,0.35)] transition duration-150 ease-out hover:bg-[#e55a2b] active:scale-95 sm:h-16 sm:min-w-[8.5rem] sm:text-lg ${
                shootPressed ? "scale-95" : "scale-100"
              }`}
            >
              Shoot
            </button>
            <Meter
              label="Aim"
              value={aim}
              display={aim === 0 ? "·" : aim > 0 ? "R" : "L"}
              min={-1}
              max={1}
              onChange={setAim}
              bipolar
            />
          </div>
        </div>
      </div>

      {/* Quiet stats strip */}
      <div className="mt-4 flex items-baseline justify-between gap-2 border-t border-white/10 pt-3 text-center">
        {(
          [
            ["Makes", stats.makes],
            ["FG%", `${accuracy}%`],
            ["Streak", stats.streak],
            ["Best", stats.bestStreak],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/35">{label}</p>
            <p className="mt-0.5 font-mono text-lg tabular-nums text-white/90 sm:text-xl">{value}</p>
          </div>
        ))}
      </div>
      {stats.bestScore > 0 ? (
        <p className="mt-2 text-center text-[11px] text-white/30">
          Best contest on this device · {stats.bestScore}
        </p>
      ) : null}
    </div>
  );
}

function Meter({
  label,
  value,
  display,
  min,
  max,
  onChange,
  bipolar,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
  bipolar?: boolean;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="flex items-baseline justify-between text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">
        {label}
        <span className="font-mono text-xs tabular-nums text-white/70">{display}</span>
      </span>
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-white/10">
          {bipolar ? (
            <div
              className="absolute top-0 h-full w-1.5 -translate-x-1/2 rounded-full bg-[#ff6b35]"
              style={{ left: `${pct}%` }}
            />
          ) : (
            <div className="absolute inset-y-0 left-0 rounded-full bg-[#ff6b35]" style={{ width: `${pct}%` }} />
          )}
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={0.01}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="relative z-10 h-8 w-full cursor-pointer appearance-none bg-transparent accent-[#ff6b35] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
      </div>
    </label>
  );
}

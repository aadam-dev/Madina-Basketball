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

const CONTEST_SPOTS: Spot[] = [
  { x: 0.5, y: 0.78, label: "FT", points: 1 },
  { x: 0.22, y: 0.62, label: "L wing", points: 2 },
  { x: 0.78, y: 0.62, label: "R wing", points: 2 },
  { x: 0.18, y: 0.48, label: "L corner", points: 3 },
  { x: 0.82, y: 0.48, label: "R corner", points: 3 },
];

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

export default function CourtGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("freethrow");
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [power, setPower] = useState(0.55);
  const [aim, setAim] = useState(0);
  const [message, setMessage] = useState("Set power and aim, then shoot.");
  const [contestIndex, setContestIndex] = useState(0);
  const [contestScore, setContestScore] = useState(0);
  const [contestLeft, setContestLeft] = useState(45);
  const [contestActive, setContestActive] = useState(false);
  const [pickupScore, setPickupScore] = useState({ you: 0, them: 0 });
  const [defenderX, setDefenderX] = useState(0.5);

  const ballRef = useRef<Ball>({ x: 0.5, y: 0.82, vx: 0, vy: 0, flying: false, scored: false });
  const animRef = useRef<number>(0);
  const modeRef = useRef(mode);
  const contestSpotRef = useRef(0);
  const contestActiveRef = useRef(false);
  const powerRef = useRef(power);
  const aimRef = useRef(aim);
  const defenderRef = useRef(0.5);

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

  const recordShot = useCallback((made: boolean, points = 1) => {
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
  }, [contestScore]);

  const resetBall = useCallback((spot?: Spot) => {
    const s = spot || (modeRef.current === "contest" ? CONTEST_SPOTS[contestSpotRef.current] : { x: 0.5, y: 0.82 });
    ballRef.current = { x: s.x, y: s.y, vx: 0, vy: 0, flying: false, scored: false };
  }, []);

  const shoot = useCallback(() => {
    const ball = ballRef.current;
    if (ball.flying) return;

    if (modeRef.current === "contest" && !contestActiveRef.current) {
      setMessage("Start the contest clock first.");
      return;
    }

    const rimX = 0.5;
    const rimY = 0.18;
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
  }, []);

  useEffect(() => {
    if (mode !== "contest" || !contestActive) return;
    if (contestLeft <= 0) {
      setContestActive(false);
      setMessage(`Contest over. Score ${contestScore}.`);
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
      const w = canvas.width;
      const h = canvas.height;
      const ball = ballRef.current;

      // Surface — outdoor colour zones (Madina vibe, short of FIBA length)
      ctx.fillStyle = "#1a3a2a";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#c45c28";
      ctx.fillRect(0, h * 0.08, w, h * 0.84);
      ctx.fillStyle = "#2a5a3a";
      ctx.fillRect(w * 0.08, h * 0.12, w * 0.84, h * 0.76);

      // Key
      ctx.fillStyle = "#e8d4a8";
      ctx.fillRect(w * 0.32, h * 0.18, w * 0.36, h * 0.42);
      ctx.strokeStyle = "#ff6b35";
      ctx.lineWidth = 3;
      ctx.strokeRect(w * 0.32, h * 0.18, w * 0.36, h * 0.42);

      // Free-throw circle
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.6, w * 0.12, 0, Math.PI * 2);
      ctx.stroke();

      // Three-point arc (shorter outdoor feel)
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.22, w * 0.42, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Backboard + rim
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(w * 0.42, h * 0.1, w * 0.16, h * 0.035);
      ctx.strokeStyle = "#ff6b35";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.18, w * 0.045, h * 0.018, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(w * (0.47 + i * 0.015), h * 0.19);
        ctx.lineTo(w * (0.475 + i * 0.012), h * 0.24);
        ctx.stroke();
      }

      // Baseline branding
      ctx.fillStyle = "rgba(255,107,53,0.85)";
      ctx.font = `bold ${Math.floor(w * 0.035)}px Poppins, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("MADINA COURT", w * 0.5, h * 0.95);

      // Contest spot markers
      if (modeRef.current === "contest") {
        CONTEST_SPOTS.forEach((spot, i) => {
          ctx.beginPath();
          ctx.arc(spot.x * w, spot.y * h, 8, 0, Math.PI * 2);
          ctx.fillStyle = i === contestSpotRef.current ? "#ffd23f" : "rgba(255,255,255,0.45)";
          ctx.fill();
        });
      }

      // Defender
      if (modeRef.current === "pickup") {
        const dx = defenderRef.current * w;
        const dy = h * 0.42;
        ctx.fillStyle = "#004e89";
        ctx.beginPath();
        ctx.arc(dx, dy - 18, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(dx - 10, dy - 6, 20, 28);
      }

      // Ball physics
      if (ball.flying) {
        ball.vy += 0.00055;
        ball.x += ball.vx;
        ball.y += ball.vy;

        const rimX = 0.5;
        const rimY = 0.18;
        const dist = Math.hypot(ball.x - rimX, ball.y - rimY);
        if (!ball.scored && dist < 0.04 && ball.vy > 0) {
          ball.scored = true;
          ball.flying = false;
          ball.x = rimX;
          ball.y = rimY + 0.02;
          const points =
            modeRef.current === "contest" ? CONTEST_SPOTS[contestSpotRef.current].points : 1;
          recordShot(true, points);
          if (modeRef.current === "contest") {
            const nextIndex = (contestSpotRef.current + 1) % CONTEST_SPOTS.length;
            setContestScore((s) => s + points);
            setContestIndex(nextIndex);
            setMessage(`Bucket! +${points}`);
            window.setTimeout(() => resetBall(CONTEST_SPOTS[nextIndex]), 400);
          } else if (modeRef.current === "pickup") {
            setPickupScore((s) => {
              const you = s.you + 1;
              if (you >= 5) setMessage("You win to 5!");
              else setMessage(`Make. You ${you} – ${s.them}`);
              return { ...s, you };
            });
            window.setTimeout(() => resetBall(), 500);
          } else {
            setMessage("Swish.");
            window.setTimeout(() => resetBall(), 500);
          }
        } else if (ball.y > 1.05 || ball.x < -0.1 || ball.x > 1.1) {
          ball.flying = false;
          recordShot(false);
          if (modeRef.current === "pickup") {
            setPickupScore((s) => {
              const them = s.them + 1;
              if (them >= 5) setMessage("Defender wins to 5. Try again.");
              else setMessage(`Miss. You ${s.you} – ${them}`);
              return { ...s, them };
            });
          } else if (modeRef.current === "contest") {
            setContestIndex((i) => (i + 1) % CONTEST_SPOTS.length);
            setMessage("Miss. Next spot.");
          } else {
            setMessage("Off the mark.");
          }
          window.setTimeout(() => resetBall(), 350);
        }
      }

      // Draw ball
      const bx = ball.x * w;
      const by = ball.y * h;
      const br = Math.max(10, w * 0.028);
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fillStyle = "#ff6b35";
      ctx.fill();
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx - br, by);
      ctx.quadraticCurveTo(bx, by - br * 0.4, bx + br, by);
      ctx.moveTo(bx, by - br);
      ctx.quadraticCurveTo(bx + br * 0.2, by, bx, by + br);
      ctx.stroke();

      // Aim guide when not flying
      if (!ball.flying) {
        const guideX = (ball.x + aimRef.current * 0.08) * w;
        const guideY = (ball.y - 0.12 - powerRef.current * 0.2) * h;
        ctx.strokeStyle = "rgba(255,210,63,0.7)";
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(guideX, guideY);
        ctx.stroke();
        ctx.setLineDash([]);
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
        ? "Free throws. Dial power and aim."
        : mode === "contest"
          ? "Five spots. Beat the clock."
          : "Pickup to 5. Shake the defender."
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
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      const width = Math.min(720, parent?.clientWidth || 360);
      const height = Math.round(width * 1.15);
      canvas.width = width * (window.devicePixelRatio || 1);
      canvas.height = height * (window.devicePixelRatio || 1);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const accuracy =
    stats.makes + stats.misses === 0
      ? 0
      : Math.round((stats.makes / (stats.makes + stats.misses)) * 100);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["freethrow", "Free throws"],
            ["contest", "Shooting contest"],
            ["pickup", "Pickup to 5"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide ${
              mode === id ? "bg-[#ff6b35] text-white" : "bg-white/10 text-white/70 hover:bg-white/15"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#ff6b35]/30 bg-[#0a0a0a] shadow-2xl">
        <canvas ref={canvasRef} className="block w-full touch-none" />
      </div>

      <p className="mt-3 text-center text-sm font-semibold text-[#ffd23f]">{message}</p>

      {mode === "contest" ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
          <span>Score {contestScore}</span>
          <span>Time {contestLeft}s</span>
          <span>Spot {CONTEST_SPOTS[contestIndex]?.label}</span>
          {!contestActive ? (
            <button
              type="button"
              className="rounded-lg bg-[#ff6b35] px-3 py-1.5 text-xs font-bold text-white"
              onClick={() => {
                setContestActive(true);
                setContestLeft(45);
                setContestScore(0);
                setContestIndex(0);
                resetBall(CONTEST_SPOTS[0]);
                setMessage("Go.");
              }}
            >
              Start 45s
            </button>
          ) : null}
        </div>
      ) : null}

      {mode === "pickup" ? (
        <p className="mt-3 text-center text-sm text-white/70">
          You {pickupScore.you} – {pickupScore.them} Defender · first to 5
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-white/70">
          Power
          <input
            type="range"
            min={0.25}
            max={1}
            step={0.01}
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
            className="mt-2 w-full accent-[#ff6b35]"
          />
        </label>
        <label className="block text-sm text-white/70">
          Aim
          <input
            type="range"
            min={-1}
            max={1}
            step={0.01}
            value={aim}
            onChange={(e) => setAim(Number(e.target.value))}
            className="mt-2 w-full accent-[#ff6b35]"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={shoot}
        className="mt-5 w-full rounded-xl bg-[#ff6b35] py-3.5 text-base font-black uppercase tracking-wider text-white hover:bg-[#e55a2b]"
      >
        Shoot
      </button>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Makes", stats.makes],
          ["Misses", stats.misses],
          ["FG%", `${accuracy}%`],
          ["Best streak", stats.bestStreak],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</p>
            <p className="mt-1 text-xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-white/35">
        Best contest score saved on this device: {stats.bestScore}
      </p>
    </div>
  );
}

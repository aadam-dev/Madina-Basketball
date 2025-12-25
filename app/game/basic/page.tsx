"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw, Save, Download } from "lucide-react";
import Link from "next/link";
import TeamSelector from "@/components/TeamSelector";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface QuarterScore {
  quarter: number;
  homeScore: number;
  awayScore: number;
}

export default function BasicScoreboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [overtime, setOvertime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [currentQuarterHomeScore, setCurrentQuarterHomeScore] = useState(0);
  const [currentQuarterAwayScore, setCurrentQuarterAwayScore] = useState(0);
  const [quarterScores, setQuarterScores] = useState<QuarterScore[]>([]);

  useEffect(() => {
    const team = searchParams.get("team");
    if (team) setHomeTeam(team);
  }, [searchParams]);

  const getTotalScore = (team: "home" | "away") => {
    const previousTotal = quarterScores.reduce((sum, qs) => 
      sum + (team === "home" ? qs.homeScore : qs.awayScore), 0
    );
    const currentPoints = team === "home" ? currentQuarterHomeScore : currentQuarterAwayScore;
    return previousTotal + currentPoints;
  };

  const addScore = (team: "home" | "away", points: number) => {
    if (gameEnded) return;
    if (!gameStarted) setGameStarted(true);

    if (team === "home") {
      setCurrentQuarterHomeScore((prev) => Math.max(0, prev + points));
    } else {
      setCurrentQuarterAwayScore((prev) => Math.max(0, prev + points));
    }
  };

  const nextQuarter = () => {
    if (!homeTeam || !awayTeam) {
      alert("Please enter both team names");
      return;
    }

    setQuarterScores([...quarterScores, {
      quarter: currentQuarter,
      homeScore: currentQuarterHomeScore,
      awayScore: currentQuarterAwayScore,
    }]);

    if (currentQuarter < 4) {
      setCurrentQuarter((prev) => prev + 1);
      setCurrentQuarterHomeScore(0);
      setCurrentQuarterAwayScore(0);
    } else {
      const totalHome = getTotalScore("home");
      const totalAway = getTotalScore("away");
      
      if (totalHome === totalAway) {
        startOvertime();
      } else {
        endGame();
      }
    }
  };

  const startOvertime = () => {
    setOvertime((prev) => prev + 1);
    setCurrentQuarter(5 + overtime);
    setCurrentQuarterHomeScore(0);
    setCurrentQuarterAwayScore(0);
  };

  const endGame = () => {
    setQuarterScores([...quarterScores, {
      quarter: currentQuarter,
      homeScore: currentQuarterHomeScore,
      awayScore: currentQuarterAwayScore,
    }]);
    setGameEnded(true);
  };

  const resetGame = () => {
    if (confirm("Are you sure you want to reset the game? All progress will be lost.")) {
      setHomeTeam("");
      setAwayTeam("");
      setCurrentQuarter(1);
      setOvertime(0);
      setGameStarted(false);
      setGameEnded(false);
      setCurrentQuarterHomeScore(0);
      setCurrentQuarterAwayScore(0);
      setQuarterScores([]);
    }
  };

  const saveGame = async () => {
    if (!homeTeam || !awayTeam) {
      alert("Please enter both team names");
      return;
    }

    setSaving(true);
    try {
      const gameResponse = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_team: homeTeam,
          away_team: awayTeam,
          home_score: getTotalScore("home"),
          away_score: getTotalScore("away"),
          quarter: currentQuarter,
          overtime: overtime,
          game_mode: "basic",
          status: gameEnded ? "final" : "live",
          game_date: new Date().toISOString(),
          location: "Madina Basketball Court",
        }),
      });

      if (!gameResponse.ok) throw new Error("Failed to save game");

      const gameData = await gameResponse.json();

      const allQuarters = gameEnded 
        ? quarterScores 
        : [...quarterScores, {
            quarter: currentQuarter,
            homeScore: currentQuarterHomeScore,
            awayScore: currentQuarterAwayScore,
          }];

      for (const qs of allQuarters) {
        await fetch(`/api/games/${gameData.id}/quarters`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quarter: qs.quarter,
            home_score: qs.homeScore,
            away_score: qs.awayScore,
          }),
        });
      }

      alert("Game saved successfully!");
      if (gameEnded) {
        router.push(`/game/${gameData.id}`);
      }
    } catch (error) {
      console.error("Error saving game:", error);
      alert("Failed to save game. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const totalHomeScore = getTotalScore("home");
  const totalAwayScore = getTotalScore("away");
  const quarterLabel = currentQuarter <= 4 ? `Q${currentQuarter}` : `OT${overtime}`;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/game" className="text-gray-400 hover:text-white flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-white text-xl font-bold">LIVE SCOREBOARD</h1>
          <button onClick={resetGame} className="text-gray-400 hover:text-white flex items-center space-x-2">
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Team Setup (Before Game Starts) */}
        {!gameStarted && (
          <div className="bg-gray-800 rounded-xl p-8 mb-6">
            <h2 className="text-white text-xl font-bold mb-6 text-center">Setup Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TeamSelector
                value={homeTeam}
                onChange={setHomeTeam}
                label="Home Team"
                placeholder="Select home team"
                allowCustom={true}
              />
              <TeamSelector
                value={awayTeam}
                onChange={setAwayTeam}
                label="Away Team"
                placeholder="Select away team"
                allowCustom={true}
              />
            </div>
            <button
              onClick={() => {
                if (!homeTeam || !awayTeam) {
                  alert("Please enter both team names");
                  return;
                }
                setGameStarted(true);
              }}
              className="w-full mt-6 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg text-lg"
            >
              START GAME
            </button>
          </div>
        )}

        {/* Digital Scoreboard */}
        {gameStarted && (
          <div id="scoreboard-print" className="relative">
            {/* LED-Style Scoreboard */}
            <div className="bg-black rounded-3xl p-8 shadow-2xl border-4 border-gray-700">
              {/* Team Names */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="bg-gray-900 rounded-lg p-4 border-2 border-primary">
                    <div className="text-primary text-2xl font-bold tracking-wider truncate">
                      {homeTeam || "HOME"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-yellow-400 text-xl font-bold px-4 py-2 bg-gray-900 rounded-lg border-2 border-yellow-400">
                    {quarterLabel}
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gray-900 rounded-lg p-4 border-2 border-secondary">
                    <div className="text-secondary text-2xl font-bold tracking-wider truncate">
                      {awayTeam || "AWAY"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Scores - LED Style */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* Home Score */}
                <div className="flex items-center justify-center">
                  <div className="led-display bg-gray-900 rounded-2xl p-8 w-full border-4 border-primary">
                    <div className="text-primary text-8xl font-extrabold text-center tracking-tighter led-glow-primary">
                      {totalHomeScore}
                    </div>
                  </div>
                </div>

                {/* VS */}
                <div className="flex items-center justify-center">
                  <div className="text-gray-500 text-4xl font-bold">VS</div>
                </div>

                {/* Away Score */}
                <div className="flex items-center justify-center">
                  <div className="led-display bg-gray-900 rounded-2xl p-8 w-full border-4 border-secondary">
                    <div className="text-secondary text-8xl font-extrabold text-center tracking-tighter led-glow-secondary">
                      {totalAwayScore}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quarter Breakdown */}
              {quarterScores.length > 0 && (
                <div className="bg-gray-900 rounded-xl p-4 mb-6 border-2 border-gray-700">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-2 text-center">Quarter Scores</div>
                  <div className="grid grid-cols-4 gap-2">
                    {quarterScores.map((qs) => (
                      <div key={qs.quarter} className="text-center bg-gray-800 rounded p-2">
                        <div className="text-yellow-400 text-xs mb-1">
                          {qs.quarter <= 4 ? `Q${qs.quarter}` : `OT${qs.quarter - 4}`}
                        </div>
                        <div className="text-white font-bold text-sm">
                          {qs.homeScore} - {qs.awayScore}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Game Status */}
              <div className="text-center mb-6">
                <div className={`inline-block px-6 py-2 rounded-full text-lg font-bold ${
                  gameEnded ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
                }`}>
                  {gameEnded ? '🏁 FINAL' : '🔴 LIVE'}
                </div>
              </div>
            </div>

            {/* Score Controls */}
            {!gameEnded && (
              <div className="mt-6 bg-gray-800 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Home Team Controls */}
                  <div className="space-y-3">
                    <div className="text-primary font-bold text-center mb-2">{homeTeam} CONTROLS</div>
                    <div className="grid grid-cols-4 gap-2">
                      <button onClick={() => addScore("home", 1)} className="score-btn-home">+1</button>
                      <button onClick={() => addScore("home", 2)} className="score-btn-home">+2</button>
                      <button onClick={() => addScore("home", 3)} className="score-btn-home">+3</button>
                      <button onClick={() => addScore("home", -1)} className="score-btn-undo">-1</button>
                    </div>
                  </div>

                  {/* Away Team Controls */}
                  <div className="space-y-3">
                    <div className="text-secondary font-bold text-center mb-2">{awayTeam} CONTROLS</div>
                    <div className="grid grid-cols-4 gap-2">
                      <button onClick={() => addScore("away", 1)} className="score-btn-away">+1</button>
                      <button onClick={() => addScore("away", 2)} className="score-btn-away">+2</button>
                      <button onClick={() => addScore("away", 3)} className="score-btn-away">+3</button>
                      <button onClick={() => addScore("away", -1)} className="score-btn-undo">-1</button>
                    </div>
                  </div>
                </div>

                {/* Game Progress Button */}
                <div className="mt-6 text-center">
                  <button
                    onClick={nextQuarter}
                    className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg text-lg w-full md:w-auto"
                  >
                    {currentQuarter < 4 ? `END ${quarterLabel} → NEXT QUARTER` : 'END GAME'}
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                onClick={saveGame}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? "Saving..." : "Save Game"}</span>
              </button>
              <button
                onClick={async () => {
                  setSaving(true);
                  try {
                    const element = document.getElementById("scoreboard-print");
                    if (!element) return;
                    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#000000" });
                    const imgData = canvas.toDataURL("image/png");
                    const pdf = new jsPDF({
                      orientation: "landscape",
                      unit: "mm",
                      format: "a4",
                    });
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`${homeTeam}_vs_${awayTeam}_Scoreboard.pdf`);
                  } catch (error) {
                    console.error("Error generating PDF:", error);
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .score-btn-home {
          @apply px-4 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95;
        }
        .score-btn-away {
          @apply px-4 py-3 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95;
        }
        .score-btn-undo {
          @apply px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all;
        }
        .led-display {
          background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5);
        }
        .led-glow-primary {
          text-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor;
        }
        .led-glow-secondary {
          text-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor;
        }
      `}</style>
    </div>
  );
}

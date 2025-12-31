/**
 * Basic Scoreboard Component
 * 
 * Live scoreboard for tracking basketball games with quarter-by-quarter scoring.
 * Features:
 * - Real-time score tracking
 * - Quarter management (Q1-Q4, with overtime support)
 * - Separate tracking of current quarter vs total score
 * - Game state management (setup, live, ended)
 * - Save game to database
 * - Export scoreboard as PDF
 * 
 * @component
 */

"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw, Save, Download, Play, Pause, Clock } from "lucide-react";
import Link from "next/link";
import TeamSelector from "@/components/TeamSelector";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Quarter score data structure
 * Stores the final score for each completed quarter
 */
interface QuarterScore {
  quarter: number; // Quarter number (1-4, or 5+ for overtime)
  homeScore: number; // Home team score for this quarter
  awayScore: number; // Away team score for this quarter
}

function BasicScoreboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Team configuration
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  
  // Game state
  const [currentQuarter, setCurrentQuarter] = useState(1); // Current quarter (1-4, then 5+ for OT)
  const [overtime, setOvertime] = useState(0); // Number of overtime periods
  const [gameStarted, setGameStarted] = useState(false); // Whether game has started
  const [gameEnded, setGameEnded] = useState(false); // Whether game has ended
  const [saving, setSaving] = useState(false); // Save operation in progress
  
  // Score tracking
  // Current quarter scores (reset to 0 at start of each quarter)
  const [currentQuarterHomeScore, setCurrentQuarterHomeScore] = useState(0);
  const [currentQuarterAwayScore, setCurrentQuarterAwayScore] = useState(0);
  // Historical quarter scores (stored when quarter ends)
  const [quarterScores, setQuarterScores] = useState<QuarterScore[]>([]);

  // Timer state
  const [timerDuration, setTimerDuration] = useState(600); // Default: 10 minutes (600 seconds)
  const [timeRemaining, setTimeRemaining] = useState(600); // Current time remaining in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate timer duration options (5-30 minutes)
  const timerOptions = Array.from({ length: 26 }, (_, i) => (i + 5) * 60); // 5 to 30 minutes in seconds

  // Team fouls tracking (per quarter)
  const [homeFouls, setHomeFouls] = useState(0);
  const [awayFouls, setAwayFouls] = useState(0);

  // Load team name from URL query parameter if present
  useEffect(() => {
    const team = searchParams.get("team");
    if (team) setHomeTeam(team);
  }, [searchParams]);

  /**
   * Timer effect - handles countdown
   */
  useEffect(() => {
    if (isTimerRunning && !isTimerPaused && timeRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Timer reached zero - play sound or alert
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, isTimerPaused, timeRemaining]);

  /**
   * Reset timer when quarter changes
   */
  useEffect(() => {
    setTimeRemaining(timerDuration);
    setIsTimerRunning(false);
    setIsTimerPaused(false);
    setHomeFouls(0);
    setAwayFouls(0);
  }, [currentQuarter, timerDuration]);

  /**
   * Calculate total score for a team
   * Sums all completed quarter scores plus current quarter score
   * 
   * @param team - "home" or "away"
   * @returns Total score for the team
   */
  const getTotalScore = (team: "home" | "away") => {
    // Sum all completed quarters
    const previousTotal = quarterScores.reduce((sum, qs) => 
      sum + (team === "home" ? qs.homeScore : qs.awayScore), 0
    );
    // Add current quarter points
    const currentPoints = team === "home" ? currentQuarterHomeScore : currentQuarterAwayScore;
    return previousTotal + currentPoints;
  };

  /**
   * Add points to a team's current quarter score
   * Prevents negative scores and automatically starts game on first score
   * 
   * @param team - "home" or "away"
   * @param points - Points to add (can be negative for undo)
   */
  const addScore = (team: "home" | "away", points: number) => {
    // Don't allow scoring after game ends
    if (gameEnded) return;
    
    // Auto-start game when first score is added
    if (!gameStarted) setGameStarted(true);

    // Update current quarter score (prevent negative scores)
    if (team === "home") {
      setCurrentQuarterHomeScore((prev) => Math.max(0, prev + points));
    } else {
      setCurrentQuarterAwayScore((prev) => Math.max(0, prev + points));
    }
  };

  /**
   * Advance to next quarter or end game
   * Saves current quarter scores and either:
   * - Advances to next quarter (Q1-Q4)
   * - Starts overtime if tied after Q4
   * - Ends game if not tied after Q4
   */
  const nextQuarter = () => {
    // Validate teams are set
    if (!homeTeam || !awayTeam) {
      alert("Please enter both team names");
      return;
    }

    // Save current quarter scores to history
    setQuarterScores([...quarterScores, {
      quarter: currentQuarter,
      homeScore: currentQuarterHomeScore,
      awayScore: currentQuarterAwayScore,
    }]);

    if (currentQuarter < 4) {
      // Regular quarters: advance to next quarter
      setCurrentQuarter((prev) => prev + 1);
      setCurrentQuarterHomeScore(0);
      setCurrentQuarterAwayScore(0);
    } else {
      // After Q4: check for tie
      const totalHome = getTotalScore("home");
      const totalAway = getTotalScore("away");
      
      if (totalHome === totalAway) {
        // Tied score - start overtime
        startOvertime();
      } else {
        // Game over - team with higher score wins
        endGame();
      }
    }
  };

  /**
   * Start an overtime period
   * Increments overtime counter and resets quarter scores
   */
  const startOvertime = () => {
    setOvertime((prev) => prev + 1);
    setCurrentQuarter(5 + overtime); // OT1 = quarter 5, OT2 = quarter 6, etc.
    setCurrentQuarterHomeScore(0);
    setCurrentQuarterAwayScore(0);
  };

  /**
   * Timer control functions
   */
  const startTimer = () => {
    setIsTimerRunning(true);
    setIsTimerPaused(false);
  };

  const pauseTimer = () => {
    setIsTimerPaused(true);
    setIsTimerRunning(false);
  };

  const resumeTimer = () => {
    setIsTimerPaused(false);
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setTimeRemaining(timerDuration);
    setIsTimerRunning(false);
    setIsTimerPaused(false);
  };

  /**
   * Format time remaining as MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Add foul to team
   */
  const addFoul = (team: "home" | "away") => {
    if (gameEnded) return;
    if (team === "home") {
      setHomeFouls((prev) => Math.min(prev + 1, 5)); // Max 5 fouls per quarter
    } else {
      setAwayFouls((prev) => Math.min(prev + 1, 5));
    }
  };

  /**
   * Remove foul from team (undo)
   */
  const removeFoul = (team: "home" | "away") => {
    if (team === "home") {
      setHomeFouls((prev) => Math.max(prev - 1, 0));
    } else {
      setAwayFouls((prev) => Math.max(prev - 1, 0));
    }
  };

  /**
   * End the game
   * Saves final quarter and marks game as ended
   */
  const endGame = () => {
    // Save final quarter before ending
    setQuarterScores([...quarterScores, {
      quarter: currentQuarter,
      homeScore: currentQuarterHomeScore,
      awayScore: currentQuarterAwayScore,
    }]);
    setGameEnded(true);
  };

  /**
   * Reset game to initial state
   * Clears all scores, teams, and game state
   * Requires user confirmation before resetting
   */
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
      resetTimer();
      setHomeFouls(0);
      setAwayFouls(0);
    }
  };

  /**
   * Save game to database
   * Creates game record and saves all quarter scores
   * Redirects to game detail page if game is ended
   */
  const saveGame = async () => {
    if (!homeTeam || !awayTeam) {
      alert("Please enter both team names");
      return;
    }

    setSaving(true);
    try {
      // Create game record in database
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

      // Save all quarter scores (including current quarter if game not ended)
      const allQuarters = gameEnded 
        ? quarterScores // Game ended - all quarters already saved
        : [...quarterScores, { // Game in progress - include current quarter
            quarter: currentQuarter,
            homeScore: currentQuarterHomeScore,
            awayScore: currentQuarterAwayScore,
          }];

      // Save each quarter score to database
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
      
      // Redirect to game detail page if game is completed
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
            <div className="bg-black rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-gray-700">
              {/* Team Names with Timer in Center */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                {/* Home Team */}
                <div className="text-center min-w-0">
                  <div className="bg-gray-900 rounded-lg p-2 sm:p-4 border-2 border-primary">
                    <div className="text-primary text-sm sm:text-xl md:text-2xl font-bold tracking-wider break-words overflow-hidden">
                      {homeTeam || "HOME"}
                    </div>
                  </div>
                </div>

                {/* Timer Display - Center Position */}
                <div className="flex flex-col items-center justify-center space-y-2">
                  {/* Game Clock */}
                  <div className="w-full bg-gray-900 rounded-lg p-2 sm:p-3 border-2 border-yellow-400">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1 text-center">Clock</div>
                    <div className={`text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-center ${
                      timeRemaining <= 60 ? 'text-red-400' : timeRemaining <= 120 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {formatTime(timeRemaining)}
                    </div>
                    {/* Timer Controls */}
                    <div className="flex justify-center gap-1 mt-2">
                      {!isTimerRunning && !isTimerPaused && (
                        <button
                          onClick={startTimer}
                          className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs flex items-center gap-1"
                          title="Start Timer"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                      )}
                      {isTimerRunning && (
                        <button
                          onClick={pauseTimer}
                          className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs flex items-center gap-1"
                          title="Pause Timer"
                        >
                          <Pause className="w-3 h-3" />
                        </button>
                      )}
                      {isTimerPaused && (
                        <button
                          onClick={resumeTimer}
                          className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs flex items-center gap-1"
                          title="Resume Timer"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                      )}
                      {(isTimerRunning || isTimerPaused) && (
                        <button
                          onClick={resetTimer}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
                          title="Reset Timer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    {/* Duration Selector */}
                    <select
                      value={timerDuration}
                      onChange={(e) => {
                        const newDuration = parseInt(e.target.value);
                        setTimerDuration(newDuration);
                        if (!isTimerRunning && !isTimerPaused) {
                          setTimeRemaining(newDuration);
                        }
                      }}
                      disabled={isTimerRunning || isTimerPaused}
                      className="w-full mt-1 bg-gray-800 text-white border border-gray-600 rounded px-1 py-1 text-xs focus:outline-none focus:border-yellow-400"
                      title="Select Timer Duration"
                    >
                      {timerOptions.map((seconds) => {
                        const minutes = seconds / 60;
                        return (
                          <option key={seconds} value={seconds}>
                            {minutes}:00
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {/* Quarter Label */}
                  <div className="text-yellow-400 text-sm sm:text-base md:text-lg font-bold px-2 sm:px-3 py-1 bg-gray-900 rounded border border-yellow-400 whitespace-nowrap">
                    {quarterLabel}
                  </div>
                </div>

                {/* Away Team */}
                <div className="text-center min-w-0">
                  <div className="bg-gray-900 rounded-lg p-2 sm:p-4 border-2 border-secondary">
                    <div className="text-secondary text-sm sm:text-xl md:text-2xl font-bold tracking-wider break-words overflow-hidden">
                      {awayTeam || "AWAY"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Scores with Integrated Controls */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {/* Home Score with Controls */}
                <div className="flex flex-col items-center justify-center min-w-0">
                  {/* Score Display */}
                  <div className="led-display bg-gray-900 rounded-xl p-3 sm:p-4 md:p-5 w-full border-2 sm:border-3 border-primary mb-2">
                    <div className="text-primary text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center tracking-tighter led-glow-primary">
                      {totalHomeScore}
                    </div>
                  </div>
                  {/* Compact Score Buttons */}
                  <div className="grid grid-cols-4 gap-1 w-full">
                    <button 
                      onClick={() => addScore("home", 1)} 
                      className="score-btn-micro score-btn-home"
                      aria-label="Add 1 point"
                      title="+1"
                    >
                      +1
                    </button>
                    <button 
                      onClick={() => addScore("home", 2)} 
                      className="score-btn-micro score-btn-home"
                      aria-label="Add 2 points"
                      title="+2"
                    >
                      +2
                    </button>
                    <button 
                      onClick={() => addScore("home", 3)} 
                      className="score-btn-micro score-btn-home"
                      aria-label="Add 3 points"
                      title="+3"
                    >
                      +3
                    </button>
                    <button 
                      onClick={() => addScore("home", -1)} 
                      className="score-btn-micro score-btn-undo"
                      aria-label="Remove 1 point"
                      title="-1"
                    >
                      -1
                    </button>
                  </div>
                </div>

                {/* VS */}
                <div className="flex items-center justify-center">
                  <div className="text-gray-500 text-lg sm:text-2xl md:text-3xl font-bold">VS</div>
                </div>

                {/* Away Score with Controls */}
                <div className="flex flex-col items-center justify-center min-w-0">
                  {/* Score Display */}
                  <div className="led-display bg-gray-900 rounded-xl p-3 sm:p-4 md:p-5 w-full border-2 sm:border-3 border-secondary mb-2">
                    <div className="text-secondary text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center tracking-tighter led-glow-secondary">
                      {totalAwayScore}
                    </div>
                  </div>
                  {/* Compact Score Buttons */}
                  <div className="grid grid-cols-4 gap-1 w-full">
                    <button 
                      onClick={() => addScore("away", 1)} 
                      className="score-btn-micro score-btn-away"
                      aria-label="Add 1 point"
                      title="+1"
                    >
                      +1
                    </button>
                    <button 
                      onClick={() => addScore("away", 2)} 
                      className="score-btn-micro score-btn-away"
                      aria-label="Add 2 points"
                      title="+2"
                    >
                      +2
                    </button>
                    <button 
                      onClick={() => addScore("away", 3)} 
                      className="score-btn-micro score-btn-away"
                      aria-label="Add 3 points"
                      title="+3"
                    >
                      +3
                    </button>
                    <button 
                      onClick={() => addScore("away", -1)} 
                      className="score-btn-micro score-btn-undo"
                      aria-label="Remove 1 point"
                      title="-1"
                    >
                      -1
                    </button>
                  </div>
                </div>
              </div>


              {/* Compact Team Fouls Display - Aligned with Scores */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {/* Home Team Fouls - Aligned with Home Score */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <button
                    onClick={() => removeFoul("home")}
                    disabled={homeFouls === 0 || gameEnded}
                    className="foul-btn-micro foul-btn-remove disabled:opacity-30"
                    title="Remove Foul"
                  >
                    -
                  </button>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary min-w-[30px] sm:min-w-[40px] text-center">
                    {homeFouls}
                  </div>
                  <button
                    onClick={() => addFoul("home")}
                    disabled={homeFouls >= 5 || gameEnded}
                    className="foul-btn-micro foul-btn-add-home disabled:opacity-30"
                    title="Add Foul"
                  >
                    +
                  </button>
                </div>

                {/* Center Spacer */}
                <div className="flex items-center justify-center">
                  <div className="text-gray-400 text-xs uppercase tracking-wider">Fouls</div>
                </div>

                {/* Away Team Fouls - Aligned with Away Score */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <button
                    onClick={() => removeFoul("away")}
                    disabled={awayFouls === 0 || gameEnded}
                    className="foul-btn-micro foul-btn-remove disabled:opacity-30"
                    title="Remove Foul"
                  >
                    -
                  </button>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary min-w-[30px] sm:min-w-[40px] text-center">
                    {awayFouls}
                  </div>
                  <button
                    onClick={() => addFoul("away")}
                    disabled={awayFouls >= 5 || gameEnded}
                    className="foul-btn-micro foul-btn-add-away disabled:opacity-30"
                    title="Add Foul"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Compact Quarter Breakdown & Status */}
              <div className="bg-gray-900 rounded-lg p-2 sm:p-3 mb-3 border border-gray-700">
                {/* Quarter Scores */}
                {quarterScores.length > 0 && (
                  <div className="flex gap-1 sm:gap-2 mb-2 justify-center">
                    {quarterScores.map((qs) => (
                      <div key={qs.quarter} className="text-center bg-gray-800 rounded px-2 py-1 flex-1 min-w-[50px] max-w-[80px]">
                        <div className="text-yellow-400 text-xs mb-0.5">
                          {qs.quarter <= 4 ? `Q${qs.quarter}` : `OT${qs.quarter - 4}`}
                        </div>
                        <div className="text-white font-bold text-xs sm:text-sm">
                          {qs.homeScore}-{qs.awayScore}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Game Status - Centered */}
                <div className="flex justify-center">
                  <div className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap ${
                    gameEnded ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
                  }`}>
                    {gameEnded ? '🏁 FINAL' : '🔴 LIVE'}
                  </div>
                </div>
              </div>
            </div>

            {/* Game Progress Button */}
            {!gameEnded && (
              <div className="mt-3 text-center">
                <button
                  onClick={nextQuarter}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg text-sm sm:text-base w-full transition-colors"
                >
                  {currentQuarter < 4 ? `END ${quarterLabel} → NEXT` : 'END GAME'}
                </button>
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
        /* Micro Score Buttons - Right below scores for instant feedback */
        .score-btn-micro {
          padding: 0.4rem 0.3rem;
          font-weight: 700;
          border-radius: 0.375rem;
          transition: all 0.1s ease;
          font-size: 0.75rem;
          min-height: 32px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
          border: 1px solid transparent;
          cursor: pointer;
          user-select: none;
          touch-action: manipulation;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @media (min-width: 640px) {
          .score-btn-micro {
            padding: 0.5rem 0.4rem;
            font-size: 0.875rem;
            min-height: 36px;
          }
        }
        
        .score-btn-micro:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        
        .score-btn-micro:active {
          transform: scale(0.95);
        }
        
        .score-btn-micro:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
        }
        
        .score-btn-micro.score-btn-home {
          background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
          color: white;
          border-color: rgba(255, 107, 53, 0.4);
        }
        
        .score-btn-micro.score-btn-home:hover {
          background: linear-gradient(135deg, #ff7b45 0%, #ff6b35 100%);
          box-shadow: 0 2px 12px rgba(255, 107, 53, 0.6);
        }
        
        .score-btn-micro.score-btn-away {
          background: linear-gradient(135deg, #004e89 0%, #003d6b 100%);
          color: white;
          border-color: rgba(0, 78, 137, 0.4);
        }
        
        .score-btn-micro.score-btn-away:hover {
          background: linear-gradient(135deg, #005fa3 0%, #004e89 100%);
          box-shadow: 0 2px 12px rgba(0, 78, 137, 0.6);
        }
        
        .score-btn-micro.score-btn-undo {
          background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
          color: white;
          border-color: rgba(75, 85, 99, 0.4);
        }
        
        .score-btn-micro.score-btn-undo:hover {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
        }
        
        /* Micro Foul Buttons - Compact and efficient */
        .foul-btn-micro {
          padding: 0.25rem 0.5rem;
          font-weight: 700;
          border-radius: 0.25rem;
          transition: all 0.1s ease;
          font-size: 0.875rem;
          min-width: 28px;
          min-height: 28px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          border: 1px solid transparent;
          cursor: pointer;
          user-select: none;
          touch-action: manipulation;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @media (min-width: 640px) {
          .foul-btn-micro {
            min-width: 32px;
            min-height: 32px;
            font-size: 1rem;
          }
        }
        
        .foul-btn-micro:hover:not(:disabled) {
          transform: scale(1.1);
        }
        
        .foul-btn-micro:active:not(:disabled) {
          transform: scale(0.95);
        }
        
        .foul-btn-micro.foul-btn-remove {
          background: #4b5563;
          color: white;
        }
        
        .foul-btn-micro.foul-btn-remove:hover:not(:disabled) {
          background: #6b7280;
        }
        
        .foul-btn-micro.foul-btn-add-home {
          background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
          color: white;
        }
        
        .foul-btn-micro.foul-btn-add-home:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff7b45 0%, #ff6b35 100%);
        }
        
        .foul-btn-micro.foul-btn-add-away {
          background: linear-gradient(135deg, #004e89 0%, #003d6b 100%);
          color: white;
        }
        
        .foul-btn-micro.foul-btn-add-away:hover:not(:disabled) {
          background: linear-gradient(135deg, #005fa3 0%, #004e89 100%);
        }
        
        /* LED Display Styles */
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

export default function BasicScoreboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <BasicScoreboardContent />
    </Suspense>
  );
}

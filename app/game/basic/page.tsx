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
import { ArrowLeft, RotateCcw, Save, Download, Play, Pause, Clock, PlusCircle, Image as ImageIcon, ArrowDown } from "lucide-react";
import Link from "next/link";
import TeamSelector from "@/components/TeamSelector";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { 
  saveGameState, 
  getCurrentGameState, 
  hasRecoverableGame,
  clearCurrentGame 
} from "@/lib/offline-storage";

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

  // Use mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Team configuration - initialize empty, will be set after mount
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  
  // Game state
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [overtime, setOvertime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showFinalScoreCard, setShowFinalScoreCard] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  
  // Score tracking
  const [currentQuarterHomeScore, setCurrentQuarterHomeScore] = useState(0);
  const [currentQuarterAwayScore, setCurrentQuarterAwayScore] = useState(0);
  const [quarterScores, setQuarterScores] = useState<QuarterScore[]>([]);

  // Timer state
  const [timerDuration, setTimerDuration] = useState(600);
  const [timeRemaining, setTimeRemaining] = useState(600);
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

  // Recover game state after mount (client-side only) - prevents hydration error
  useEffect(() => {
    setMounted(true);
    
    if (hasRecoverableGame()) {
      const saved = getCurrentGameState();
      if (!saved || saved.gameMode !== 'basic') return;
      
      const hoursSinceLastUpdate = (Date.now() - (saved.timestamp || 0)) / (1000 * 60 * 60);
      const isRecent = hoursSinceLastUpdate < 1;
      
      if (isRecent) {
        // Auto-recover recent games
        setHomeTeam(saved.homeTeam || "");
        setAwayTeam(saved.awayTeam || "");
        setCurrentQuarter(saved.quarter || 1);
        setOvertime(saved.overtime || 0);
        setGameStarted(saved.gameStarted || false);
        setGameEnded(saved.gameEnded || false);
        if (saved.quarterScores) setQuarterScores(saved.quarterScores);
        if (saved.timeRemaining !== undefined) setTimeRemaining(saved.timeRemaining);
        if (saved.timerDuration !== undefined) setTimerDuration(saved.timerDuration);
        if (saved.homeFouls !== undefined) setHomeFouls(saved.homeFouls);
        if (saved.awayFouls !== undefined) setAwayFouls(saved.awayFouls);
        
        const savedHomeTotal = saved.homeScore || 0;
        const savedAwayTotal = saved.awayScore || 0;
        const completedHomeTotal = (saved.quarterScores || []).reduce((sum: number, qs: any) => sum + qs.homeScore, 0);
        const completedAwayTotal = (saved.quarterScores || []).reduce((sum: number, qs: any) => sum + qs.awayScore, 0);
        setCurrentQuarterHomeScore(savedHomeTotal - completedHomeTotal);
        setCurrentQuarterAwayScore(savedAwayTotal - completedAwayTotal);
      } else {
        // Prompt for older games
        const shouldRecover = confirm(
          'Recover previous game from ' + new Date(saved.timestamp || 0).toLocaleString() + '?\n\nClick OK to continue, Cancel to start fresh.'
        );
        
        if (shouldRecover) {
          setHomeTeam(saved.homeTeam || "");
          setAwayTeam(saved.awayTeam || "");
          setCurrentQuarter(saved.quarter || 1);
          setOvertime(saved.overtime || 0);
          setGameStarted(saved.gameStarted || false);
          setGameEnded(saved.gameEnded || false);
          if (saved.quarterScores) setQuarterScores(saved.quarterScores);
          if (saved.timeRemaining !== undefined) setTimeRemaining(saved.timeRemaining);
          if (saved.timerDuration !== undefined) setTimerDuration(saved.timerDuration);
          if (saved.homeFouls !== undefined) setHomeFouls(saved.homeFouls);
          if (saved.awayFouls !== undefined) setAwayFouls(saved.awayFouls);
          
          const savedHomeTotal = saved.homeScore || 0;
          const savedAwayTotal = saved.awayScore || 0;
          const completedHomeTotal = (saved.quarterScores || []).reduce((sum: number, qs: any) => sum + qs.homeScore, 0);
          const completedAwayTotal = (saved.quarterScores || []).reduce((sum: number, qs: any) => sum + qs.awayScore, 0);
          setCurrentQuarterHomeScore(savedHomeTotal - completedHomeTotal);
          setCurrentQuarterAwayScore(savedAwayTotal - completedAwayTotal);
        } else {
          clearCurrentGame();
        }
      }
    }
  }, []); // Only run once on mount

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
   * Auto-save game state to localStorage every 2 seconds
   * Includes all game state: scores, timer, fouls, quarters
   */
  useEffect(() => {
    if (!gameStarted || gameEnded) return;
    
    const interval = setInterval(() => {
      saveGameState({
        id: `basic_${Date.now()}`,
        homeTeam,
        awayTeam,
        homeScore: getTotalScore("home"),
        awayScore: getTotalScore("away"),
        quarter: currentQuarter,
        overtime,
        gameStarted,
        gameEnded,
        gameMode: 'basic',
        quarterScores,
        timeRemaining,
        timerDuration,
        homeFouls,
        awayFouls,
        timestamp: Date.now(),
        synced: false,
      });
    }, 2000); // Auto-save every 2 seconds
    
    return () => clearInterval(interval);
  }, [homeTeam, awayTeam, currentQuarter, overtime, gameStarted, gameEnded, quarterScores, currentQuarterHomeScore, currentQuarterAwayScore, timeRemaining, timerDuration, homeFouls, awayFouls]);

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
    setShowFinalScoreCard(true); // Show clean final score card for social media
    
    // Show scroll indicator on mobile and auto-scroll after brief delay
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowScrollIndicator(true);
      setTimeout(() => {
        const finalCard = document.getElementById("final-score-card");
        if (finalCard) {
          finalCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 1000);
    }
  };

  /**
   * Reset game to initial state
   * Clears all scores, teams, and game state
   * Requires user confirmation before resetting
   */
  /**
   * Reset game - Clear scores but keep teams (quick restart)
   */
  const resetGame = () => {
    if (confirm("🔄 Reset Game?\n\nThis will clear all scores and stats but keep the teams.\n\nUse 'New Game' to change teams.")) {
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
      clearCurrentGame(); // Clear localStorage
    }
  };

  /**
   * New Game - Go back to team selection
   */
  const newGame = () => {
    if (confirm("🆕 Start New Game?\n\nThis will clear everything and return to team selection.")) {
      clearCurrentGame(); // Clear localStorage
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

      // Clear localStorage after successful database save
      clearCurrentGame();
      
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

  /**
   * Export final score card as PNG image (for social media)
   */
  const exportAsImage = async () => {
    setSaving(true);
    try {
      const element = document.getElementById("final-score-card");
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        scale: 3, // High quality for social media
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });
      
      // Download as PNG
      const link = document.createElement('a');
      link.download = `${homeTeam}_vs_${awayTeam}_Final_Score.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Export final score card as PDF
   */
  const exportAsPDF = async () => {
    setSaving(true);
    try {
      const element = document.getElementById("final-score-card");
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#000000",
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });
      
      const imgData = canvas.toDataURL("image/png");
      
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "landscape",
        unit: "mm",
        format: imgHeight > 210 ? [imgWidth, imgHeight] : "a4",
      });
      
      const margin = 5;
      const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight);
      pdf.save(`${homeTeam}_vs_${awayTeam}_Final_Score.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
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
          <div className="flex items-center space-x-3">
            <button onClick={resetGame} className="text-gray-400 hover:text-white flex items-center space-x-1" title="Clear scores, keep teams">
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
            <button onClick={newGame} className="text-gray-400 hover:text-white flex items-center space-x-1" title="Start fresh with new teams">
              <PlusCircle className="w-5 h-5" />
              <span>New Game</span>
            </button>
          </div>
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
                  <div className="grid grid-cols-4 gap-1 w-full no-print">
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
                  <div className="grid grid-cols-4 gap-1 w-full no-print">
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
                    className="foul-btn-micro foul-btn-remove disabled:opacity-30 no-print"
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
                    className="foul-btn-micro foul-btn-add-home disabled:opacity-30 no-print"
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
                    className="foul-btn-micro foul-btn-remove disabled:opacity-30 no-print"
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
                    className="foul-btn-micro foul-btn-add-away disabled:opacity-30 no-print"
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
                  <div className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap no-print flex items-center gap-2 ${
                    gameEnded ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
                  }`}>
                    {!gameEnded && (
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                    {gameEnded ? 'FINAL' : 'LIVE'}
                  </div>
                </div>
              </div>
            </div>

            {/* Game Progress Button */}
            {!gameEnded && (
              <div className="mt-3 text-center no-print">
                <button
                  onClick={nextQuarter}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg text-sm sm:text-base w-full transition-colors"
                >
                  {currentQuarter < 4 ? `END ${quarterLabel} → NEXT` : 'END GAME'}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {!showFinalScoreCard ? (
              <div className="mt-6 flex flex-wrap justify-center gap-4 no-print">
                <button
                  onClick={saveGame}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? "Saving..." : "Save to Database"}</span>
                </button>
                <button
                  onClick={async () => {
                    setSaving(true);
                    try {
                      const element = document.getElementById("scoreboard-print");
                      if (!element) return;
                      
                      // Hide interactive elements before capture
                      const hideElements = element.querySelectorAll('.no-print');
                      hideElements.forEach(el => {
                        (el as HTMLElement).style.display = 'none';
                      });
                      
                      // Capture with full dimensions to prevent cutoff
                      const canvas = await html2canvas(element, { 
                        scale: 2,
                        backgroundColor: "#000000",
                        logging: false,
                        useCORS: true,
                        allowTaint: true,
                        scrollX: 0,
                        scrollY: 0,
                        width: element.scrollWidth,
                        height: element.scrollHeight,
                        windowWidth: element.scrollWidth,
                      });
                      
                      // Restore hidden elements
                      hideElements.forEach(el => {
                        (el as HTMLElement).style.display = '';
                      });
                      
                      const imgData = canvas.toDataURL("image/png");
                      
                      // Create PDF with proper dimensions
                      const imgWidth = 297; // A4 landscape width in mm
                      const imgHeight = (canvas.height * imgWidth) / canvas.width;
                      
                      const pdf = new jsPDF({
                        orientation: imgHeight > imgWidth ? "portrait" : "landscape",
                        unit: "mm",
                        format: imgHeight > 210 ? [imgWidth, imgHeight] : "a4",
                      });
                      
                      // Add 5mm margin on all sides to prevent edge cutoff
                      const margin = 5;
                      const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
                      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                      
                      pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight);
                      pdf.save(`${homeTeam}_vs_${awayTeam}_Scoreboard.pdf`);
                    } catch (error) {
                      console.error("Error generating PDF:", error);
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap justify-center gap-4 no-print">
                <button
                  onClick={saveGame}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? "Saving..." : "Save to Database"}</span>
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                  <Download className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Scroll down for export options</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scroll Indicator Banner - Mobile Only */}
        {showFinalScoreCard && showScrollIndicator && (
          <div className="md:hidden fixed top-0 left-0 right-0 bg-primary text-white px-4 py-3 z-50 shadow-lg">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span className="text-sm font-semibold">Export options available below</span>
              </div>
              <button
                onClick={() => {
                  const finalCard = document.getElementById("final-score-card");
                  if (finalCard) {
                    finalCard.scrollIntoView({ behavior: "smooth", block: "start" });
                    setShowScrollIndicator(false);
                  }
                }}
                className="text-white hover:text-gray-200"
                aria-label="Scroll to export options"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Clean Final Score Card */}
        {showFinalScoreCard && (
          <div className="mt-8">
            <div id="final-score-card" className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl border-2 border-primary/30">
              {/* FINAL Indicator */}
              <div className="text-center mb-8">
                <div className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg tracking-wide">
                  FINAL SCORE
                </div>
              </div>
              
              {/* Teams and Scores */}
              <div className="grid grid-cols-3 gap-6 items-end mb-10">
                {/* Home Team */}
                <div className="text-center flex flex-col items-center">
                  <div className="text-primary text-xl md:text-2xl font-bold mb-3 break-words leading-tight">{homeTeam}</div>
                  <div className="text-7xl md:text-8xl font-extrabold text-primary led-glow-primary-final leading-none" style={{ fontVariantNumeric: 'tabular-nums', lineHeight: '1' }}>
                    {totalHomeScore}
                  </div>
                </div>
                
                {/* VS */}
                <div className="text-center mb-4 flex items-center justify-center">
                  <div className="text-gray-500 text-2xl md:text-3xl font-bold">VS</div>
                </div>
                
                {/* Away Team */}
                <div className="text-center flex flex-col items-center">
                  <div className="text-secondary text-xl md:text-2xl font-bold mb-3 break-words leading-tight">{awayTeam}</div>
                  <div className="text-7xl md:text-8xl font-extrabold text-secondary led-glow-secondary-final leading-none" style={{ fontVariantNumeric: 'tabular-nums', lineHeight: '1' }}>
                    {totalAwayScore}
                  </div>
                </div>
              </div>
              
              {/* Quarter Breakdown */}
              <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
                <h3 className="text-gray-400 text-sm uppercase tracking-wider text-center mb-4 font-semibold">Quarter Breakdown</h3>
                <div className="grid grid-cols-4 gap-4">
                  {quarterScores.map((qs) => (
                    <div key={qs.quarter} className="text-center bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="text-yellow-400 text-xs font-bold mb-2">
                        {qs.quarter <= 4 ? `Q${qs.quarter}` : `OT${qs.quarter - 4}`}
                      </div>
                      <div className="text-white font-bold text-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {qs.homeScore}-{qs.awayScore}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Branding Footer */}
              <div className="text-center border-t border-gray-700 pt-4">
                <div className="text-primary text-base font-semibold mb-1">
                  Madina Basketball
                </div>
                <div className="text-gray-500 text-xs">
                  Your Game. Your Stats. Your Community.
                </div>
                <div className="text-gray-600 text-xs mt-1 font-mono">
                  madinabball.vercel.app/tools
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mt-8 max-w-3xl mx-auto">
              <button
                onClick={exportAsImage}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg disabled:opacity-50 shadow-lg transition-all"
              >
                <ImageIcon className="w-5 h-5" />
                <span>{saving ? "Generating..." : "Download Image"}</span>
              </button>
              <button
                onClick={exportAsPDF}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-lg disabled:opacity-50 shadow-lg transition-all"
              >
                <Download className="w-5 h-5" />
                <span>{saving ? "Generating..." : "Download PDF"}</span>
              </button>
              <button
                onClick={saveGame}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg disabled:opacity-50 shadow-lg transition-all"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? "Saving..." : "Save to Database"}</span>
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
        .led-glow-primary-final {
          text-shadow: 
            0 0 8px rgba(249, 115, 22, 0.9),
            0 0 16px rgba(249, 115, 22, 0.7),
            0 0 24px rgba(249, 115, 22, 0.5),
            0 0 32px rgba(249, 115, 22, 0.3);
          filter: drop-shadow(0 0 4px rgba(249, 115, 22, 0.6));
        }
        .led-glow-secondary-final {
          text-shadow: 
            0 0 8px rgba(0, 78, 137, 0.9),
            0 0 16px rgba(0, 78, 137, 0.7),
            0 0 24px rgba(0, 78, 137, 0.5),
            0 0 32px rgba(0, 78, 137, 0.3);
          filter: drop-shadow(0 0 4px rgba(0, 78, 137, 0.6));
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

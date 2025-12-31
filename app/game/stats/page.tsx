/**
 * Stats Scoreboard Component
 * 
 * Enhanced scoreboard with player statistics tracking.
 * Features:
 * - Real-time score tracking with player attribution
 * - Timer and fouls (matching basic scoreboard design)
 * - Player stats tracking
 * - Game events logging
 * 
 * @component
 */

"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BarChart3, Plus, Download, Save, ArrowLeft, X, Play, Pause, Clock, RotateCcw } from "lucide-react";
import Link from "next/link";
import TeamSelector from "@/components/TeamSelector";

interface Player {
  id: string;
  name: string;
  jerseyNumber: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  team: "home" | "away";
}

interface GameEvent {
  player_name: string;
  player_jersey: string;
  team: "home" | "away";
  event_type: 'basket' | 'missed_shot' | 'rebound' | 'assist' | 'steal' | 'block' | 'turnover' | 'foul';
  points: number;
  quarter: number;
  details?: any;
}

function StatsScoreboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [quarter, setQuarter] = useState(1);
  const [overtime, setOvertime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [saving, setSaving] = useState(false);

  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);

  const [showPlayerSelect, setShowPlayerSelect] = useState(false);
  const [pendingScore, setPendingScore] = useState<{
    team: "home" | "away";
    points: number;
  } | null>(null);

  // Timer state (matching basic scoreboard)
  const [timerDuration, setTimerDuration] = useState(600); // Default: 10 minutes
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Shot clock state (24 seconds for FIBA)
  const [shotClock, setShotClock] = useState(24);
  const [shotClockRunning, setShotClockRunning] = useState(false);
  const shotClockIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Team fouls tracking
  const [homeFouls, setHomeFouls] = useState(0);
  const [awayFouls, setAwayFouls] = useState(0);

  // Advanced stat tracking mode
  const [showStatModal, setShowStatModal] = useState(false);
  const [selectedStatType, setSelectedStatType] = useState<'rebound' | 'assist' | 'steal' | 'block' | 'turnover' | 'foul' | null>(null);

  // Quarter scores tracking
  const [quarterScores, setQuarterScores] = useState<Array<{
    quarter: number;
    homeScore: number;
    awayScore: number;
  }>>([]);

  // Generate timer duration options (5-30 minutes)
  const timerOptions = Array.from({ length: 26 }, (_, i) => (i + 5) * 60);

  useEffect(() => {
    // Load team data from team sheet (new dual-team format)
    const homeTeamParam = searchParams.get("homeTeam");
    const homePlayersParam = searchParams.get("homePlayers");
    const awayTeamParam = searchParams.get("awayTeam");
    const awayPlayersParam = searchParams.get("awayPlayers");

    // Legacy support (single team format)
    const team = searchParams.get("team");
    const playersParam = searchParams.get("players");

    // New dual-team format (preferred)
    if (homeTeamParam && homePlayersParam) {
      setHomeTeam(homeTeamParam);
      try {
        const parsedPlayers = JSON.parse(homePlayersParam);
        const playersList = parsedPlayers.map((p: any, index: number) => ({
          id: `home-player-${index}`,
          name: p.name,
          jerseyNumber: p.jerseyNumber || (index + 1).toString(),
          points: 0,
          team: "home" as const,
        }));
        setHomePlayers(playersList);
      } catch (error) {
        console.error("Error parsing home players:", error);
      }
    }

    if (awayTeamParam && awayPlayersParam) {
      setAwayTeam(awayTeamParam);
      try {
        const parsedPlayers = JSON.parse(awayPlayersParam);
        const playersList = parsedPlayers.map((p: any, index: number) => ({
          id: `away-player-${index}`,
          name: p.name,
          jerseyNumber: p.jerseyNumber || (index + 1).toString(),
          points: 0,
          team: "away" as const,
        }));
        setAwayPlayers(playersList);
      } catch (error) {
        console.error("Error parsing away players:", error);
      }
    }

    // Legacy format (backward compatibility)
    if (team && !homeTeamParam) {
      setHomeTeam(team);
    }

    if (playersParam && !homePlayersParam) {
      try {
        const parsedPlayers = JSON.parse(playersParam);
        const playersList = parsedPlayers.map((p: any, index: number) => ({
          id: `player-${index}`,
          name: p.name,
          jerseyNumber: p.jerseyNumber || (index + 1).toString(),
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          turnovers: 0,
          fouls: 0,
          fieldGoalsMade: 0,
          fieldGoalsAttempted: 0,
          threePointersMade: 0,
          threePointersAttempted: 0,
          team: "home" as const,
        }));
        setHomePlayers(playersList);
      } catch (error) {
        console.error("Error parsing players:", error);
      }
    }
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
   * Shot clock effect - handles 24-second countdown
   */
  useEffect(() => {
    if (shotClockRunning && shotClock > 0) {
      shotClockIntervalRef.current = setInterval(() => {
        setShotClock((prev) => {
          if (prev <= 1) {
            // Shot clock violation - play sound/alert
            setShotClockRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (shotClockIntervalRef.current) {
        clearInterval(shotClockIntervalRef.current);
        shotClockIntervalRef.current = null;
      }
    }

    return () => {
      if (shotClockIntervalRef.current) {
        clearInterval(shotClockIntervalRef.current);
      }
    };
  }, [shotClockRunning, shotClock]);

  /**
   * Reset shot clock to 24 seconds
   */
  const resetShotClock = () => {
    setShotClock(24);
    setShotClockRunning(true);
  };

  /**
   * Shot clock control functions
   */
  const startShotClock = () => setShotClockRunning(true);
  const pauseShotClock = () => setShotClockRunning(false);
  const set14SecondClock = () => {
    setShotClock(14);
    setShotClockRunning(true);
  };

  /**
   * Reset timer when quarter changes
   */
  useEffect(() => {
    setTimeRemaining(timerDuration);
    setIsTimerRunning(false);
    setIsTimerPaused(false);
    setHomeFouls(0);
    setAwayFouls(0);
  }, [quarter, timerDuration]);

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
      setHomeFouls((prev) => Math.min(prev + 1, 5));
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
   * Add player on-the-fly (BLOCKED after game starts)
   * Maintains data integrity by preventing mid-game roster changes
   */
  const addPlayer = (team: "home" | "away") => {
    // BLOCK adding players after game has started
    if (gameStarted) {
      alert(
        "⚠️ Cannot add players after game has started.\n\n" +
        "This protects data integrity and ensures accurate statistics.\n\n" +
        "Please add all players before starting the game."
      );
      return;
    }

    const name = prompt(`Enter player name for ${team === "home" ? homeTeam : awayTeam}:`);
    if (!name) return;

    const jerseyNumber = prompt("Enter jersey number (optional):") || "";

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name,
      jerseyNumber,
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fouls: 0,
      fieldGoalsMade: 0,
      fieldGoalsAttempted: 0,
      threePointersMade: 0,
      threePointersAttempted: 0,
      team,
    };

    if (team === "home") {
      setHomePlayers([...homePlayers, newPlayer]);
    } else {
      setAwayPlayers([...awayPlayers, newPlayer]);
    }
  };

  const handleScoreClick = (team: "home" | "away", points: number) => {
    if (gameEnded) return;
    if (!gameStarted) setGameStarted(true);

    setPendingScore({ team, points });
    setShowPlayerSelect(true);
  };

  const selectPlayer = (player: Player) => {
    if (!pendingScore) return;

    // Update scores
    if (pendingScore.team === "home") {
      setHomeScore((prev) => prev + pendingScore.points);
    } else {
      setAwayScore((prev) => prev + pendingScore.points);
    }

    // Update player stats - including shooting accuracy
    const is3Pointer = pendingScore.points === 3;
    const updatePlayerStats = (p: Player) => {
      if (p.id === player.id) {
        return {
          ...p,
          points: p.points + pendingScore.points,
          fieldGoalsMade: p.fieldGoalsMade + 1,
          fieldGoalsAttempted: p.fieldGoalsAttempted + 1,
          threePointersMade: is3Pointer ? p.threePointersMade + 1 : p.threePointersMade,
          threePointersAttempted: is3Pointer ? p.threePointersAttempted + 1 : p.threePointersAttempted,
        };
      }
      return p;
    };

    if (pendingScore.team === "home") {
      setHomePlayers((players) => players.map(updatePlayerStats));
    } else {
      setAwayPlayers((players) => players.map(updatePlayerStats));
    }

    // Record game event
    const event: GameEvent = {
      player_name: player.name,
      player_jersey: player.jerseyNumber,
      team: pendingScore.team,
      event_type: "basket",
      points: pendingScore.points,
      quarter,
      details: { shotType: is3Pointer ? '3pt' : '2pt' },
    };
    setGameEvents([...gameEvents, event]);

    // Reset shot clock on score
    resetShotClock();

    // Reset
    setPendingScore(null);
    setShowPlayerSelect(false);
  };

  /**
   * Record non-scoring stats (rebounds, assists, steals, blocks, turnovers, fouls)
   */
  const recordStat = (player: Player, statType: 'rebound' | 'assist' | 'steal' | 'block' | 'turnover' | 'foul') => {
    const updatePlayerStat = (p: Player) => {
      if (p.id === player.id) {
        return {
          ...p,
          [statType + 's']: (p[statType + 's' as keyof Player] as number) + 1,
        };
      }
      return p;
    };

    if (player.team === "home") {
      setHomePlayers((players) => players.map(updatePlayerStat));
    } else {
      setAwayPlayers((players) => players.map(updatePlayerStat));
    }

    // Record game event
    const event: GameEvent = {
      player_name: player.name,
      player_jersey: player.jerseyNumber,
      team: player.team,
      event_type: statType,
      points: 0,
      quarter,
    };
    setGameEvents([...gameEvents, event]);

    // Reset shot clock on defensive rebound or steal
    if (statType === 'rebound' || statType === 'steal') {
      resetShotClock();
    }
  };

  /**
   * Open stat recording modal
   */
  const openStatModal = (statType: 'rebound' | 'assist' | 'steal' | 'block' | 'turnover' | 'foul') => {
    setSelectedStatType(statType);
    setShowStatModal(true);
  };

  /**
   * Record missed shot (for FG% tracking)
   */
  const recordMissedShot = (player: Player, is3Pointer: boolean) => {
    const updatePlayerStats = (p: Player) => {
      if (p.id === player.id) {
        return {
          ...p,
          fieldGoalsAttempted: p.fieldGoalsAttempted + 1,
          threePointersAttempted: is3Pointer ? p.threePointersAttempted + 1 : p.threePointersAttempted,
        };
      }
      return p;
    };

    if (player.team === "home") {
      setHomePlayers((players) => players.map(updatePlayerStats));
    } else {
      setAwayPlayers((players) => players.map(updatePlayerStats));
    }

    // Record game event
    const event: GameEvent = {
      player_name: player.name,
      player_jersey: player.jerseyNumber,
      team: player.team,
      event_type: "missed_shot",
      points: 0,
      quarter,
      details: { shotType: is3Pointer ? '3pt' : '2pt' },
    };
    setGameEvents([...gameEvents, event]);
  };

  const skipPlayerSelection = () => {
    if (!pendingScore) return;

    // Update scores without player attribution
    if (pendingScore.team === "home") {
      setHomeScore((prev) => prev + pendingScore.points);
    } else {
      setAwayScore((prev) => prev + pendingScore.points);
    }

    // Record game event without player attribution
    const event: GameEvent = {
      player_name: "Team",
      player_jersey: "",
      team: pendingScore.team,
      event_type: "basket",
      points: pendingScore.points,
      quarter,
    };
    setGameEvents([...gameEvents, event]);

    setPendingScore(null);
    setShowPlayerSelect(false);
  };

  /**
   * Undo the last scoring event
   * Professional basketball standard: Only allows undo for current quarter
   * Completed quarters are "locked" to maintain data integrity
   */
  const undoLastEvent = () => {
    if (gameEvents.length === 0) return;
    
    const lastEvent = gameEvents[gameEvents.length - 1];
    
    // ✅ PROFESSIONAL STANDARD: Only allow undo for current quarter
    if (lastEvent.quarter !== quarter) {
      alert(
        "⚠️ Cannot Undo Events from Completed Quarters\n\n" +
        `The event you're trying to undo occurred in Quarter ${lastEvent.quarter <= 4 ? lastEvent.quarter : `OT${lastEvent.quarter - 4}`}.\n\n` +
        "Following official basketball scorekeeping standards, completed quarters are locked to maintain data integrity.\n\n" +
        "✓ You can only undo events from the current quarter.\n" +
        "✓ For corrections to past quarters, note them separately and adjust final totals if needed."
      );
      return;
    }
    
    // Event is from current quarter - proceed with undo
    if (lastEvent.team === "home") {
      setHomeScore((prev) => Math.max(0, prev - lastEvent.points));
    } else {
      setAwayScore((prev) => Math.max(0, prev - lastEvent.points));
    }
    
    // Remove points from player stats
    if (lastEvent.points > 0 && lastEvent.player_name !== "Team") {
      const updatePlayerStats = (p: Player) => {
        if (p.name === lastEvent.player_name && p.jerseyNumber === lastEvent.player_jersey) {
          const is3Pointer = lastEvent.points === 3;
          return {
            ...p,
            points: Math.max(0, p.points - lastEvent.points),
            fieldGoalsMade: Math.max(0, p.fieldGoalsMade - 1),
            fieldGoalsAttempted: Math.max(0, p.fieldGoalsAttempted - 1),
            threePointersMade: is3Pointer ? Math.max(0, p.threePointersMade - 1) : p.threePointersMade,
            threePointersAttempted: is3Pointer ? Math.max(0, p.threePointersAttempted - 1) : p.threePointersAttempted,
          };
        }
        return p;
      };

      if (lastEvent.team === "home") {
        setHomePlayers((players) => players.map(updatePlayerStats));
      } else {
        setAwayPlayers((players) => players.map(updatePlayerStats));
      }
    }
    
    // Remove other stats (rebounds, assists, etc.) if applicable
    if (lastEvent.event_type !== "basket" && lastEvent.event_type !== "missed_shot") {
      const statType = lastEvent.event_type + 's'; // 'rebound' -> 'rebounds'
      const updatePlayerStat = (p: Player) => {
        if (p.name === lastEvent.player_name && p.jerseyNumber === lastEvent.player_jersey) {
          return {
            ...p,
            [statType]: Math.max(0, (p[statType as keyof Player] as number) - 1),
          };
        }
        return p;
      };

      if (lastEvent.team === "home") {
        setHomePlayers((players) => players.map(updatePlayerStat));
      } else {
        setAwayPlayers((players) => players.map(updatePlayerStat));
      }
    }
    
    // Remove the event from history
    setGameEvents(gameEvents.slice(0, -1));
  };

  const nextQuarter = () => {
    if (!homeTeam || !awayTeam) {
      alert("Please enter both team names");
      return;
    }

    // Save current quarter scores
    setQuarterScores([...quarterScores, {
      quarter,
      homeScore,
      awayScore,
    }]);

    if (quarter < 4) {
      setQuarter((prev) => prev + 1);
      setHomeScore(0);
      setAwayScore(0);
    } else {
      const totalHome = quarterScores.reduce((sum, qs) => sum + qs.homeScore, 0) + homeScore;
      const totalAway = quarterScores.reduce((sum, qs) => sum + qs.awayScore, 0) + awayScore;
      
      if (totalHome === totalAway) {
        startOvertime();
      } else {
        endGame();
      }
    }
  };

  const startOvertime = () => {
    // Save current quarter scores
    setQuarterScores([...quarterScores, {
      quarter,
      homeScore,
      awayScore,
    }]);
    setOvertime((prev) => prev + 1);
    setQuarter(5 + overtime);
    setHomeScore(0);
    setAwayScore(0);
  };

  const endGame = () => {
    if (!homeTeam || !awayTeam) {
      alert("Please enter both team names");
      return;
    }
    // Save final quarter before ending
    setQuarterScores([...quarterScores, {
      quarter,
      homeScore,
      awayScore,
    }]);
    setGameEnded(true);
    resetTimer(); // Stop timer when game ends
  };

  /**
   * Reset game to initial state
   * Clears all scores, teams, players, and game state
   * Requires user confirmation before resetting
   */
  const resetGame = () => {
    if (confirm("Are you sure you want to reset the game? All progress will be lost.")) {
      setHomeTeam("");
      setAwayTeam("");
      setQuarter(1);
      setOvertime(0);
      setGameStarted(false);
      setGameEnded(false);
      setHomeScore(0);
      setAwayScore(0);
      setHomePlayers([]);
      setAwayPlayers([]);
      setGameEvents([]);
      resetTimer();
      setHomeFouls(0);
      setAwayFouls(0);
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
      // Create game
      const gameResponse = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_team: homeTeam,
          away_team: awayTeam,
          home_score: homeScore,
          away_score: awayScore,
          quarter: quarter,
          overtime: overtime,
          game_mode: "stats",
          status: "final",
          game_date: new Date().toISOString(),
        }),
      });

      if (!gameResponse.ok) {
        throw new Error("Failed to save game");
      }

      const gameData = await gameResponse.json();

      // Save game events
      for (const event of gameEvents) {
        await fetch(`/api/games/${gameData.id}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...event,
            game_id: gameData.id,
          }),
        });
      }

      alert("Game and stats saved successfully!");
      router.push(`/game/${gameData.id}`);
    } catch (error) {
      console.error("Error saving game:", error);
      alert("Failed to save game. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const canProgress = homeTeam && awayTeam && gameStarted;

  const currentPlayers = pendingScore
    ? pendingScore.team === "home"
      ? homePlayers
      : awayPlayers
    : [];
  const currentTeamName = pendingScore
    ? pendingScore.team === "home"
      ? homeTeam
      : awayTeam
    : "";

  const quarterLabel = quarter <= 4 ? `Q${quarter}` : `OT${overtime}`;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/game" className="hover:text-white transition-colors">
              Game Modes
            </Link>
            <span>/</span>
            <Link href="/teamsheet" className="hover:text-white transition-colors">
              Team Sheet
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Player Stats</span>
          </nav>
        </div>

        {/* Top Controls */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/teamsheet" className="text-gray-400 hover:text-white flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Edit Rosters</span>
          </Link>
          <h1 className="text-white text-xl font-bold">PLAYER STATS SCOREBOARD</h1>
          <button onClick={resetGame} className="text-gray-400 hover:text-white flex items-center space-x-2">
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Team Setup (Before Game Starts) */}
        {!gameStarted && (
          <div className="bg-gray-800 rounded-xl p-8 mb-6">
            <h2 className="text-white text-xl font-bold mb-6 text-center">Setup Teams & Players</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <TeamSelector
                  value={homeTeam}
                  onChange={setHomeTeam}
                  label="Home Team"
                  placeholder="Select home team"
                  allowCustom={true}
                />
                <button
                  onClick={() => addPlayer("home")}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  + Add Player
                </button>
                {homePlayers.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    {homePlayers.length} players added
                  </div>
                )}
              </div>
              <div>
                <TeamSelector
                  value={awayTeam}
                  onChange={setAwayTeam}
                  label="Away Team"
                  placeholder="Select away team"
                  allowCustom={true}
                />
                <button
                  onClick={() => addPlayer("away")}
                  className="mt-2 text-sm text-secondary hover:underline"
                >
                  + Add Player
                </button>
                {awayPlayers.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    {awayPlayers.length} players added
                  </div>
                )}
              </div>
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

        {/* Digital Scoreboard - Matching Basic Design */}
        {gameStarted && (
          <div id="scoreboard-print" className="relative mb-6">
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
                {homeScore}
              </div>
                  </div>
                  {/* Compact Score Buttons */}
              {!gameEnded && (
                    <div className="grid grid-cols-4 gap-1 w-full">
                  <button
                    onClick={() => handleScoreClick("home", 1)}
                        className="score-btn-micro score-btn-home"
                        aria-label="Add 1 point"
                        title="+1"
                    disabled={!homeTeam || !awayTeam}
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleScoreClick("home", 2)}
                        className="score-btn-micro score-btn-home"
                        aria-label="Add 2 points"
                        title="+2"
                    disabled={!homeTeam || !awayTeam}
                  >
                    +2
                  </button>
                  <button
                    onClick={() => handleScoreClick("home", 3)}
                        className="score-btn-micro score-btn-home"
                        aria-label="Add 3 points"
                        title="+3"
                    disabled={!homeTeam || !awayTeam}
                  >
                    +3
                  </button>
                      <button 
                        onClick={undoLastEvent}
                        className="score-btn-micro score-btn-undo"
                        aria-label="Undo last action in current quarter"
                        title="Undo Last (Current Quarter Only)"
                        disabled={gameEvents.filter(e => e.quarter === quarter).length === 0}
                      >
                        Undo
                  </button>
                </div>
              )}
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
                {awayScore}
              </div>
                  </div>
                  {/* Compact Score Buttons */}
              {!gameEnded && (
                    <div className="grid grid-cols-4 gap-1 w-full">
                  <button
                    onClick={() => handleScoreClick("away", 1)}
                        className="score-btn-micro score-btn-away"
                        aria-label="Add 1 point"
                        title="+1"
                    disabled={!homeTeam || !awayTeam}
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleScoreClick("away", 2)}
                        className="score-btn-micro score-btn-away"
                        aria-label="Add 2 points"
                        title="+2"
                    disabled={!homeTeam || !awayTeam}
                  >
                    +2
                  </button>
                  <button
                    onClick={() => handleScoreClick("away", 3)}
                        className="score-btn-micro score-btn-away"
                        aria-label="Add 3 points"
                        title="+3"
                    disabled={!homeTeam || !awayTeam}
                  >
                    +3
                  </button>
                      <button 
                        onClick={undoLastEvent}
                        className="score-btn-micro score-btn-undo"
                        aria-label="Undo last action in current quarter"
                        title="Undo Last (Current Quarter Only)"
                        disabled={gameEvents.filter(e => e.quarter === quarter).length === 0}
                      >
                        Undo
                  </button>
                </div>
              )}
            </div>
          </div>

              {/* Compact Team Fouls Display - Aligned with Scores */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {/* Home Team Fouls */}
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

                {/* Away Team Fouls */}
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
                    {quarterScores.map((qs, idx) => (
                      <div key={idx} className="text-center bg-gray-800 rounded px-2 py-1 flex-1 min-w-[50px] max-w-[80px]">
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

              {/* Game Progress Button */}
              {!gameEnded && (
                <div className="mt-3 text-center">
              <button
                    onClick={nextQuarter}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg text-sm sm:text-base w-full transition-colors"
              >
                    {quarter < 4 ? `END ${quarterLabel} → NEXT` : 'END GAME'}
              </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {gameEnded ? (
              <>
                <button
                  onClick={saveGame}
                  disabled={saving}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg disabled:opacity-50"
                  >
                      <Save className="w-5 h-5" />
                    <span>{saving ? "Saving..." : "Save Game & Stats"}</span>
                </button>
                <button
                  onClick={() => window.print()}
                    className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
                >
                  <Download className="w-5 h-5" />
                  <span>Print</span>
                </button>
              </>
              ) : (
                <button
                  onClick={endGame}
                  disabled={!homeTeam || !awayTeam}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg disabled:opacity-50"
                >
                  End Game
                </button>
            )}
          </div>
        </div>
        )}

        {/* Player Stats - Below Scoreboard */}
        {gameStarted && (homePlayers.length > 0 || awayPlayers.length > 0) && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-white text-xl font-bold mb-4 text-center">Player Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {homePlayers.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-primary mb-3 text-center">
                    {homeTeam || "Home Team"}
                </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                  {homePlayers
                    .sort((a, b) => b.points - a.points)
                    .map((player) => (
                      <div
                        key={player.id}
                          className="flex items-center justify-between p-2 bg-gray-800 rounded"
                      >
                        <div>
                            <span className="font-semibold text-white">{player.name}</span>
                          {player.jerseyNumber && (
                              <span className="text-xs text-gray-400 ml-2">
                              #{player.jerseyNumber}
                            </span>
                          )}
                        </div>
                          <span className="text-lg font-bold text-primary">
                            {player.points} pts
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {awayPlayers.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-secondary mb-3 text-center">
                    {awayTeam || "Away Team"}
                </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                  {awayPlayers
                    .sort((a, b) => b.points - a.points)
                    .map((player) => (
                      <div
                        key={player.id}
                          className="flex items-center justify-between p-2 bg-gray-800 rounded"
                      >
                        <div>
                            <span className="font-semibold text-white">{player.name}</span>
                          {player.jerseyNumber && (
                              <span className="text-xs text-gray-400 ml-2">
                              #{player.jerseyNumber}
                            </span>
                          )}
                        </div>
                          <span className="text-lg font-bold text-secondary">
                            {player.points} pts
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            </div>
          </div>
        )}

        {/* Player Selection Modal */}
        {showPlayerSelect && pendingScore && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Who scored? ({currentTeamName})
                </h2>
                <button
                  onClick={skipPlayerSelection}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-lg font-bold text-primary text-center">
                  +{pendingScore.points} points
                </p>
                </div>
                {currentPlayers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {currentPlayers
                      .sort((a, b) => {
                        // Sort by jersey number if available, otherwise by name
                        const aNum = parseInt(a.jerseyNumber) || 999;
                        const bNum = parseInt(b.jerseyNumber) || 999;
                        return aNum - bNum;
                      })
                      .map((player) => (
                      <button
                        key={player.id}
                        onClick={() => selectPlayer(player)}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                      >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900 text-lg">
                          {player.name}
                            </span>
                        {player.jerseyNumber && (
                              <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                            #{player.jerseyNumber}
                              </span>
                        )}
                          </div>
                        <div className="text-sm text-gray-500 mt-1">
                            Current: <span className="font-semibold">{player.points}</span> pts
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      No players in roster. Please add players to the team.
                    </p>
                    <button
                      onClick={() => {
                        addPlayer(pendingScore.team);
                        setShowPlayerSelect(false);
                        setPendingScore(null);
                      }}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
                    >
                      Add Player
                    </button>
                  </div>
                )}
                <button
                  onClick={skipPlayerSelection}
                  className="w-full mt-4 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Skip (Don't attribute to player)
                </button>
              </div>
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
        
        .score-btn-micro:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        
        .score-btn-micro:active:not(:disabled) {
          transform: scale(0.95);
        }
        
        .score-btn-micro:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
        
        .score-btn-micro.score-btn-home:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff7b45 0%, #ff6b35 100%);
          box-shadow: 0 2px 12px rgba(255, 107, 53, 0.6);
        }
        
        .score-btn-micro.score-btn-away {
          background: linear-gradient(135deg, #004e89 0%, #003d6b 100%);
          color: white;
          border-color: rgba(0, 78, 137, 0.4);
        }
        
        .score-btn-micro.score-btn-away:hover:not(:disabled) {
          background: linear-gradient(135deg, #005fa3 0%, #004e89 100%);
          box-shadow: 0 2px 12px rgba(0, 78, 137, 0.6);
        }
        
        .score-btn-micro.score-btn-undo {
          background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
          color: white;
          border-color: rgba(75, 85, 99, 0.4);
        }
        
        .score-btn-micro.score-btn-undo:hover:not(:disabled) {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
        }
        
        /* Micro Foul Buttons */
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

export default function StatsScoreboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <StatsScoreboardContent />
    </Suspense>
  );
}


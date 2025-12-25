"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BarChart3, Plus, Download, Save, ArrowLeft, X } from "lucide-react";
import Link from "next/link";

interface Player {
  id: string;
  name: string;
  jerseyNumber: string;
  points: number;
  team: "home" | "away";
}

interface GameEvent {
  player_name: string;
  player_jersey: string;
  team: "home" | "away";
  event_type: string;
  points: number;
  quarter: number;
}

export default function StatsScoreboard() {
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

  useEffect(() => {
    // Load team data if coming from team sheet
    const team = searchParams.get("team");
    const playersParam = searchParams.get("players");

    if (team) {
      setHomeTeam(team);
    }

    if (playersParam) {
      try {
        const parsedPlayers = JSON.parse(playersParam);
        const playersList = parsedPlayers.map((p: any, index: number) => ({
          id: `player-${index}`,
          name: p.name,
          jerseyNumber: p.jerseyNumber || (index + 1).toString(),
          points: 0,
          team: "home" as const,
        }));
        setHomePlayers(playersList);
      } catch (error) {
        console.error("Error parsing players:", error);
      }
    }
  }, [searchParams]);

  const addPlayer = (team: "home" | "away") => {
    const name = prompt(`Enter player name for ${team === "home" ? homeTeam : awayTeam}:`);
    if (!name) return;

    const jerseyNumber = prompt("Enter jersey number (optional):") || "";

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name,
      jerseyNumber,
      points: 0,
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

    // Update player stats
    if (pendingScore.team === "home") {
      setHomePlayers((players) =>
        players.map((p) =>
          p.id === player.id ? { ...p, points: p.points + pendingScore.points } : p
        )
      );
    } else {
      setAwayPlayers((players) =>
        players.map((p) =>
          p.id === player.id ? { ...p, points: p.points + pendingScore.points } : p
        )
      );
    }

    // Record game event
    const event: GameEvent = {
      player_name: player.name,
      player_jersey: player.jerseyNumber,
      team: pendingScore.team,
      event_type: "basket",
      points: pendingScore.points,
      quarter,
    };
    setGameEvents([...gameEvents, event]);

    // Reset
    setPendingScore(null);
    setShowPlayerSelect(false);
  };

  const skipPlayerSelection = () => {
    if (!pendingScore) return;

    // Update scores without player attribution
    if (pendingScore.team === "home") {
      setHomeScore((prev) => prev + pendingScore.points);
    } else {
      setAwayScore((prev) => prev + pendingScore.points);
    }

    setPendingScore(null);
    setShowPlayerSelect(false);
  };

  const nextQuarter = () => {
    if (quarter < 4) {
      setQuarter((prev) => prev + 1);
    }
  };

  const startOvertime = () => {
    setOvertime((prev) => prev + 1);
  };

  const endGame = () => {
    if (!homeTeam || !awayTeam) {
      alert("Please enter both team names");
      return;
    }
    setGameEnded(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/game"
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Change Mode</span>
          </Link>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">
              Player Stats Mode
            </h1>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Team Names Input */}
        {!gameStarted && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Setup Game
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Team *
                </label>
                <input
                  type="text"
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  placeholder="e.g., Madina Old Gees"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                />
                <button
                  onClick={() => addPlayer("home")}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  + Add Player
                </button>
                {homePlayers.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    {homePlayers.length} players added
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Away Team *
                </label>
                <input
                  type="text"
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  placeholder="e.g., Oyibi Eagles"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                />
                <button
                  onClick={() => addPlayer("away")}
                  className="mt-2 text-sm text-secondary hover:underline"
                >
                  + Add Player
                </button>
                {awayPlayers.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    {awayPlayers.length} players added
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scoreboard */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {/* Score Display */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {homeTeam || "Home Team"}
              </h3>
              <div className="text-7xl font-bold text-primary mb-4">
                {homeScore}
              </div>
              {!gameEnded && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleScoreClick("home", 1)}
                    disabled={!homeTeam || !awayTeam}
                    className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleScoreClick("home", 2)}
                    disabled={!homeTeam || !awayTeam}
                    className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => handleScoreClick("home", 3)}
                    disabled={!homeTeam || !awayTeam}
                    className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50"
                  >
                    +3
                  </button>
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {awayTeam || "Away Team"}
              </h3>
              <div className="text-7xl font-bold text-secondary mb-4">
                {awayScore}
              </div>
              {!gameEnded && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleScoreClick("away", 1)}
                    disabled={!homeTeam || !awayTeam}
                    className="w-full px-4 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-semibold disabled:opacity-50"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleScoreClick("away", 2)}
                    disabled={!homeTeam || !awayTeam}
                    className="w-full px-4 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-semibold disabled:opacity-50"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => handleScoreClick("away", 3)}
                    disabled={!homeTeam || !awayTeam}
                    className="w-full px-4 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-semibold disabled:opacity-50"
                  >
                    +3
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quarter Controls */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="text-sm text-gray-600 mb-1">Period</div>
                <div className="text-2xl font-bold text-gray-900">
                  {overtime > 0 ? `OT ${overtime}` : `Q${quarter}`}
                </div>
              </div>
              {!gameEnded && (
                <div className="flex space-x-3">
                  {quarter < 4 && (
                    <button
                      onClick={nextQuarter}
                      disabled={!canProgress}
                      className="px-4 py-2 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold disabled:opacity-50"
                    >
                      Next Quarter →
                    </button>
                  )}
                  {quarter === 4 && (
                    <button
                      onClick={startOvertime}
                      disabled={!canProgress}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold disabled:opacity-50"
                    >
                      Start OT
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Game Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!gameEnded ? (
              <button
                onClick={endGame}
                disabled={!canProgress}
                className="w-full px-6 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50"
              >
                End Game
              </button>
            ) : (
              <>
                <button
                  onClick={saveGame}
                  disabled={saving}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Game & Stats</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-semibold"
                >
                  <Download className="w-5 h-5" />
                  <span>Print</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Player Stats */}
        {(homePlayers.length > 0 || awayPlayers.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {homePlayers.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-primary mb-4">
                  {homeTeam} Stats
                </h3>
                <div className="space-y-2">
                  {homePlayers
                    .sort((a, b) => b.points - a.points)
                    .map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="font-semibold">{player.name}</span>
                          {player.jerseyNumber && (
                            <span className="text-sm text-gray-600 ml-2">
                              #{player.jerseyNumber}
                            </span>
                          )}
                        </div>
                        <span className="text-xl font-bold text-primary">
                          {player.points}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {awayPlayers.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-secondary mb-4">
                  {awayTeam} Stats
                </h3>
                <div className="space-y-2">
                  {awayPlayers
                    .sort((a, b) => b.points - a.points)
                    .map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="font-semibold">{player.name}</span>
                          {player.jerseyNumber && (
                            <span className="text-sm text-gray-600 ml-2">
                              #{player.jerseyNumber}
                            </span>
                          )}
                        </div>
                        <span className="text-xl font-bold text-secondary">
                          {player.points}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
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
                <p className="text-sm text-gray-600 mb-4">
                  +{pendingScore.points} points
                </p>
                {currentPlayers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentPlayers.map((player) => (
                      <button
                        key={player.id}
                        onClick={() => selectPlayer(player)}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                      >
                        <div className="font-semibold text-gray-900">
                          {player.name}
                        </div>
                        {player.jerseyNumber && (
                          <div className="text-sm text-gray-600">
                            #{player.jerseyNumber}
                          </div>
                        )}
                        <div className="text-sm text-gray-500 mt-1">
                          Current: {player.points} pts
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      No players added yet
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
    </div>
  );
}


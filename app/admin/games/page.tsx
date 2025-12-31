"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, Plus, Edit, Trash2, Eye, Filter, Calendar, Printer } from "lucide-react";

interface Game {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  quarter: number;
  overtime: number;
  game_mode: string;
  status: string;
  game_date: string;
  location: string;
  created_at: string;
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchGames();
  }, [filter]);

  const fetchGames = async () => {
    try {
      const url =
        filter === "all" ? "/api/games" : `/api/games?status=${filter}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('Failed to fetch games:', response.statusText);
        setGames([]);
        return;
      }
      
      const data = await response.json();
      // Ensure data is an array
      setGames(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching games:", error);
      setGames([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, gameInfo: string) => {
    const confirmed = confirm(
      `⚠️ WARNING: Delete Game?\n\n"${gameInfo}"\n\nThis action cannot be undone. Are you sure you want to delete this game?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/games/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete game");
      }

      fetchGames();
    } catch (error) {
      console.error("Error deleting game:", error);
      alert("Failed to delete game");
    }
  };

  const handlePrint = (game: Game) => {
    // Create a printable view of the game
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const winner =
      game.home_score > game.away_score
        ? game.home_team
        : game.away_score > game.home_score
        ? game.away_team
        : "Tie Game";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${game.home_team} vs ${game.away_team} - Game Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #ff6b35;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              margin: 0;
              color: #1a1a1a;
              font-size: 32px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .scoreboard {
              display: flex;
              justify-content: space-around;
              align-items: center;
              background: #f5f5f5;
              padding: 30px;
              border-radius: 10px;
              margin: 30px 0;
            }
            .team {
              text-align: center;
            }
            .team-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .score {
              font-size: 48px;
              font-weight: bold;
              color: #ff6b35;
            }
            .vs {
              font-size: 20px;
              color: #999;
            }
            .winner {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              color: #4caf50;
              margin: 20px 0;
            }
            .details {
              margin-top: 30px;
              padding: 20px;
              background: #fafafa;
              border-radius: 8px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #666;
            }
            .value {
              color: #1a1a1a;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #999;
              font-size: 12px;
              border-top: 1px solid #e0e0e0;
              padding-top: 20px;
            }
            @media print {
              body {
                margin: 0;
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Madina Basketball</h1>
            <p>Official Game Report</p>
          </div>

          <div class="scoreboard">
            <div class="team">
              <div class="team-name">${game.home_team}</div>
              <div class="score">${game.home_score}</div>
            </div>
            <div class="vs">VS</div>
            <div class="team">
              <div class="team-name">${game.away_team}</div>
              <div class="score">${game.away_score}</div>
            </div>
          </div>

          ${winner !== "Tie Game" ? `<div class="winner">🏆 Winner: ${winner}</div>` : '<div class="winner">Final: Tie Game</div>'}

          <div class="details">
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="value">${game.status.toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Game Mode:</span>
              <span class="value">${game.game_mode.charAt(0).toUpperCase() + game.game_mode.slice(1)}</span>
            </div>
            <div class="detail-row">
              <span class="label">Quarter/Period:</span>
              <span class="value">${game.overtime > 0 ? `OT ${game.overtime}` : `Quarter ${game.quarter}`}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">${new Date(game.game_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="detail-row">
              <span class="label">Location:</span>
              <span class="value">${game.location}</span>
            </div>
            <div class="detail-row">
              <span class="label">Game ID:</span>
              <span class="value">${game.id}</span>
            </div>
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Madina Basketball - Libya Quarters, Madina, Accra, Ghana</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800";
      case "final":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading games...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Games Management
          </h1>
          <p className="text-gray-600">
            View and manage all games and scoreboards
          </p>
        </div>
        <Link
          href="/game"
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          <Plus className="w-5 h-5" />
          <span>New Game</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 font-medium rounded-t-lg ${
            filter === "all"
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All Games ({games.length})
        </button>
        <button
          onClick={() => setFilter("live")}
          className={`px-4 py-2 font-medium rounded-t-lg ${
            filter === "live"
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Live
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`px-4 py-2 font-medium rounded-t-lg ${
            filter === "upcoming"
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter("final")}
          className={`px-4 py-2 font-medium rounded-t-lg ${
            filter === "final"
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Games List */}
      {games.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No games found</p>
          <p className="text-sm text-gray-500 mb-4">
            {filter === "all"
              ? "Create your first game to get started"
              : `No ${filter} games`}
          </p>
          <Link
            href="/game"
            className="inline-block text-primary hover:underline"
          >
            Start a new game
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {games.map((game) => {
            const winner =
              game.home_score > game.away_score
                ? game.home_team
                : game.away_score > game.home_score
                ? game.away_team
                : "Tie";

            return (
              <div
                key={game.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Status and Mode */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          game.status
                        )}`}
                      >
                        {game.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {game.game_mode} mode
                      </span>
                      {game.game_date && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(game.game_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Score Display */}
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="text-lg">
                        <span className="font-bold">{game.home_team}</span>
                        <span className="mx-2 text-2xl font-bold text-primary">
                          {game.home_score}
                        </span>
                      </div>
                      <span className="text-gray-400">vs</span>
                      <div className="text-lg">
                        <span className="mx-2 text-2xl font-bold text-secondary">
                          {game.away_score}
                        </span>
                        <span className="font-bold">{game.away_team}</span>
                      </div>
                    </div>

                    {/* Winner/Quarter Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {game.status === "final" && winner !== "Tie" && (
                        <span className="text-green-600 font-semibold">
                          🏆 Winner: {winner}
                        </span>
                      )}
                      {game.status === "final" && winner === "Tie" && (
                        <span className="text-gray-600 font-semibold">
                          Final: Tie Game
                        </span>
                      )}
                      <span>
                        {game.overtime > 0
                          ? `OT ${game.overtime}`
                          : `Quarter ${game.quarter}`}
                      </span>
                      <span>• {game.location}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/game/${game.id}`}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                      title="View game"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handlePrint(game)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Print game report"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(
                          game.id,
                          `${game.home_team} vs ${game.away_team}`
                        )
                      }
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete game"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Stats */}
      {games.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {games.length}
              </div>
              <div className="text-sm text-gray-600">Total Games</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {games.filter((g) => g.status === "live").length}
              </div>
              <div className="text-sm text-gray-600">Live Now</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {games.filter((g) => g.status === "upcoming").length}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {games.filter((g) => g.status === "final").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


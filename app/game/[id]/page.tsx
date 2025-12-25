"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trophy, Calendar, MapPin, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

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
  notes?: string;
  events?: any[];
}

export default function GameViewPage() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGame();
  }, [params.id]);

  const fetchGame = async () => {
    try {
      const response = await fetch(`/api/games/${params.id}`);
      if (!response.ok) {
        throw new Error("Game not found");
      }
      const data = await response.json();
      setGame(data);
    } catch (error) {
      console.error("Error fetching game:", error);
      alert("Failed to load game");
      router.push("/game");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  const winner =
    game.home_score > game.away_score
      ? game.home_team
      : game.away_score > game.home_score
      ? game.away_team
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            href="/admin/games"
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Games</span>
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>

        {/* Game Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Status Badge */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    game.status === "final"
                      ? "bg-green-100 text-green-800"
                      : game.status === "live"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {game.status.toUpperCase()}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {game.game_mode} Mode
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {game.game_date && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(game.game_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{game.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scoreboard */}
          <div className="p-8">
            {/* Team Names */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {game.home_team}
                </h2>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  Home
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {game.away_team}
                </h2>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  Away
                </div>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div
                className={`rounded-xl p-8 text-center ${
                  winner === game.home_team
                    ? "bg-green-50 border-2 border-green-500"
                    : "bg-gray-50"
                }`}
              >
                <div className="text-7xl font-bold text-primary mb-2">
                  {game.home_score}
                </div>
                {winner === game.home_team && (
                  <div className="inline-block px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                    🏆 Winner
                  </div>
                )}
              </div>
              <div
                className={`rounded-xl p-8 text-center ${
                  winner === game.away_team
                    ? "bg-green-50 border-2 border-green-500"
                    : "bg-gray-50"
                }`}
              >
                <div className="text-7xl font-bold text-secondary mb-2">
                  {game.away_score}
                </div>
                {winner === game.away_team && (
                  <div className="inline-block px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                    🏆 Winner
                  </div>
                )}
              </div>
            </div>

            {/* Game Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Final Period</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {game.overtime > 0 ? `OT ${game.overtime}` : `Q${game.quarter}`}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Total Points
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {game.home_score + game.away_score}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {game.notes && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-semibold text-blue-900 mb-1">
                  Notes:
                </div>
                <div className="text-sm text-blue-800">{game.notes}</div>
              </div>
            )}

            {/* Event Timeline (if available) */}
            {game.events && game.events.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Game Events
                </h3>
                <div className="space-y-2">
                  {game.events.map((event: any) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                    >
                      <div>
                        <span className="font-semibold">{event.player_name}</span>
                        <span className="text-gray-600 mx-2">•</span>
                        <span className="capitalize">{event.event_type}</span>
                        {event.points > 0 && (
                          <span className="text-primary font-semibold ml-2">
                            +{event.points} pts
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500">Q{event.quarter}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


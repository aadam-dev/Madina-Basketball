"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Trophy, BarChart3, Clipboard } from "lucide-react";
import Link from "next/link";

function GameModePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [teamData, setTeamData] = useState<any>(null);

  useEffect(() => {
    // Check if coming from team sheet with roster data
    const team = searchParams.get("team");
    const players = searchParams.get("players");

    if (team && players) {
      setTeamData({ team, players });
    }
  }, [searchParams]);

  const startGame = (mode: string) => {
    if (teamData) {
      router.push(
        `/game/${mode}?team=${encodeURIComponent(teamData.team)}&players=${encodeURIComponent(teamData.players)}`
      );
    } else {
      router.push(`/game/${mode}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-primary transition-colors">
              Tools
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Game Modes</span>
          </nav>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Game Mode
          </h1>
          <p className="text-lg text-gray-600">
            Select the type of game tracking you need
          </p>
          {teamData && (
            <div className="mt-4 inline-block bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <p className="text-sm text-green-800">
                <strong>Roster loaded:</strong> {JSON.parse(teamData.players).length} players from {teamData.team}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Scoreboard */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-primary">
            <div className="bg-primary p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center">
                Basic Scoreboard
              </h2>
              <div className="mt-2 inline-block bg-white/20 rounded-full px-3 py-1 w-full">
                <p className="text-xs text-white text-center font-semibold">
                  RECOMMENDED
                </p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Quick and simple score tracking for casual games
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start text-sm">
                  <span className="text-primary mr-2 font-bold">✓</span>
                  <span>Score tracking (+1, +2, +3)</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-primary mr-2 font-bold">✓</span>
                  <span>Quarter management</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-primary mr-2 font-bold">✓</span>
                  <span>Overtime support</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-primary mr-2 font-bold">✓</span>
                  <span>Save & print results</span>
                </li>
              </ul>
              <button
                onClick={() => startGame("basic")}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
              >
                Start Basic Game
              </button>
            </div>
          </div>

          {/* Player Stats Mode */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-secondary p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center">
                Player Stats
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Track individual player performance and contributions
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start text-sm">
                  <span className="text-secondary mr-2 font-bold">✓</span>
                  <span>Everything in Basic</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-secondary mr-2 font-bold">✓</span>
                  <span>Track who scored each basket</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-secondary mr-2 font-bold">✓</span>
                  <span>Player points summary</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-secondary mr-2 font-bold">✓</span>
                  <span>Game event timeline</span>
                </li>
              </ul>
              <button
                onClick={() => startGame("stats")}
                className="w-full px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-semibold"
              >
                Start Stats Mode
              </button>
            </div>
          </div>

          {/* Full Game Management */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gray-800 p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Clipboard className="w-8 h-8 text-gray-800" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center">
                Full Management
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Complete game management with advanced stats and analytics
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start text-sm">
                  <span className="text-gray-800 mr-2 font-bold">✓</span>
                  <span>Everything in Player Stats</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-gray-800 mr-2 font-bold">✓</span>
                  <span>Fouls & foul-outs</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-gray-800 mr-2 font-bold">✓</span>
                  <span>Timeouts tracking</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-gray-800 mr-2 font-bold">✓</span>
                  <span>Substitutions log</span>
                </li>
              </ul>
              <button
                onClick={() => startGame("full")}
                className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Start Full Mode
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/tools"
            className="text-gray-600 hover:text-primary transition-colors underline"
          >
            ← Back to Tools
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GameModePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <GameModePageContent />
    </Suspense>
  );
}


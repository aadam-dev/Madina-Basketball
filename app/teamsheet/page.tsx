"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TeamSelector from "@/components/TeamSelector";

interface Player {
  id: string;
  name: string;
  position: string;
  jerseyNumber: string;
}

const BASKETBALL_POSITIONS = [
  "Point Guard (PG)",
  "Shooting Guard (SG)",
  "Small Forward (SF)",
  "Power Forward (PF)",
  "Center (C)",
  "Guard (G)",
  "Forward (F)",
  "Utility",
];

export default function TeamSheetGenerator() {
  // Home team state
  const [homeTeam, setHomeTeam] = useState("");
  const [homePlayers, setHomePlayers] = useState<Player[]>([
    { id: "home-1", name: "", position: "", jerseyNumber: "" },
  ]);
  
  // Away team state
  const [awayTeam, setAwayTeam] = useState("");
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([
    { id: "away-1", name: "", position: "", jerseyNumber: "" },
  ]);
  
  // Legacy support (for backward compatibility)
  const [teamName, setTeamName] = useState("");
  const [opponent, setOpponent] = useState("");
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "", position: "", jerseyNumber: "" },
  ]);
  
  const [gameDate, setGameDate] = useState("");
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState<"single" | "dual">("dual"); // "single" for legacy, "dual" for new workflow

  // Home team player management
  const addHomePlayer = () => {
    setHomePlayers([
      ...homePlayers,
      {
        id: `home-${Date.now()}`,
        name: "",
        position: "",
        jerseyNumber: "",
      },
    ]);
  };

  const removeHomePlayer = (id: string) => {
    if (homePlayers.length > 1) {
      setHomePlayers(homePlayers.filter((p) => p.id !== id));
    }
  };

  const updateHomePlayer = (id: string, field: keyof Player, value: string) => {
    setHomePlayers(
      homePlayers.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Away team player management
  const addAwayPlayer = () => {
    setAwayPlayers([
      ...awayPlayers,
      {
        id: `away-${Date.now()}`,
        name: "",
        position: "",
        jerseyNumber: "",
      },
    ]);
  };

  const removeAwayPlayer = (id: string) => {
    if (awayPlayers.length > 1) {
      setAwayPlayers(awayPlayers.filter((p) => p.id !== id));
    }
  };

  const updateAwayPlayer = (id: string, field: keyof Player, value: string) => {
    setAwayPlayers(
      awayPlayers.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Legacy player management (for backward compatibility)
  const addPlayer = () => {
    setPlayers([
      ...players,
      {
        id: Date.now().toString(),
        name: "",
        position: "",
        jerseyNumber: "",
      },
    ]);
  };

  const removePlayer = (id: string) => {
    if (players.length > 1) {
      setPlayers(players.filter((p) => p.id !== id));
    }
  };

  const updatePlayer = (id: string, field: keyof Player, value: string) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const generatePDF = async () => {
    // Use dual mode if both teams are set, otherwise use legacy single team mode
    const useDualMode = mode === "dual" && homeTeam && awayTeam;
    const teamNameForPDF = useDualMode ? homeTeam : teamName;
    
    if (!teamNameForPDF) {
      alert("Please enter a team name");
      return;
    }

    const filledPlayers = useDualMode 
      ? homePlayers.filter((p) => p.name.trim() !== "")
      : players.filter((p) => p.name.trim() !== "");
      
    if (filledPlayers.length === 0) {
      alert("Please add at least one player");
      return;
    }

    setGenerating(true);

    try {
      const element = document.getElementById("teamsheet-preview");
      if (!element) return;

      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Download
      const fileName = `${teamNameForPDF.replace(/\s+/g, "_")}_TeamSheet_${
        gameDate || new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const filledHomePlayers = homePlayers.filter((p) => p.name.trim() !== "");
  const filledAwayPlayers = awayPlayers.filter((p) => p.name.trim() !== "");
  const filledPlayers = players.filter((p) => p.name.trim() !== ""); // Legacy

  // Validation for dual mode
  const canStartStatsMode = mode === "dual" && 
    homeTeam && 
    awayTeam && 
    filledHomePlayers.length > 0 && 
    filledAwayPlayers.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <span className="text-gray-900 font-medium">Team Sheet Generator</span>
        </nav>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Team Sheet Generator
        </h1>
        <p className="text-gray-600">
          Create professional team sheets for games and events. For Player Stats mode, both teams are required.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Game Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Date (Optional)
                </label>
                <input
                  type="date"
                  value={gameDate}
                  onChange={(e) => setGameDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Home Team Section */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-primary p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary">Home Team</h2>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Required</span>
            </div>

            <div className="mb-4">
              <TeamSelector
                value={homeTeam}
                onChange={setHomeTeam}
                label="Home Team Name *"
                placeholder="Select or type home team name"
                allowCustom={true}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Player Roster</h3>
              <button
                onClick={addHomePlayer}
                className="flex items-center space-x-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Add Player</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {homePlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) =>
                        updateHomePlayer(player.id, "name", e.target.value)
                      }
                      placeholder={`Player ${index + 1} Name`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={player.position}
                        onChange={(e) =>
                          updateHomePlayer(player.id, "position", e.target.value)
                        }
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                      >
                        <option value="">Position</option>
                        {BASKETBALL_POSITIONS.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={player.jerseyNumber}
                        onChange={(e) =>
                          updateHomePlayer(player.id, "jerseyNumber", e.target.value)
                        }
                        placeholder="Jersey #"
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  {homePlayers.length > 1 && (
                    <button
                      onClick={() => removeHomePlayer(player.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {filledHomePlayers.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {filledHomePlayers.length} player{filledHomePlayers.length !== 1 ? 's' : ''} added
              </p>
            )}
          </div>

          {/* Away Team Section */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-secondary p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-secondary">Away Team</h2>
              <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">Required</span>
            </div>

            <div className="mb-4">
              <TeamSelector
                value={awayTeam}
                onChange={setAwayTeam}
                label="Away Team Name *"
                placeholder="Select or type away team name"
                allowCustom={true}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Player Roster</h3>
              <button
                onClick={addAwayPlayer}
                className="flex items-center space-x-1 px-3 py-1.5 bg-secondary text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Add Player</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {awayPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) =>
                        updateAwayPlayer(player.id, "name", e.target.value)
                      }
                      placeholder={`Player ${index + 1} Name`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={player.position}
                        onChange={(e) =>
                          updateAwayPlayer(player.id, "position", e.target.value)
                        }
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-secondary focus:border-transparent bg-white"
                      >
                        <option value="">Position</option>
                        {BASKETBALL_POSITIONS.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={player.jerseyNumber}
                        onChange={(e) =>
                          updateAwayPlayer(player.id, "jerseyNumber", e.target.value)
                        }
                        placeholder="Jersey #"
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-secondary focus:border-transparent"
                      />
                    </div>
                  </div>
                  {awayPlayers.length > 1 && (
                    <button
                      onClick={() => removeAwayPlayer(player.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {filledAwayPlayers.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {filledAwayPlayers.length} player{filledAwayPlayers.length !== 1 ? 's' : ''} added
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Start Player Stats Game - Primary Action */}
            <Link
              href={{
                pathname: "/game/stats",
                query: {
                  homeTeam: homeTeam,
                  homePlayers: JSON.stringify(
                    filledHomePlayers.map((p) => ({
                      name: p.name,
                      jerseyNumber: p.jerseyNumber,
                      position: p.position,
                    }))
                  ),
                  awayTeam: awayTeam,
                  awayPlayers: JSON.stringify(
                    filledAwayPlayers.map((p) => ({
                      name: p.name,
                      jerseyNumber: p.jerseyNumber,
                      position: p.position,
                    }))
                  ),
                },
              }}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-4 bg-secondary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg ${
                !canStartStatsMode ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <span className="text-xl">🏀</span>
              <span>Start Player Stats Game</span>
            </Link>

            {/* Secondary Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={generatePDF}
                disabled={generating || !homeTeam || filledHomePlayers.length === 0}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {generating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>

              <Link
                href={{
                  pathname: "/statssheet",
                  query: {
                    team: homeTeam,
                    players: JSON.stringify(
                      filledHomePlayers.map((p) => ({
                        name: p.name,
                        jerseyNumber: p.jerseyNumber,
                        position: p.position,
                      }))
                    ),
                  },
                }}
                className={`flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold ${
                  !homeTeam || filledHomePlayers.length === 0
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Stats Sheet</span>
              </Link>
            </div>

            {/* Validation Message */}
            {!canStartStatsMode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Both teams must have at least one player to start Player Stats mode.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-3 lg:sticky lg:top-8 lg:self-start">
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-900">Preview</h2>
            </div>

            {/* Team Sheet Preview */}
            <div
              id="teamsheet-preview"
              className="bg-white rounded-lg shadow-lg p-8"
              style={{ minHeight: "500px" }}
            >
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                {homeTeam && awayTeam ? (
                  <>
                    <h1 className="text-3xl font-bold text-primary mb-1">
                      {homeTeam}
                    </h1>
                    <p className="text-2xl font-bold text-gray-400 my-2">VS</p>
                    <h1 className="text-3xl font-bold text-secondary mb-2">
                      {awayTeam}
                    </h1>
                  </>
                ) : (
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {homeTeam || teamName || "Team Name"}
                  </h1>
                )}
                <p className="text-lg text-gray-600">
                  Madina Basketball Court
                </p>
                {gameDate && (
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(gameDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>

              {/* Dual Team Rosters */}
              {homeTeam && awayTeam ? (
                <div className="grid grid-cols-2 gap-6">
                  {/* Home Team Roster */}
                  <div>
                    <h2 className="text-lg font-bold text-primary mb-3 pb-2 border-b-2 border-primary">
                      {homeTeam.toUpperCase()} ROSTER
                    </h2>
                    {filledHomePlayers.length > 0 ? (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left py-1 px-1 text-xs font-bold text-gray-700">#</th>
                            <th className="text-left py-1 px-1 text-xs font-bold text-gray-700">NAME</th>
                            <th className="text-left py-1 px-1 text-xs font-bold text-gray-700">POS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filledHomePlayers.map((player, index) => (
                            <tr key={player.id} className="border-b border-gray-200">
                              <td className="py-2 px-1 text-sm font-bold text-gray-900">
                                {player.jerseyNumber || index + 1}
                              </td>
                              <td className="py-2 px-1 text-sm font-semibold text-gray-900">
                                {player.name}
                              </td>
                              <td className="py-2 px-1 text-xs text-gray-700">
                                {player.position ? player.position.split(' ')[0] : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-400 italic text-center py-4 text-sm">
                        Add players
                      </p>
                    )}
                  </div>

                  {/* Away Team Roster */}
                  <div>
                    <h2 className="text-lg font-bold text-secondary mb-3 pb-2 border-b-2 border-secondary">
                      {awayTeam.toUpperCase()} ROSTER
                    </h2>
                    {filledAwayPlayers.length > 0 ? (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left py-1 px-1 text-xs font-bold text-gray-700">#</th>
                            <th className="text-left py-1 px-1 text-xs font-bold text-gray-700">NAME</th>
                            <th className="text-left py-1 px-1 text-xs font-bold text-gray-700">POS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filledAwayPlayers.map((player, index) => (
                            <tr key={player.id} className="border-b border-gray-200">
                              <td className="py-2 px-1 text-sm font-bold text-gray-900">
                                {player.jerseyNumber || index + 1}
                              </td>
                              <td className="py-2 px-1 text-sm font-semibold text-gray-900">
                                {player.name}
                              </td>
                              <td className="py-2 px-1 text-xs text-gray-700">
                                {player.position ? player.position.split(' ')[0] : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-400 italic text-center py-4 text-sm">
                        Add players
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Legacy Single Team Roster */
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    ROSTER
                  </h2>
                  {filledPlayers.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-300">
                          <th className="text-left py-2 px-2 text-sm font-bold text-gray-700">#</th>
                          <th className="text-left py-2 px-2 text-sm font-bold text-gray-700">PLAYER NAME</th>
                          <th className="text-left py-2 px-2 text-sm font-bold text-gray-700">POSITION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filledPlayers.map((player, index) => (
                          <tr key={player.id} className="border-b border-gray-200">
                            <td className="py-3 px-2 text-base font-bold text-gray-900">
                              {player.jerseyNumber || index + 1}
                            </td>
                            <td className="py-3 px-2 text-base font-semibold text-gray-900">
                              {player.name}
                            </td>
                            <td className="py-3 px-2 text-sm text-gray-700">
                              {player.position || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-400 italic text-center py-8">
                      Add players to see roster preview
                    </p>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  Generated by Madina Basketball • Libya Quarters, Madina, Accra
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              This preview shows how your team sheet will look in the PDF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


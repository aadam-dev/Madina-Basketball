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
  const [teamName, setTeamName] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "", position: "", jerseyNumber: "" },
  ]);
  const [generating, setGenerating] = useState(false);

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
    if (!teamName) {
      alert("Please enter a team name");
      return;
    }

    const filledPlayers = players.filter((p) => p.name.trim() !== "");
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
      const fileName = `${teamName.replace(/\s+/g, "_")}_TeamSheet_${
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

  const filledPlayers = players.filter((p) => p.name.trim() !== "");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Team Sheet Generator
        </h1>
        <p className="text-gray-600">
          Create professional team sheets for games and events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Team Information
            </h2>

            <div className="space-y-4">
              <div>
                <TeamSelector
                  value={teamName}
                  onChange={setTeamName}
                  label="Team Name *"
                  placeholder="Select or type team name"
                  allowCustom={true}
                />
              </div>

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

              <div>
                <TeamSelector
                  value={opponent}
                  onChange={setOpponent}
                  label="Opponent (Optional)"
                  placeholder="Select or type opponent team"
                  allowCustom={true}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Player Roster</h2>
              <button
                onClick={addPlayer}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Player</span>
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) =>
                        updatePlayer(player.id, "name", e.target.value)
                      }
                      placeholder={`Player ${index + 1} Name`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={player.position}
                        onChange={(e) =>
                          updatePlayer(player.id, "position", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                      >
                        <option value="">Select Position</option>
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
                          updatePlayer(
                            player.id,
                            "jerseyNumber",
                            e.target.value
                          )
                        }
                        placeholder="Jersey #"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  {players.length > 1 && (
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={generatePDF}
            disabled={generating || !teamName || filledPlayers.length === 0}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
          >
            {generating ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Team Sheet (PDF)</span>
              </>
            )}
          </button>

          {/* Additional Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Link
              href={{
                pathname: "/statssheet",
                query: {
                  team: teamName,
                  players: JSON.stringify(
                    filledPlayers.map((p) => ({
                      name: p.name,
                      jerseyNumber: p.jerseyNumber,
                      position: p.position,
                    }))
                  ),
                },
              }}
              className={`flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold ${
                !teamName || filledPlayers.length === 0
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Generate Blank Stats Sheet</span>
            </Link>

            <Link
              href={{
                pathname: "/game",
                query: {
                  team: teamName,
                  players: JSON.stringify(
                    filledPlayers.map((p) => ({
                      name: p.name,
                      jerseyNumber: p.jerseyNumber,
                      position: p.position,
                    }))
                  ),
                },
              }}
              className={`flex items-center justify-center space-x-2 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-semibold ${
                !teamName || filledPlayers.length === 0
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              <span className="text-xl">🏀</span>
              <span>Start Live Game</span>
            </Link>
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
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {teamName || "Team Name"}
                </h1>
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
                {opponent && (
                  <p className="text-base text-gray-700 mt-2 font-semibold">
                    vs {opponent}
                  </p>
                )}
              </div>

              {/* Player List */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  ROSTER
                </h2>
                {filledPlayers.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-2 px-2 text-sm font-bold text-gray-700">
                          #
                        </th>
                        <th className="text-left py-2 px-2 text-sm font-bold text-gray-700">
                          PLAYER NAME
                        </th>
                        <th className="text-left py-2 px-2 text-sm font-bold text-gray-700">
                          POSITION
                        </th>
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


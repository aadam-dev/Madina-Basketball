"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Trash2, Download, FileText, Info } from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TeamSelector from "@/components/TeamSelector";

interface PlayerStats {
  id: string;
  name: string;
  jerseyNumber: string;
  points: string;
  rebounds: string;
  assists: string;
  steals: string;
  blocks: string;
  turnovers: string;
  fouls: string;
  minutes: string;
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

function StatsSheetGeneratorContent() {
  const searchParams = useSearchParams();
  const [teamName, setTeamName] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [players, setPlayers] = useState<PlayerStats[]>([
    {
      id: "1",
      name: "",
      jerseyNumber: "",
      points: "",
      rebounds: "",
      assists: "",
      steals: "",
      blocks: "",
      turnovers: "",
      fouls: "",
      minutes: "",
    },
  ]);
  const [generating, setGenerating] = useState(false);
  const [isPreFilled, setIsPreFilled] = useState(false);

  // Load roster from team sheet if provided
  useEffect(() => {
    const teamParam = searchParams.get("team");
    const playersParam = searchParams.get("players");

    if (teamParam) {
      setTeamName(teamParam);
    }

    if (playersParam) {
      try {
        const parsedPlayers = JSON.parse(playersParam);
        if (Array.isArray(parsedPlayers) && parsedPlayers.length > 0) {
          setPlayers(
            parsedPlayers.map((p: any, index: number) => ({
              id: `prefilled-${index}`,
              name: p.name || "",
              jerseyNumber: p.jerseyNumber || "",
              points: "",
              rebounds: "",
              assists: "",
              steals: "",
              blocks: "",
              turnovers: "",
              fouls: "",
              minutes: "",
            }))
          );
          setIsPreFilled(true);
        }
      } catch (error) {
        console.error("Error parsing players data:", error);
      }
    }
  }, [searchParams]);

  const addPlayer = () => {
    setPlayers([
      ...players,
      {
        id: Date.now().toString(),
        name: "",
        jerseyNumber: "",
        points: "",
        rebounds: "",
        assists: "",
        steals: "",
        blocks: "",
        turnovers: "",
        fouls: "",
        minutes: "",
      },
    ]);
  };

  const removePlayer = (id: string) => {
    if (players.length > 1) {
      setPlayers(players.filter((p) => p.id !== id));
    }
  };

  const updatePlayer = (
    id: string,
    field: keyof PlayerStats,
    value: string
  ) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const calculateTotals = () => {
    const filledPlayers = players.filter((p) => p.name.trim() !== "");
    return {
      points: filledPlayers.reduce(
        (sum, p) => sum + (parseInt(p.points) || 0),
        0
      ),
      rebounds: filledPlayers.reduce(
        (sum, p) => sum + (parseInt(p.rebounds) || 0),
        0
      ),
      assists: filledPlayers.reduce(
        (sum, p) => sum + (parseInt(p.assists) || 0),
        0
      ),
      steals: filledPlayers.reduce(
        (sum, p) => sum + (parseInt(p.steals) || 0),
        0
      ),
      blocks: filledPlayers.reduce(
        (sum, p) => sum + (parseInt(p.blocks) || 0),
        0
      ),
      turnovers: filledPlayers.reduce(
        (sum, p) => sum + (parseInt(p.turnovers) || 0),
        0
      ),
      fouls: filledPlayers.reduce(
        (sum, p) => sum + (parseInt(p.fouls) || 0),
        0
      ),
      minutes: filledPlayers.reduce(
        (sum, p) => sum + (parseInt(p.minutes) || 0),
        0
      ),
    };
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
      const element = document.getElementById("statssheet-preview");
      if (!element) return;

      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Download
      const fileName = `${teamName.replace(/\s+/g, "_")}_StatsSheet_${
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
  const totals = calculateTotals();

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
          <span className="text-gray-900 font-medium">Stats Sheet Generator</span>
        </nav>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Blank Stats Sheet Generator
        </h1>
        <p className="text-gray-600">
          Create printable blank statistics sheets for manual tracking during games
        </p>
        <div className="mt-2 bg-blue-50 border-l-4 border-blue-400 p-3">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This generates a blank form with player names and jersey numbers. 
            Stats columns are left empty for manual filling during the game with pen/pencil.
          </p>
        </div>
        {isPreFilled && (
          <div className="mt-2 bg-green-50 border-l-4 border-green-400 p-3">
            <div className="flex items-start">
              <Info className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-green-800">
                <strong>Roster Pre-filled!</strong> Your team roster from the team sheet has been loaded. 
                You can add more players if needed.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Game Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., Madina Old Gees"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opponent (Optional)
                </label>
                <input
                  type="text"
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  placeholder="e.g., Oyibi Eagles"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Player Statistics
              </h2>
              <button
                onClick={addPlayer}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Player</span>
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Player {index + 1}
                    </h3>
                    {players.length > 1 && (
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) =>
                        updatePlayer(player.id, "name", e.target.value)
                      }
                      placeholder="Player Name"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={player.jerseyNumber}
                      onChange={(e) =>
                        updatePlayer(player.id, "jerseyNumber", e.target.value)
                      }
                      placeholder="Jersey #"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="mt-3 text-xs text-gray-500 italic">
                    Leave stats blank - this will print as a blank form for manual filling during the game
                  </div>
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
                <span>Download Stats Sheet (PDF)</span>
              </>
            )}
          </button>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-3 lg:sticky lg:top-8 lg:self-start">
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-900">Preview</h2>
            </div>

            {/* Stats Sheet Preview */}
            <div
              id="statssheet-preview"
              className="bg-white rounded-lg shadow-lg p-8 overflow-x-auto"
              style={{ minHeight: "500px" }}
            >
              {/* Header */}
              <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {teamName || "Team Name"}
                </h1>
                <p className="text-base text-gray-600">
                  Madina Basketball Court - Game Statistics
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
                  <p className="text-base text-gray-700 mt-1 font-semibold">
                    vs {opponent}
                  </p>
                )}
              </div>

              {/* Stats Table */}
              <div className="overflow-x-auto">
                {filledPlayers.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-2 px-2 font-bold text-gray-700">
                          #
                        </th>
                        <th className="text-left py-2 px-2 font-bold text-gray-700">
                          PLAYER
                        </th>
                        <th className="text-center py-2 px-2 font-bold text-gray-700">
                          PTS
                        </th>
                        <th className="text-center py-2 px-2 font-bold text-gray-700">
                          REB
                        </th>
                        <th className="text-center py-2 px-2 font-bold text-gray-700">
                          AST
                        </th>
                        <th className="text-center py-2 px-2 font-bold text-gray-700">
                          STL
                        </th>
                        <th className="text-center py-2 px-2 font-bold text-gray-700">
                          BLK
                        </th>
                        <th className="text-center py-2 px-2 font-bold text-gray-700">
                          TO
                        </th>
                        <th className="text-center py-2 px-2 font-bold text-gray-700">
                          FLS
                        </th>
                        <th className="text-center py-2 px-2 font-bold text-gray-700">
                          MIN
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filledPlayers.map((player, index) => (
                        <tr
                          key={player.id}
                          className="border-b border-gray-200"
                        >
                          <td className="py-2 px-2 font-bold text-gray-900">
                            {player.jerseyNumber || index + 1}
                          </td>
                          <td className="py-2 px-2 font-semibold text-gray-900">
                            {player.name}
                          </td>
                          <td className="py-2 px-2 text-center text-gray-300">
                            _____
                          </td>
                          <td className="py-2 px-2 text-center text-gray-300">
                            _____
                          </td>
                          <td className="py-2 px-2 text-center text-gray-300">
                            _____
                          </td>
                          <td className="py-2 px-2 text-center text-gray-300">
                            _____
                          </td>
                          <td className="py-2 px-2 text-center text-gray-300">
                            _____
                          </td>
                          <td className="py-2 px-2 text-center text-gray-300">
                            _____
                          </td>
                          <td className="py-2 px-2 text-center text-gray-300">
                            _____
                          </td>
                          <td className="py-2 px-2 text-center text-gray-300">
                            _____
                          </td>
                        </tr>
                      ))}
                      {/* Totals Row */}
                      <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                        <td className="py-2 px-2" colSpan={2}>
                          TEAM TOTALS
                        </td>
                        <td className="py-2 px-2 text-center text-gray-300">
                          _____
                        </td>
                        <td className="py-2 px-2 text-center text-gray-300">
                          _____
                        </td>
                        <td className="py-2 px-2 text-center text-gray-300">
                          _____
                        </td>
                        <td className="py-2 px-2 text-center text-gray-300">
                          _____
                        </td>
                        <td className="py-2 px-2 text-center text-gray-300">
                          _____
                        </td>
                        <td className="py-2 px-2 text-center text-gray-300">
                          _____
                        </td>
                        <td className="py-2 px-2 text-center text-gray-300">
                          _____
                        </td>
                        <td className="py-2 px-2 text-center text-gray-300">
                          _____
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-400 italic text-center py-8">
                    Add players and stats to see preview
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  Generated by Madina Basketball • Libya Quarters, Madina,
                  Accra
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              This preview shows how your stats sheet will look in the PDF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatsSheetGenerator() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <StatsSheetGeneratorContent />
    </Suspense>
  );
}


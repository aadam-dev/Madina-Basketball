"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Plus, Edit, Trash2, Info } from "lucide-react";

interface Player {
  id: string;
  name: string;
  role: string;
  description: string;
  image_url: string;
  section: string;
  order_index: number;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      // For now, we'll use the team API and filter for player-type members
      // Once the database is updated, this will use a dedicated players endpoint
      const response = await fetch("/api/team");
      const data = await response.json();
      // Filter for players only (exclude executive, coach, etc.)
      const playerData = data.filter((member: Player) => 
        !['executive', 'coach', 'maintenance', 'stakeholder', 'media'].includes(member.section)
      );
      setPlayers(playerData);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, playerName: string) => {
    const confirmed = confirm(
      `⚠️ WARNING: Delete Player?\n\n"${playerName}"\n\nThis action cannot be undone. Are you sure you want to delete this player?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete player");
      }

      fetchPlayers();
    } catch (error) {
      console.error("Error deleting player:", error);
      alert("Failed to delete player");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading players...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Players Management</h1>
          <p className="text-gray-600">Manage team players and roster information</p>
        </div>
        <Link
          href="/admin/players/new"
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          <Plus className="w-5 h-5" />
          <span>Add Player</span>
        </Link>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This section is for managing team roster players (e.g., Zurak Basketball, Madina Old Gees players).
              For staff and leadership management, use the <Link href="/admin/staff" className="underline font-semibold">Staff & Leadership</Link> section.
            </p>
          </div>
        </div>
      </div>

      {/* Players List */}
      {players.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No players found</p>
          <p className="text-sm text-gray-500 mb-4">
            Once the database is updated, players will appear here
          </p>
          <Link
            href="/admin/players/new"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Add your first player
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                    {player.image_url ? (
                      <img
                        src={player.image_url}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{player.name}</h3>
                  <p className="text-sm text-primary font-medium">{player.role}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/players/${player.id}`}
                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(player.id, player.name)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete player"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {player.description && (
                <p className="text-sm text-gray-600 line-clamp-3">{player.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Coming Soon Notice */}
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-yellow-800">
              <strong>Database Update Required:</strong> A dedicated players table with fields for jersey number, position, team, height, etc. will be created soon. 
              This will provide better player management capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


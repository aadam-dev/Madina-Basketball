"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Plus, Edit, Trash2 } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image_url: string;
  section: string;
  order_index: number;
}

export default function TeamPage() {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchMembers();
  }, [filter]);

  const fetchMembers = async () => {
    try {
      const url = filter === "all" ? "/api/team" : `/api/team?section=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    const confirmed = confirm(
      `⚠️ WARNING: Delete Team Member?\n\n"${memberName}"\n\nThis action cannot be undone. Are you sure you want to delete this team member?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete team member");
      }

      fetchMembers();
    } catch (error) {
      console.error("Error deleting team member:", error);
      alert("Failed to delete team member");
    }
  };

  const sections = ["all", "executive", "coach", "maintenance", "stakeholder", "media"];

  if (loading) {
    return <div className="text-center py-12">Loading team members...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Members</h1>
          <p className="text-gray-600">Manage team members and their information</p>
        </div>
        <Link
          href="/admin/team/new"
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          <Plus className="w-5 h-5" />
          <span>Add Member</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 border-b">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setFilter(section)}
            className={`px-4 py-2 font-medium capitalize ${
              filter === section
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Team Members List */}
      {members.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No team members found</p>
          <Link
            href="/admin/team/new"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Add your first team member
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{member.section}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/team/${member.id}`}
                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete team member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {member.description && (
                <p className="text-sm text-gray-600 line-clamp-3">{member.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


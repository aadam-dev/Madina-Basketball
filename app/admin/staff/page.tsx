"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserCog, Plus, Edit, Trash2, Info, Shield, Trophy, Wrench } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image_url: string;
  section: string;
  order_index: number;
}

const STAFF_SECTIONS = {
  executive: { icon: Shield, label: "Executive/Management", color: "blue" },
  coach: { icon: Trophy, label: "Coaches", color: "green" },
  maintenance: { icon: Wrench, label: "Maintenance & Operations", color: "purple" },
  stakeholder: { icon: UserCog, label: "Key Stakeholders", color: "orange" },
  media: { icon: UserCog, label: "Media Team", color: "pink" },
};

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchStaff();
  }, [filter]);

  const fetchStaff = async () => {
    try {
      // Fetch all team members and filter for staff sections
      const response = await fetch("/api/team");
      const data = await response.json();
      
      // Filter for staff roles only
      const staffData = data.filter((member: StaffMember) =>
        ["executive", "coach", "maintenance", "stakeholder", "media"].includes(member.section)
      );
      
      // Apply additional filter if not "all"
      const filteredData = filter === "all" 
        ? staffData 
        : staffData.filter((member: StaffMember) => member.section === filter);
      
      setStaff(filteredData);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, staffName: string) => {
    const confirmed = confirm(
      `⚠️ WARNING: Delete Staff Member?\n\n"${staffName}"\n\nThis action cannot be undone. Are you sure you want to delete this staff member?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete staff member");
      }

      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff member:", error);
      alert("Failed to delete staff member");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading staff...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff & Leadership</h1>
          <p className="text-gray-600">Manage executive team, coaches, and operational staff</p>
        </div>
        <Link
          href="/admin/team/new"
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          <Plus className="w-5 h-5" />
          <span>Add Staff Member</span>
        </Link>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This section manages staff, coaches, and leadership (displayed on the public site).
              For player roster management, use the <Link href="/admin/players" className="underline font-semibold">Players</Link> section.
            </p>
          </div>
        </div>
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
          All Staff ({staff.length})
        </button>
        {Object.entries(STAFF_SECTIONS).map(([key, { label }]) => {
          const count = staff.filter((s) => s.section === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 font-medium rounded-t-lg ${
                filter === key
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Staff List */}
      {staff.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <UserCog className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No staff members found</p>
          <p className="text-sm text-gray-500 mb-4">
            {filter === "all" 
              ? "Add your first staff member to get started" 
              : `No staff members in the ${STAFF_SECTIONS[filter as keyof typeof STAFF_SECTIONS]?.label} category`}
          </p>
          <Link
            href="/admin/team/new"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Add staff member
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => {
            const sectionInfo = STAFF_SECTIONS[member.section as keyof typeof STAFF_SECTIONS];
            const Icon = sectionInfo?.icon || UserCog;
            
            return (
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
                        <UserCog className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <p className="text-xs text-gray-500 capitalize">{sectionInfo?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/team/${member.id}`}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                      title="Edit staff member"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(member.id, member.name)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete staff member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {member.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">{member.description}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* View on Site Link */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">View Staff on Public Site</h3>
            <p className="text-sm text-gray-600">
              See how your staff and leadership team appears to visitors
            </p>
          </div>
          <Link
            href="/team"
            target="_blank"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            View Leadership Page
          </Link>
        </div>
      </div>
    </div>
  );
}


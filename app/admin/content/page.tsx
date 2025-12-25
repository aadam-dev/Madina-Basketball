"use client";

import { useState, useEffect } from "react";
import { FileText, Save } from "lucide-react";

interface ContentSection {
  id?: string;
  page: string;
  section_key: string;
  content: any;
}

const CONTENT_SECTIONS = [
  {
    page: "home",
    section_key: "hero_title",
    label: "Hero Title",
    type: "text",
    description: "Main title on the homepage",
  },
  {
    page: "home",
    section_key: "hero_subtitle",
    label: "Hero Subtitle",
    type: "text",
    description: "Subtitle below the main title",
  },
  {
    page: "home",
    section_key: "hero_description",
    label: "Hero Description",
    type: "textarea",
    description: "Description text in the hero section",
  },
  {
    page: "home",
    section_key: "mission_title",
    label: "Mission Section Title",
    type: "text",
    description: "Title of the mission section",
  },
  {
    page: "home",
    section_key: "mission_text",
    label: "Mission Text",
    type: "textarea",
    description: "Mission description text",
  },
  {
    page: "home",
    section_key: "stats_amount_raised",
    label: "Amount Raised",
    type: "text",
    description: "Amount raised stat (e.g., GHS 44,750)",
  },
  {
    page: "home",
    section_key: "stats_players",
    label: "Players Registered",
    type: "text",
    description: "Number of registered players",
  },
  {
    page: "home",
    section_key: "stats_events",
    label: "Events Hosted",
    type: "text",
    description: "Number of events hosted",
  },
];

export default function ContentPage() {
  const [sections, setSections] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      
      const contentMap: Record<string, any> = {};
      data.forEach((section: ContentSection) => {
        const key = `${section.page}_${section.section_key}`;
        contentMap[key] = section.content;
      });

      setSections(contentMap);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (page: string, sectionKey: string, value: any) => {
    const key = `${page}_${sectionKey}`;
    setSaving(key);

    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          section_key: sectionKey,
          content: value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      setSections((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save content");
    } finally {
      setSaving(null);
    }
  };

  const handleChange = (page: string, sectionKey: string, value: string) => {
    const key = `${page}_${sectionKey}`;
    setSections((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="text-center py-12">Loading content...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
        <p className="text-gray-600">Edit website content and text sections</p>
      </div>

      <div className="space-y-6">
        {CONTENT_SECTIONS.map((section) => {
          const key = `${section.page}_${section.section_key}`;
          const value = sections[key] || "";

          return (
            <div key={key} className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  {section.label}
                </label>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>

              {section.type === "textarea" ? (
                <textarea
                  value={value}
                  onChange={(e) => handleChange(section.page, section.section_key, e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(section.page, section.section_key, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
                />
              )}

              <button
                onClick={() => handleSave(section.page, section.section_key, value)}
                disabled={saving === key}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving === key ? "Saving..." : "Save"}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { Save, Eye, RotateCcw, Layout, CheckCircle, AlertCircle, Settings, Home as HomeIcon, FileText, Map, Mail } from "lucide-react";
import Link from "next/link";

interface ContentSection {
  id?: string;
  page: string;
  section_key: string;
  content: any;
}

// Define ALL editable content across the site
const PAGE_SECTIONS: Record<string, {
  label: string;
  path: string;
  icon: any; // Lucide React Component
  sections: Array<{
    section_key: string;
    label: string;
    type: "text" | "textarea" | "url" | "email" | "phone";
    description: string;
    placeholder?: string;
    rows?: number;
  }>;
}> = {
  home: {
    label: "Homepage",
    path: "/",
    icon: HomeIcon,
    sections: [
      {
        section_key: "hero_title",
        label: "Hero Title",
        type: "text",
        description: "Main title on homepage (currently: MADINA BASKETBALL)",
        placeholder: "MADINA BASKETBALL",
      },
      {
        section_key: "hero_subtitle",
        label: "Hero Subtitle",
        type: "text",
        description: "Subtitle below main title",
        placeholder: "A Community-Built Court, Now Active",
      },
      {
        section_key: "hero_description",
        label: "Hero Description",
        type: "textarea",
        description: "Description text in the hero section",
        placeholder: "From a broken public court to a fully renovated basketball hub...",
        rows: 3,
      },
      {
        section_key: "hero_location",
        label: "Location",
        type: "text",
        description: "Location displayed in hero",
        placeholder: "Libya Quarters, Madina, Accra, Ghana",
      },
      {
        section_key: "stats_amount_raised",
        label: "Amount Raised (Stats)",
        type: "text",
        description: "Amount raised statistic",
        placeholder: "GHS 44,750",
      },
      {
        section_key: "stats_players",
        label: "Players Registered (Stats)",
        type: "text",
        description: "Number of registered players",
        placeholder: "150+",
      },
      {
        section_key: "stats_events",
        label: "Events Hosted (Stats)",
        type: "text",
        description: "Number of events hosted",
        placeholder: "12+",
      },
      {
        section_key: "mission_title",
        label: "Mission Section Title",
        type: "text",
        description: "Title of the mission section",
        placeholder: "Basketball for Everyone",
      },
      {
        section_key: "mission_text_1",
        label: "Mission Text (Paragraph 1)",
        type: "textarea",
        description: "First paragraph of mission text",
        placeholder: "Madina has always had a basketball-playing population...",
        rows: 3,
      },
      {
        section_key: "mission_text_2",
        label: "Mission Text (Paragraph 2)",
        type: "textarea",
        description: "Second paragraph of mission text",
        placeholder: "Through transparent fundraising...",
        rows: 3,
      },
      {
        section_key: "cta_title",
        label: "Final CTA Title",
        type: "text",
        description: "Title of final call-to-action section",
        placeholder: "Ready to Ball?",
      },
      {
        section_key: "cta_description",
        label: "Final CTA Description",
        type: "textarea",
        description: "Description in final CTA",
        placeholder: "The court is open. The community is waiting...",
        rows: 2,
      },
    ],
  },
  about: {
    label: "About Page",
    path: "/about",
    icon: FileText,
    sections: [
      {
        section_key: "title",
        label: "Page Title",
        type: "text",
        description: "Main title of the About page",
        placeholder: "About the Project",
      },
      {
        section_key: "intro",
        label: "Introduction",
        type: "textarea",
        description: "Opening paragraph",
        placeholder: "The Madina Basketball Court project...",
        rows: 4,
      },
    ],
  },
  journey: {
    label: "Journey Page",
    path: "/journey",
    icon: Map,
    sections: [
      {
        section_key: "title",
        label: "Page Title",
        type: "text",
        description: "Main title of the Journey page",
        placeholder: "The Journey",
      },
      {
        section_key: "intro",
        label: "Introduction",
        type: "textarea",
        description: "Opening paragraph about the journey",
        placeholder: "From vision to reality...",
        rows: 4,
      },
    ],
  },
  contact: {
    label: "Contact & Footer",
    path: "/",
    icon: Mail,
    sections: [
      {
        section_key: "email",
        label: "Contact Email",
        type: "email",
        description: "Main contact email address",
        placeholder: "themadinacourt@gmail.com",
      },
      {
        section_key: "whatsapp",
        label: "WhatsApp Number",
        type: "phone",
        description: "WhatsApp contact number (with country code)",
        placeholder: "233XXXXXXXXX",
      },
      {
        section_key: "location",
        label: "Physical Address",
        type: "text",
        description: "Full address displayed in footer",
        placeholder: "Libya Quarters, Madina, Accra, Ghana",
      },
      {
        section_key: "facebook_url",
        label: "Facebook URL",
        type: "url",
        description: "Facebook page link",
        placeholder: "https://facebook.com/madinabasketball",
      },
      {
        section_key: "instagram_url",
        label: "Instagram URL",
        type: "url",
        description: "Instagram profile link",
        placeholder: "https://instagram.com/madinabasketball",
      },
      {
        section_key: "footer_about",
        label: "Footer About Text",
        type: "textarea",
        description: "Short description in footer",
        placeholder: "A community-built basketball court...",
        rows: 3,
      },
    ],
  },
};

export default function ContentPage() {
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [sections, setSections] = useState<Record<string, any>>({});
  const [originalSections, setOriginalSections] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [selectedPage]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/content?page=${selectedPage}`);
      const data = await response.json();
      
      const contentMap: Record<string, any> = {};
      data.forEach((section: ContentSection) => {
        const key = `${section.page}_${section.section_key}`;
        contentMap[key] = section.content;
      });

      setSections(contentMap);
      setOriginalSections({ ...contentMap });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (page: string, sectionKey: string, value: any) => {
    const key = `${page}_${sectionKey}`;
    setSaving(key);
    setSaveSuccess(null);

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
      setOriginalSections((prev) => ({ ...prev, [key]: value }));
      
      // Show success message
      setSaveSuccess(key);
      setTimeout(() => setSaveSuccess(null), 3000);
      
      // Check if there are still other unsaved changes
      const pageConfig = PAGE_SECTIONS[page];
      if (pageConfig) {
        const anyChanges = pageConfig.sections.some(s => {
          const k = `${page}_${s.section_key}`;
          return (sections[k] || "") !== (originalSections[k] || "");
        });
        setHasUnsavedChanges(anyChanges);
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("❌ Failed to save content. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  const handleChange = (page: string, sectionKey: string, value: string) => {
    const key = `${page}_${sectionKey}`;
    setSections((prev) => ({ ...prev, [key]: value }));
    
    // Check if there are any unsaved changes
    const originalValue = originalSections[key] || "";
    const hasChanges = value !== originalValue;
    
    // Check all sections for changes
    const pageConfig = PAGE_SECTIONS[page];
    if (pageConfig) {
      const anyChanges = pageConfig.sections.some(s => {
        const k = `${page}_${s.section_key}`;
        const currentVal = k === key ? value : (sections[k] || "");
        const origVal = originalSections[k] || "";
        return currentVal !== origVal;
      }) || hasChanges;
      
      setHasUnsavedChanges(anyChanges);
    }
  };

  const handleSaveAll = async () => {
    const pageConfig = PAGE_SECTIONS[selectedPage];
    if (!pageConfig) return;

    const changedSections = pageConfig.sections.filter(s => {
      const key = `${selectedPage}_${s.section_key}`;
      return (sections[key] || "") !== (originalSections[key] || "");
    });

    if (changedSections.length === 0) return;

    const confirmed = confirm(
      `Save ${changedSections.length} change(s) to ${pageConfig.label}?\n\nThis will update the live site immediately.`
    );
    if (!confirmed) return;

    for (const section of changedSections) {
      const key = `${selectedPage}_${section.section_key}`;
      const value = sections[key] || "";
      await handleSave(selectedPage, section.section_key, value);
    }
  };

  const handleReset = (page: string, sectionKey: string) => {
    const key = `${page}_${sectionKey}`;
    const originalValue = originalSections[key] || "";
    handleChange(page, sectionKey, originalValue);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading content...</p>
      </div>
    );
  }

  const currentPageConfig = PAGE_SECTIONS[selectedPage];
  if (!currentPageConfig) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
            <p className="text-gray-600">Edit your website content - easy as WordPress</p>
          </div>
          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700 font-medium">Unsaved changes</span>
              </div>
            )}
            <Link
              href={currentPageConfig.path}
              target="_blank"
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View Live Page</span>
            </Link>
          </div>
        </div>

        {/* Helpful tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>How it works:</strong> Select a page below, edit the content, and click "Save Section" or "Save All Changes". 
            Your changes will appear on the live site immediately. No technical skills needed!
          </p>
        </div>
      </div>

      {/* Page Selector */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Layout className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Select Page to Edit</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(PAGE_SECTIONS).map(([pageId, config]) => {
            const IconComponent = config.icon;
            return (
              <button
                key={pageId}
                onClick={() => {
                  if (hasUnsavedChanges) {
                    const confirmed = confirm("You have unsaved changes. Switch pages anyway? Your changes will be lost.");
                    if (!confirmed) return;
                  }
                  setSelectedPage(pageId);
                }}
                className={`p-4 rounded-lg font-medium transition-all text-left ${
                  selectedPage === pageId
                    ? "bg-primary text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary hover:shadow-md"
                }`}
              >
                <IconComponent className="w-8 h-8 mb-2" />
                <div className="font-semibold">{config.label}</div>
                <div className="text-xs opacity-75 mt-1">{config.sections.length} sections</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                {(() => {
                  const IconComponent = currentPageConfig.icon;
                  return <IconComponent className="w-8 h-8 text-primary" />;
                })()}
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentPageConfig.label}
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                {currentPageConfig.sections.length} editable section{currentPageConfig.sections.length !== 1 ? 's' : ''}
              </p>
            </div>
            {hasUnsavedChanges && (
              <button
                onClick={handleSaveAll}
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
              >
                <Save className="w-5 h-5" />
                <span className="font-semibold">Save All Changes</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-8">
          {currentPageConfig.sections.map((section, index) => {
            const key = `${selectedPage}_${section.section_key}`;
            const value = sections[key] || "";
            const originalValue = originalSections[key] || "";
            const hasChanges = value !== originalValue;
            const isSaving = saving === key;
            const isSuccess = saveSuccess === key;

            return (
              <div key={key} className="border-b border-gray-200 pb-8 last:border-0">
                {/* Section Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-lg font-bold text-gray-900">
                      {index + 1}. {section.label}
                    </label>
                    <div className="flex items-center space-x-2">
                      {isSuccess && (
                        <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Saved!</span>
                        </span>
                      )}
                      {hasChanges && !isSuccess && (
                        <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Modified</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>

                {/* Current Value Display */}
                <div className="mb-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-900 uppercase flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Current Live Content</span>
                      </span>
                      {originalValue && hasChanges && (
                        <button
                          onClick={() => handleReset(selectedPage, section.section_key)}
                          className="flex items-center space-x-1 text-xs text-blue-700 hover:text-blue-900 font-medium"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Undo Changes</span>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap mt-2">
                      {originalValue || (
                        <span className="text-gray-400 italic">
                          (No content yet - add some below)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Edit Field */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">
                    {hasChanges ? "Your Changes" : "Edit Content"}
                  </label>
                  {section.type === "textarea" ? (
                    <textarea
                      value={value}
                      onChange={(e) => handleChange(selectedPage, section.section_key, e.target.value)}
                      rows={section.rows || 6}
                      placeholder={section.placeholder}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono text-sm ${
                        hasChanges
                          ? "border-orange-400 bg-orange-50"
                          : "border-gray-300 bg-white"
                      }`}
                    />
                  ) : (
                    <input
                      type={section.type}
                      value={value}
                      onChange={(e) => handleChange(selectedPage, section.section_key, e.target.value)}
                      placeholder={section.placeholder}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        hasChanges
                          ? "border-orange-400 bg-orange-50"
                          : "border-gray-300 bg-white"
                      }`}
                    />
                  )}
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => {
                  if (hasChanges) {
                    const confirmed = confirm(
                      `Save changes to "${section.label}"?\n\nThis will update the live site immediately.`
                    );
                        if (!confirmed) return;
                      }
                      handleSave(selectedPage, section.section_key, value);
                    }}
                    disabled={isSaving || !hasChanges}
                    className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span className="font-semibold">
                          {hasChanges ? "Save Section" : "No Changes"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

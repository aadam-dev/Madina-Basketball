/**
 * TeamSelector Component
 * 
 * A searchable dropdown component for selecting basketball teams.
 * Features:
 * - Fetches teams from database API
 * - Real-time search/filtering
 * - Grouped display by category (Madina, Accra, Other)
 * - Supports custom team entry
 * - Keyboard navigation support
 * - Click-outside-to-close functionality
 * 
 * @component
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Plus } from "lucide-react";

/**
 * Team data structure from API
 */
interface Team {
  id: string;
  name: string;
  short_name: string | null;
  category: string;
  league: string;
}

/**
 * Props for TeamSelector component
 */
interface TeamSelectorProps {
  value: string; // Current selected team name
  onChange: (teamName: string) => void; // Callback when team is selected
  placeholder?: string; // Placeholder text for input
  disabled?: boolean; // Disable the component
  label?: string; // Label text above the input
  allowCustom?: boolean; // Allow typing custom team names not in list
}

export default function TeamSelector({
  value,
  onChange,
  placeholder = "Select or type team name",
  disabled = false,
  label,
  allowCustom = true,
}: TeamSelectorProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch teams from API on component mount
  useEffect(() => {
    fetchTeams();
  }, []);

  // Sync search term with external value changes
  useEffect(() => {
    if (value !== searchTerm) {
      setSearchTerm(value);
    }
  }, [value]);

  // Close dropdown when clicking outside the component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Fetch teams from the basketball teams API endpoint
   */
  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/basketball-teams");
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle input field changes
   * Updates search term and triggers onChange if custom entry is allowed
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // If custom entry is allowed, immediately update parent component
    if (allowCustom) {
      onChange(newValue);
    }
    
    // Open dropdown when user starts typing
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  /**
   * Handle team selection from dropdown
   * Updates the value and closes the dropdown
   */
  const handleSelectTeam = (teamName: string) => {
    setSearchTerm(teamName);
    onChange(teamName);
    setIsOpen(false);
    inputRef.current?.blur(); // Remove focus from input
  };

  /**
   * Handle input focus - opens dropdown to show available teams
   */
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  /**
   * Filter teams based on search term
   * Matches against both team name and short name
   */
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (team.short_name && team.short_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group teams by category
  const madinaTeams = filteredTeams.filter((t) => t.category === "madina");
  const accraTeams = filteredTeams.filter((t) => t.category === "accra");
  const otherTeams = filteredTeams.filter((t) => t.category === "other");

  const showCustomOption = allowCustom && searchTerm && 
    !teams.some((t) => t.name.toLowerCase() === searchTerm.toLowerCase());

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
        />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Loading teams...
            </div>
          ) : (
            <>
              {/* Madina Teams */}
              {madinaTeams.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Madina Teams
                  </div>
                  {madinaTeams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => handleSelectTeam(team.name)}
                      className="w-full text-left px-4 py-3 hover:bg-primary/5 focus:bg-primary/10 focus:outline-none transition-colors"
                    >
                      <div className="font-medium text-gray-900">{team.name}</div>
                      {team.short_name && team.short_name !== team.name && (
                        <div className="text-xs text-gray-500">{team.short_name}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Accra Basketball League */}
              {accraTeams.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Accra Basketball League
                  </div>
                  {accraTeams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => handleSelectTeam(team.name)}
                      className="w-full text-left px-4 py-3 hover:bg-primary/5 focus:bg-primary/10 focus:outline-none transition-colors"
                    >
                      <div className="font-medium text-gray-900">{team.name}</div>
                      {team.short_name && team.short_name !== team.name && (
                        <div className="text-xs text-gray-500">{team.short_name}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Other Teams */}
              {otherTeams.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Other Teams
                  </div>
                  {otherTeams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => handleSelectTeam(team.name)}
                      className="w-full text-left px-4 py-3 hover:bg-primary/5 focus:bg-primary/10 focus:outline-none transition-colors"
                    >
                      <div className="font-medium text-gray-900">{team.name}</div>
                      {team.league && (
                        <div className="text-xs text-gray-500">{team.league}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Custom Team Option */}
              {showCustomOption && (
                <div className="border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleSelectTeam(searchTerm)}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 focus:bg-green-100 focus:outline-none transition-colors"
                  >
                    <div className="flex items-center space-x-2 text-green-700 font-medium">
                      <Plus className="w-4 h-4" />
                      <span>Use "{searchTerm}"</span>
                    </div>
                    <div className="text-xs text-green-600 mt-0.5">
                      Add as custom team
                    </div>
                  </button>
                </div>
              )}

              {/* No Results */}
              {filteredTeams.length === 0 && !showCustomOption && (
                <div className="px-4 py-6 text-sm text-gray-500 text-center">
                  No teams found
                  {allowCustom && (
                    <div className="mt-2 text-xs">
                      Just type the team name to use it
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}


/**
 * Tools Landing Page
 * 
 * Hub for all game-related tools available on the Madina Basketball platform.
 * Provides education on tool usage, workflows, and how tools connect together.
 * 
 * @component
 */

import Link from "next/link";
import { Trophy, BarChart3, FileText, Clock, Users, ArrowRight, PlayCircle, Download, Clipboard } from "lucide-react";

export default function ToolsPage() {
  const tools = [
    {
      id: "scoreboard",
      name: "Live Game Scoreboard",
      description: "Real-time score tracking for basketball games with multiple modes",
      icon: Trophy,
      color: "primary",
      href: "/game",
      features: [
        "Three tracking modes: Basic, Player Stats, Full Management",
        "Countdown timer with flexible duration (5-30 minutes)",
        "Quarter-by-quarter score tracking",
        "Team fouls tracking per quarter",
        "Save and export game results",
        "Professional LED-style display"
      ],
      useCase: "Perfect for live games, tournaments, and practice sessions"
    },
    {
      id: "teamsheet",
      name: "Team Sheet Generator",
      description: "Create professional team rosters for games and events",
      icon: Users,
      color: "secondary",
      href: "/teamsheet",
      features: [
        "Create rosters for both home and away teams",
        "Player names, jersey numbers, and positions",
        "PDF export for printing",
        "Required for Player Stats mode",
        "Direct integration with scoreboard tools"
      ],
      useCase: "Essential for organized games and player attribution"
    },
    {
      id: "statssheet",
      name: "Stats Sheet Generator",
      description: "Generate blank or pre-filled statistics sheets for manual tracking",
      icon: Clipboard,
      color: "primary",
      href: "/statssheet",
      features: [
        "Blank stats sheets for manual tracking",
        "Pre-filled from team sheets",
        "Comprehensive stat categories",
        "PDF export ready",
        "Professional formatting"
      ],
      useCase: "Ideal for detailed stat tracking and record keeping"
    }
  ];

  const workflows = [
    {
      title: "Quick Game Tracking",
      description: "For casual games and practice sessions",
      steps: [
        { tool: "Live Game Scoreboard", action: "Select Basic mode", icon: PlayCircle },
        { tool: "Live Game Scoreboard", action: "Enter team names and start tracking", icon: Clock },
        { tool: "Live Game Scoreboard", action: "Save results when done", icon: Download }
      ],
      color: "primary"
    },
    {
      title: "Detailed Player Tracking",
      description: "For organized games with player statistics",
      steps: [
        { tool: "Team Sheet Generator", action: "Create rosters for both teams", icon: Users },
        { tool: "Team Sheet Generator", action: "Click 'Start Player Stats Game'", icon: ArrowRight },
        { tool: "Live Game Scoreboard", action: "Select players when scoring", icon: BarChart3 },
        { tool: "Live Game Scoreboard", action: "View real-time player statistics", icon: Trophy }
      ],
      color: "secondary"
    },
    {
      title: "Manual Stats Recording",
      description: "For detailed stat tracking on paper",
      steps: [
        { tool: "Team Sheet Generator", action: "Create team roster", icon: Users },
        { tool: "Stats Sheet Generator", action: "Generate pre-filled stats sheet", icon: FileText },
        { tool: "Stats Sheet Generator", action: "Print and track manually during game", icon: Download }
      ],
      color: "primary"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Game Tools
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-6">
              Professional basketball game management tools, built for Madina Basketball
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Our suite of tools helps you manage games, track statistics, and maintain professional records. 
              Each tool is designed to work seamlessly with the others.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Tools
            </h2>
            <p className="text-lg text-gray-600">
              Each tool serves a specific purpose and can be used independently or together for comprehensive game management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isPrimary = tool.color === "primary";
              const isSecondary = tool.color === "secondary";
              return (
                <div
                  key={tool.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-gray-100"
                >
                  <div className={`p-6 ${isPrimary ? 'bg-primary' : isSecondary ? 'bg-secondary' : 'bg-gray-800'}`}>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className={`w-8 h-8 ${isPrimary ? 'text-primary' : isSecondary ? 'text-secondary' : 'text-gray-800'}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white text-center">
                      {tool.name}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 min-h-[3rem]">
                      {tool.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className={`mr-2 font-bold ${isPrimary ? 'text-primary' : isSecondary ? 'text-secondary' : 'text-gray-800'}`}>✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mb-4 italic">
                      {tool.useCase}
                    </p>
                    <Link
                      href={tool.href}
                      className={`w-full block text-center px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold ${
                        isPrimary ? 'bg-primary hover:bg-primary-dark' : isSecondary ? 'bg-secondary hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      Use {tool.name.split(' ')[0]} Tool
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How Tools Work Together
              </h2>
              <p className="text-lg text-gray-600">
                Choose the workflow that best fits your needs
              </p>
            </div>

            <div className="space-y-8">
              {workflows.map((workflow, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-primary"
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {workflow.title}
                    </h3>
                    <p className="text-gray-600">{workflow.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {workflow.steps.map((step, stepIndex) => {
                      const StepIcon = step.icon;
                      const isPrimary = workflow.color === "primary";
                      return (
                        <div key={stepIndex} className="flex items-center gap-3 flex-1">
                          {stepIndex > 0 && (
                            <ArrowRight className="w-5 h-5 text-gray-400 hidden sm:block" />
                          )}
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isPrimary ? 'bg-primary/10' : 'bg-secondary/10'
                            }`}>
                              <StepIcon className={`w-6 h-6 ${isPrimary ? 'text-primary' : 'text-secondary'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-900">
                                {step.tool}
                              </div>
                              <div className="text-xs text-gray-600">
                                {step.action}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Quick Start Guide
              </h2>
              <p className="text-lg text-gray-600">
                Common use cases and which tool to use
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Quick Pickup Game
                </h3>
                <p className="text-gray-600 mb-4">
                  Just need to track scores quickly?
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start text-sm">
                    <span className="text-primary mr-2 font-bold">→</span>
                    <span className="text-gray-700">Use <strong>Live Game Scoreboard</strong> in Basic mode</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-primary mr-2 font-bold">→</span>
                    <span className="text-gray-700">No setup required - just enter team names and start</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Organized Game with Stats
                </h3>
                <p className="text-gray-600 mb-4">
                  Need to track individual player performance?
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start text-sm">
                    <span className="text-secondary mr-2 font-bold">→</span>
                    <span className="text-gray-700">Start with <strong>Team Sheet Generator</strong></span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-secondary mr-2 font-bold">→</span>
                    <span className="text-gray-700">Create rosters for both teams</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-secondary mr-2 font-bold">→</span>
                    <span className="text-gray-700">Click "Start Player Stats Game" to begin tracking</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Manual Stat Tracking
                </h3>
                <p className="text-gray-600 mb-4">
                  Prefer to track stats on paper?
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start text-sm">
                    <span className="text-primary mr-2 font-bold">→</span>
                    <span className="text-gray-700">Use <strong>Team Sheet Generator</strong> to create roster</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-primary mr-2 font-bold">→</span>
                    <span className="text-gray-700">Generate <strong>Stats Sheet</strong> with pre-filled players</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-primary mr-2 font-bold">→</span>
                    <span className="text-gray-700">Print and track manually during the game</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Tournament or League
                </h3>
                <p className="text-gray-600 mb-4">
                  Managing multiple games?
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start text-sm">
                    <span className="text-secondary mr-2 font-bold">→</span>
                    <span className="text-gray-700">Create team sheets for all participating teams</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-secondary mr-2 font-bold">→</span>
                    <span className="text-gray-700">Use <strong>Player Stats mode</strong> for each game</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-secondary mr-2 font-bold">→</span>
                    <span className="text-gray-700">Save all games for records and analysis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Choose a tool above to begin, or explore our workflows to see how they connect.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/game"
                className="px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
              >
                Start Scoreboard
              </Link>
              <Link
                href="/teamsheet"
                className="px-8 py-3 bg-white/10 text-white border-2 border-white rounded-lg hover:bg-white/20 transition-colors font-semibold text-lg"
              >
                Create Team Sheet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


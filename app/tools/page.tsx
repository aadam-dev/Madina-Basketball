import Link from "next/link";
import { Trophy, BarChart3, FileText, Clock, Users, ArrowRight, PlayCircle, Download, Clipboard, Smartphone, WifiOff, ChevronRight } from "lucide-react";

const tools = [
  {
    id: "scoreboard",
    name: "Live Game Scoreboard",
    description: "Real-time score tracking for basketball games with multiple modes",
    icon: Trophy,
    accent: "#ff6b35",
    href: "/game",
    features: [
      "Three tracking modes: Basic, Player Stats, Full Management",
      "Countdown timer with flexible duration (5–30 minutes)",
      "Quarter-by-quarter score tracking",
      "Team fouls tracking per quarter",
      "Save and export game results",
      "Professional LED-style display",
    ],
    useCase: "Perfect for live games, tournaments, and practice sessions",
  },
  {
    id: "teamsheet",
    name: "Team Sheet Generator",
    description: "Create professional team rosters for games and events",
    icon: Users,
    accent: "#004e89",
    href: "/teamsheet",
    features: [
      "Create rosters for both home and away teams",
      "Player names, jersey numbers, and positions",
      "PDF export for printing",
      "Required for Player Stats mode",
      "Direct integration with scoreboard tools",
    ],
    useCase: "Essential for organised games and player attribution",
  },
  {
    id: "statssheet",
    name: "Stats Sheet Generator",
    description: "Generate blank or pre-filled statistics sheets for manual tracking",
    icon: Clipboard,
    accent: "#ffd23f",
    href: "/statssheet",
    features: [
      "Blank stats sheets for manual tracking",
      "Pre-filled from team sheets",
      "Comprehensive stat categories",
      "PDF export ready",
      "Professional formatting",
    ],
    useCase: "Ideal for detailed stat tracking and record keeping",
  },
];

const workflows = [
  {
    title: "Quick Game Tracking",
    description: "For casual games and practice sessions",
    steps: [
      { tool: "Live Game Scoreboard", action: "Select Basic mode", icon: PlayCircle },
      { tool: "Scoreboard", action: "Enter team names and start tracking", icon: Clock },
      { tool: "Scoreboard", action: "Save results when done", icon: Download },
    ],
    accent: "#ff6b35",
  },
  {
    title: "Detailed Player Tracking",
    description: "For organised games with player statistics",
    steps: [
      { tool: "Team Sheet Generator", action: "Create rosters for both teams", icon: Users },
      { tool: "Team Sheet", action: "Click 'Start Player Stats Game'", icon: ArrowRight },
      { tool: "Live Scoreboard", action: "Select players when scoring", icon: BarChart3 },
      { tool: "Scoreboard", action: "View real-time player statistics", icon: Trophy },
    ],
    accent: "#004e89",
  },
  {
    title: "Manual Stats Recording",
    description: "For detailed stat tracking on paper",
    steps: [
      { tool: "Team Sheet Generator", action: "Create team roster", icon: Users },
      { tool: "Stats Sheet Generator", action: "Generate pre-filled stats sheet", icon: FileText },
      { tool: "Stats Sheet", action: "Print and track manually during game", icon: Download },
    ],
    accent: "#ff6b35",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden court-lines border-b border-white/6">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ff6b35] to-transparent" />
        <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <span className="pill bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/30 mb-5 inline-flex">
            Game Tools
          </span>
          <h1
            className="font-black uppercase leading-none mb-5"
            style={{ fontSize: "clamp(2.8rem,8vw,6rem)", letterSpacing: "-0.04em" }}
          >
            GAME<br />
            <span className="text-[#ff6b35]">MANAGEMENT</span>
          </h1>
          <p className="text-white/55 max-w-xl text-base leading-relaxed">
            Professional basketball game tools built for Madina Basketball: scoreboard, team sheets,
            and stats tracking. Works offline. Install as an app.
          </p>
        </div>
      </section>

      {/* ── Tools Cards ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Suite</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">Our Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div key={tool.id} className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden hover:border-white/20 transition-colors flex flex-col">
                  <div className="px-6 pt-6 pb-4" style={{ borderBottom: `1px solid ${tool.accent}20` }}>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${tool.accent}15`, border: `1px solid ${tool.accent}30` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: tool.accent }} />
                    </div>
                    <h3 className="text-white font-black uppercase tracking-tight text-lg">{tool.name}</h3>
                    <p className="text-white/50 text-sm mt-1">{tool.description}</p>
                  </div>
                  <div className="px-6 py-4 flex-1">
                    <ul className="space-y-2 mb-4">
                      {tool.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: tool.accent }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <p className="text-white/30 text-xs italic mb-5">{tool.useCase}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <Link
                      href={tool.href}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors text-white"
                      style={{ background: tool.accent }}
                    >
                      Open {tool.name.split(" ")[0]} Tool <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Install as App ── */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#ff6b35]" />
            </div>
            <div>
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em]">PWA</p>
              <h2 className="text-2xl font-black uppercase tracking-tight">Works Offline: Install as App</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              {
                platform: "iPhone & iPad",
                steps: [
                  "Open this site in Safari browser",
                  "Tap the Share button (square with arrow)",
                  "Scroll and tap \"Add to Home Screen\"",
                  "Tap \"Add\" to complete",
                ],
              },
              {
                platform: "Android",
                steps: [
                  "Open this site in Chrome browser",
                  "Tap the menu (⋮) or wait for install prompt",
                  "Select \"Install app\" or \"Add to Home Screen\"",
                  "Tap \"Install\" to complete",
                ],
              },
            ].map(({ platform, steps }) => (
              <div key={platform} className="bg-[#111] border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-black uppercase tracking-tight mb-4">{platform}</h3>
                <ol className="space-y-2">
                  {steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                      <span className="text-[#ff6b35] font-black w-4 flex-shrink-0">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <WifiOff className="w-5 h-5 text-[#ff6b35]" />
              <h3 className="text-white font-black uppercase tracking-tight">Why Install as an App?</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Works Without Internet", text: "Track games offline, syncs when back online" },
                { title: "Faster Loading", text: "Opens instantly like a native app" },
                { title: "Home Screen Icon", text: "Easy access, no browser needed" },
                { title: "Full-Screen Experience", text: "No browser bars, more space for the game" },
                { title: "Auto-Saves Games", text: "Never lose game data, even if device dies" },
                { title: "No App Store Needed", text: "Install directly from the website" },
              ].map(({ title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#ff6b35]/15 border border-[#ff6b35]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{title}</p>
                    <p className="text-white/45 text-xs mt-0.5">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Workflows ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Workflows</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">How Tools Work Together</h2>
          <div className="space-y-4">
            {workflows.map((wf, i) => (
              <div key={i} className="bg-[#111] border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-black uppercase tracking-tight mb-1">{wf.title}</h3>
                <p className="text-white/40 text-sm mb-5">{wf.description}</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
                  {wf.steps.map((step, si) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={si} className="flex items-center gap-2 flex-shrink-0">
                        {si > 0 && <ArrowRight className="w-4 h-4 text-white/20 hidden sm:block" />}
                        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-3 py-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${wf.accent}15` }}>
                            <StepIcon className="w-4 h-4" style={{ color: wf.accent }} />
                          </div>
                          <div>
                            <p className="text-white text-xs font-bold">{step.tool}</p>
                            <p className="text-white/40 text-[0.65rem]">{step.action}</p>
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
      </section>

      {/* ── Scorekeeping Guide ── */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Reference</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">Scorekeeping Best Practices</h2>
          <div className="space-y-3">
            {[
              {
                icon: Trophy, accent: "#ff6b35", title: "Basic Scoreboard: Quick Guide",
                sub: "Simple score tracking for casual games",
                items: [
                  "Set timer duration before starting (5–30 minutes)",
                  "Use +1, +2, +3 buttons for scoring each team",
                  "–1 button for immediate corrections (current quarter only)",
                  "Track team fouls each quarter (resets per quarter)",
                  "Advance quarters when the period ends",
                  "Save or download PDF when game is complete",
                ],
              },
              {
                icon: BarChart3, accent: "#004e89", title: "Player Stats Mode: Pro Tracking",
                sub: "Detailed player performance tracking",
                items: [
                  "Create team rosters BEFORE starting game (cannot add players mid-game)",
                  "Select player after each basket for attribution",
                  "Use 'Undo' button for mistakes (current quarter only)",
                  "Shot clock auto-resets on scores and defensive rebounds",
                  "View real-time stats for each player below scoreboard",
                  "Print or save complete game stats when done",
                ],
              },
              {
                icon: Clock, accent: "#ffd23f", title: "Professional Scorekeeping Standards",
                sub: "FIBA/NBA official practices",
                items: [
                  "Completed quarters are locked. Cannot be modified.",
                  "Only undo events from the current quarter. Past quarters are locked.",
                  "Note corrections separately if errors discovered in past quarters",
                  "Follows FIBA/NBA standards for official record keeping",
                  "Prevents retroactive changes. Audit trail maintained.",
                ],
              },
              {
                icon: WifiOff, accent: "#22c55e", title: "Offline Mode: Data Safety",
                sub: "How your data is protected",
                items: [
                  "Auto-saves every 2 seconds to your device storage",
                  "Works completely without internet after first install",
                  "Data syncs automatically when back online",
                  "Install as app for best offline experience",
                  "Recovery system restores games if app closes unexpectedly",
                  "Offline indicator shows connection status in the bottom-right corner",
                ],
              },
            ].map(({ icon: Icon, accent, title, sub, items }) => (
              <details key={title} className="group bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
                <summary className="cursor-pointer p-5 hover:bg-white/3 transition-colors flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
                    <Icon className="w-5 h-5" style={{ color: accent }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black uppercase tracking-tight text-sm">{title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 pb-5 border-t border-white/6">
                  <ul className="space-y-2 mt-4">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/55">
                        <span className="font-black mt-0.5" style={{ color: accent }}>•</span>
                        <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, "<strong class='text-white'>$1</strong>") }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#ff6b35] py-16">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">Ready to Get Started?</h2>
          <p className="text-white/80 max-w-sm mx-auto mb-8 text-sm">
            Choose a tool to begin, or explore our workflows to see how they connect.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/game" className="px-8 py-3 bg-white text-[#ff6b35] font-bold text-sm rounded-lg hover:bg-white/90 transition-colors uppercase tracking-wider">
              Start Scoreboard
            </Link>
            <Link href="/teamsheet" className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold text-sm rounded-lg hover:bg-white/15 transition-colors uppercase tracking-wider">
              Create Team Sheet
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

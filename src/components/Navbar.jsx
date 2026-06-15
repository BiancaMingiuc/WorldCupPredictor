import { Trophy, RotateCcw, Users, Award, GitBranch } from "lucide-react";

const TABS = [
  { id: "groups",  label: "Faza Grupelor",       shortLabel: "Grupe",   icon: Users },
  { id: "third",   label: "Locuri 3",             shortLabel: "Loc 3",   icon: Award },
  { id: "bracket", label: "Tablou Eliminatoriu",  shortLabel: "Bracket", icon: GitBranch },
];

export default function Navbar({ activeTab, onTabChange, onReset }) {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#00FF87] to-[#7A00FF] flex items-center justify-center shadow-lg shadow-[#00FF87]/20 shrink-0">
              <Trophy size={16} className="text-black" />
            </div>
            <div>
              <div className="text-white font-black text-sm sm:text-lg leading-none tracking-tight">WORLD CUP</div>
              <div className="text-[#00FF87] text-[10px] sm:text-xs font-bold tracking-[0.2em] leading-none">2026 PREDICTOR</div>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-[#FF004D]/40 text-[#FF004D] text-xs sm:text-sm font-semibold hover:bg-[#FF004D]/10 hover:border-[#FF004D] transition-all duration-200 group shrink-0"
          >
            <RotateCcw size={13} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="hidden sm:inline">Reset Predictor</span>
            <span className="sm:hidden">Reset</span>
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-screen-2xl mx-auto px-1 sm:px-4">
          <nav className="flex">
            {TABS.map(({ id, label, shortLabel, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`relative flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === id ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
                {activeTab === id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00FF87] to-[#00E5FF] rounded-t-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

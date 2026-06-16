import { useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import GroupStagePage from "./pages/GroupStagePage";
import SchedulePage from "./pages/SchedulePage";
import GroupStandingsPage from "./pages/GroupStandingsPage";
import ThirdPlacePage from "./pages/ThirdPlacePage";
import BracketPage from "./pages/BracketPage";
import AuthPage from "./pages/AuthPage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { usePredictions } from "./hooks/usePredictions";

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useLocalStorage("wc2026_tab", "schedule");
  const [bracketScores, setBracketScores] = useLocalStorage("wc2026_bracket", {});

  // Predicțiile fazei grupelor — sincronizate cu Supabase
  const { predictionsMap, savePrediction } = usePredictions();

  // handleScoreChange are aceeași semnătură ca înainte — zero schimbări în componente child
  const handleScoreChange = useCallback((group, idx, score) => {
    savePrediction(group, idx, score);
  }, [savePrediction]);

  const handleBracketScoreChange = useCallback((matchId, score) => {
    setBracketScores((prev) => ({
      ...prev,
      [matchId]: score,
    }));
  }, [setBracketScores]);

  const handleReset = () => {
    if (window.confirm("Ești sigur că vrei să resetezi toate predicțiile? Această acțiune nu poate fi anulată.")) {
      localStorage.removeItem("wc2026_tab");
      localStorage.removeItem("wc2026_scores");
      localStorage.removeItem("wc2026_bracket");
      setActiveTab("schedule");
      setBracketScores({});
      // predictionsMap se va reîncărca automat din Supabase (gol dacă userul nu a mai salvat)
    }
  };

  // ── 1. Loading sesiune ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00FF87] to-[#7A00FF] flex items-center justify-center">
            <Loader2 size={22} className="text-black animate-spin" />
          </div>
          <p className="text-white/40 text-sm font-medium">Se încarcă...</p>
        </div>
      </div>
    );
  }

  // ── 2. Neautentificat → pagina de login ─────────────────────────────────────
  if (!user) {
    return <AuthPage />;
  }

  // ── 3. Autentificat → aplicația principală ──────────────────────────────────
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7A00FF]/8 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00FF87]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[600px] h-96 bg-[#00E5FF]/3 rounded-full blur-3xl" />
      </div>

      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReset={handleReset}
        user={user}
        onSignOut={signOut}
      />

      <main className="relative z-10">
        {activeTab === "schedule" && (
          <SchedulePage scoresMap={predictionsMap} onScoreChange={handleScoreChange} />
        )}
        {activeTab === "standings" && (
          <GroupStandingsPage scoresMap={predictionsMap} />
        )}
        {activeTab === "groups" && (
          <GroupStagePage scoresMap={predictionsMap} onScoreChange={handleScoreChange} />
        )}
        {activeTab === "third" && (
          <ThirdPlacePage scoresMap={predictionsMap} />
        )}
        {activeTab === "bracket" && (
          <BracketPage
            scoresMap={predictionsMap}
            bracketScores={bracketScores}
            onBracketScoreChange={handleBracketScoreChange}
          />
        )}
      </main>
    </div>
  );
}

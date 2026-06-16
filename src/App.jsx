import { useCallback } from "react";
import Navbar from "./components/Navbar";
import SchedulePage from "./pages/SchedulePage";
import GroupStandingsPage from "./pages/GroupStandingsPage";
import ThirdPlacePage from "./pages/ThirdPlacePage";
import BracketPage from "./pages/BracketPage";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  const [activeTab, setActiveTab] = useLocalStorage("wc2026_tab", "schedule");
  const [scoresMap, setScoresMap] = useLocalStorage("wc2026_scores", {});
  const [bracketScores, setBracketScores] = useLocalStorage("wc2026_bracket", {});

  const handleScoreChange = useCallback((group, idx, score) => {
    setScoresMap((prev) => ({
      ...prev,
      [`${group}_${idx}`]: score,
    }));
  }, [setScoresMap]);

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
      setScoresMap({});
      setBracketScores({});
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7A00FF]/8 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00FF87]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[600px] h-96 bg-[#00E5FF]/3 rounded-full blur-3xl" />
      </div>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} onReset={handleReset} />

      <main className="relative z-10">
        {activeTab === "schedule" && (
          <SchedulePage scoresMap={scoresMap} onScoreChange={handleScoreChange} />
        )}
        {activeTab === "standings" && (
          <GroupStandingsPage scoresMap={scoresMap} />
        )}
        {activeTab === "third" && (
          <ThirdPlacePage scoresMap={scoresMap} />
        )}
        {activeTab === "bracket" && (
          <BracketPage
            scoresMap={scoresMap}
            bracketScores={bracketScores}
            onBracketScoreChange={handleBracketScoreChange}
          />
        )}
      </main>
    </div>
  );
}

import { useState } from "react";
import Menu from "./pages/Menu";
import QuestionCards from "./pages/QuestionCards";
import TruthOrDare from "./pages/TruthOrDare";
import RandomMission from "./pages/RandomMission";
import BalanceGame from "./pages/BalanceGame";
import WordChain from "./pages/WordChain";

function App() {
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const handleGameSelect = (gameId: string) => {
    setCurrentGame(gameId);
  };

  const handleBack = () => {
    setCurrentGame(null);
  };

  // Render the selected game
  if (currentGame === "question-cards") {
    return <QuestionCards onBack={handleBack} />;
  }

  if (currentGame === "truth-or-dare") {
    return <TruthOrDare onBack={handleBack} />;
  }

  if (currentGame === "random-mission") {
    return <RandomMission onBack={handleBack} />;
  }

  if (currentGame === "balance-game") {
    return <BalanceGame onBack={handleBack} />;
  }

  if (currentGame === "word-chain") {
    return <WordChain onBack={handleBack} />;
  }

  // Default to menu
  return <Menu onGameSelect={handleGameSelect} />;
}

export default App;

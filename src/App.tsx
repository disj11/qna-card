import { useState } from "react";
import Menu from "./pages/Menu";
import QuestionCards from "./pages/QuestionCards";
import QuestionCardsMultiplayer from "./pages/QuestionCardsMultiplayer";
import TruthOrDare from "./pages/TruthOrDare";
import TruthOrDareMultiplayer from "./pages/TruthOrDareMultiplayer";
import RandomMission from "./pages/RandomMission";
import BalanceGame from "./pages/BalanceGame";
import BalanceGameMultiplayer from "./pages/BalanceGameMultiplayer";
import WordChain from "./pages/WordChain";
import GameModeSelector from "./components/GameModeSelector";

import WordChainMultiplayer from "./pages/WordChainMultiplayer";
import RandomMissionMultiplayer from "./pages/RandomMissionMultiplayer";

interface GameInfo {
  title: string;
  emoji: string;
  description: string;
  gradient: string;
  hasMultiplayer: boolean;
}

const gameInfoMap: Record<string, GameInfo> = {
  "question-cards": {
    title: "질문카드",
    emoji: "💝",
    description: "서로를 알아가는 질문 게임",
    gradient: "from-purple-500 to-pink-500",
    hasMultiplayer: true,
  },
  "truth-or-dare": {
    title: "진실 혹은 거짓",
    emoji: "🎭",
    description: "진실을 맞추는 추리 게임",
    gradient: "from-blue-500 to-cyan-500",
    hasMultiplayer: true,
  },
  "random-mission": {
    title: "랜덤 미션",
    emoji: "🎲",
    description: "재미있는 랜덤 미션 수행",
    gradient: "from-green-500 to-emerald-500",
    hasMultiplayer: true,
  },
  "balance-game": {
    title: "밸런스 게임",
    emoji: "⚖️",
    description: "둘 중 하나를 선택하세요",
    gradient: "from-orange-500 to-red-500",
    hasMultiplayer: true,
  },
  "word-chain": {
    title: "초성 게임",
    emoji: "🔤",
    description: "초성으로 단어 맞추기",
    gradient: "from-indigo-500 to-purple-500",
    hasMultiplayer: true,
  },
};

function App() {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<"single" | "multi" | null>(null);

  const handleGameSelect = (gameId: string) => {
    const gameInfo = gameInfoMap[gameId];

    // If game doesn't have multiplayer, go directly to single player mode
    if (!gameInfo?.hasMultiplayer) {
      setCurrentGame(gameId);
      setGameMode("single");
    } else {
      // Show mode selector for games with multiplayer
      setCurrentGame(gameId);
      setGameMode(null);
    }
  };

  const handleModeSelect = (mode: "single" | "multi") => {
    setGameMode(mode);
  };

  const handleBack = () => {
    // If in game, go back to mode selector
    if (gameMode) {
      const gameInfo = gameInfoMap[currentGame || ""];
      if (gameInfo?.hasMultiplayer) {
        setGameMode(null);
      } else {
        setCurrentGame(null);
        setGameMode(null);
      }
    } else {
      // If in mode selector, go back to menu
      setCurrentGame(null);
      setGameMode(null);
    }
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
    setGameMode(null);
  };

  // Show mode selector if game is selected but mode is not
  if (currentGame && !gameMode && gameInfoMap[currentGame]?.hasMultiplayer) {
    const gameInfo = gameInfoMap[currentGame];
    return (
      <GameModeSelector
        gameTitle={gameInfo.title}
        gameEmoji={gameInfo.emoji}
        gameDescription={gameInfo.description}
        gradient={gameInfo.gradient}
        onSelectMode={handleModeSelect}
        onBack={handleBackToMenu}
      />
    );
  }

  // Render the selected game with mode
  if (currentGame === "question-cards" && gameMode === "single") {
    return <QuestionCards onBack={handleBack} />;
  }

  if (currentGame === "question-cards" && gameMode === "multi") {
    return <QuestionCardsMultiplayer onBack={handleBack} />;
  }

  if (currentGame === "truth-or-dare" && gameMode === "single") {
    return <TruthOrDare onBack={handleBack} />;
  }

  if (currentGame === "truth-or-dare" && gameMode === "multi") {
    return <TruthOrDareMultiplayer onBack={handleBack} />;
  }

  if (currentGame === "random-mission" && gameMode === "single") {
    return <RandomMission onBack={handleBack} />;
  }

  if (currentGame === "random-mission" && gameMode === "multi") {
    return <RandomMissionMultiplayer onBack={handleBack} />;
  }

  if (currentGame === "balance-game" && gameMode === "single") {
    return <BalanceGame onBack={handleBack} />;
  }

  if (currentGame === "balance-game" && gameMode === "multi") {
    return <BalanceGameMultiplayer onBack={handleBack} />;
  }

  if (currentGame === "word-chain" && gameMode === "single") {
    return <WordChain onBack={handleBackToMenu} />;
  }

  if (currentGame === "word-chain" && gameMode === "multi") {
    return <WordChainMultiplayer onBack={handleBack} />;
  }

  if (currentGame === "word-chain" && gameMode === "multi") {
    return <WordChainMultiplayer onBack={handleBack} />;
  }

  // Default to menu
  return <Menu onGameSelect={handleGameSelect} />;
}

export default App;

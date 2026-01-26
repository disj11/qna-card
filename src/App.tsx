import { Routes, Route, useNavigate, useParams } from "react-router-dom";
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
import ErrorBoundary from "./components/common/ErrorBoundary";

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

const GameModeSelectorWrapper = () => {
  const { gameId } = useParams<{ gameId: string }>();
  if (!gameId || !gameInfoMap[gameId]) {
    return <div>잘못된 접근입니다.</div>;
  }
  const gameInfo = gameInfoMap[gameId];
  return (
    <GameModeSelector
      gameTitle={gameInfo.title}
      gameEmoji={gameInfo.emoji}
      gameDescription={gameInfo.description}
      gradient={gameInfo.gradient}
    />
  );
};

function App() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Menu />} />

        {/* Game Mode Selectors */}
        <Route path="/game/:gameId" element={<GameModeSelectorWrapper />} />

        {/* Single Player Games */}
        <Route
          path="/game/question-cards/single"
          element={<QuestionCards onBack={() => navigate("/game/question-cards")} />}
        />
        <Route
          path="/game/truth-or-dare/single"
          element={<TruthOrDare onBack={() => navigate("/game/truth-or-dare")} />}
        />
        <Route
          path="/game/random-mission/single"
          element={<RandomMission onBack={() => navigate("/game/random-mission")} />}
        />
        <Route
          path="/game/balance-game/single"
          element={<BalanceGame onBack={() => navigate("/game/balance-game")} />}
        />
        <Route
          path="/game/word-chain/single"
          element={<WordChain onBack={() => navigate("/game/word-chain")} />}
        />

        {/* Multiplayer Games */}
        <Route
          path="/game/question-cards/multi"
          element={<QuestionCardsMultiplayer onBack={() => navigate("/game/question-cards")} />}
        />
        <Route
          path="/game/truth-or-dare/multi"
          element={<TruthOrDareMultiplayer onBack={() => navigate("/game/truth-or-dare")} />}
        />
        <Route
          path="/game/random-mission/multi"
          element={<RandomMissionMultiplayer onBack={() => navigate("/game/random-mission")} />}
        />
        <Route
          path="/game/balance-game/multi"
          element={<BalanceGameMultiplayer onBack={() => navigate("/game/balance-game")} />}
        />
        <Route
          path="/game/word-chain/multi"
          element={<WordChainMultiplayer onBack={() => navigate("/game/word-chain")} />}
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;

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
import NotFound from "./pages/NotFound";
import { gameInfoMap } from "./data/games";

import WordChainMultiplayer from "./pages/WordChainMultiplayer";
import RandomMissionMultiplayer from "./pages/RandomMissionMultiplayer";

const GameModeSelectorWrapper = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const gameInfo = gameId
    ? gameInfoMap[gameId as keyof typeof gameInfoMap]
    : null;

  if (!gameInfo) {
    return (
      <NotFound
        title="잘못된 게임 주소입니다"
        message="선택한 게임을 찾을 수 없습니다. 메인 메뉴에서 다시 선택해 주세요."
      />
    );
  }

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
          element={
            <QuestionCards onBack={() => navigate("/game/question-cards")} />
          }
        />
        <Route
          path="/game/truth-or-dare/single"
          element={
            <TruthOrDare onBack={() => navigate("/game/truth-or-dare")} />
          }
        />
        <Route
          path="/game/random-mission/single"
          element={
            <RandomMission onBack={() => navigate("/game/random-mission")} />
          }
        />
        <Route
          path="/game/balance-game/single"
          element={
            <BalanceGame onBack={() => navigate("/game/balance-game")} />
          }
        />
        <Route
          path="/game/word-chain/single"
          element={<WordChain onBack={() => navigate("/game/word-chain")} />}
        />

        {/* Multiplayer Games */}
        <Route
          path="/game/question-cards/multi"
          element={
            <QuestionCardsMultiplayer
              onBack={() => navigate("/game/question-cards")}
            />
          }
        />
        <Route
          path="/game/truth-or-dare/multi"
          element={
            <TruthOrDareMultiplayer
              onBack={() => navigate("/game/truth-or-dare")}
            />
          }
        />
        <Route
          path="/game/random-mission/multi"
          element={
            <RandomMissionMultiplayer
              onBack={() => navigate("/game/random-mission")}
            />
          }
        />
        <Route
          path="/game/balance-game/multi"
          element={
            <BalanceGameMultiplayer
              onBack={() => navigate("/game/balance-game")}
            />
          }
        />
        <Route
          path="/game/word-chain/multi"
          element={
            <WordChainMultiplayer onBack={() => navigate("/game/word-chain")} />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;

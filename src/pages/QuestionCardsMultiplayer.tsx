import { useState, useEffect } from "react";
import { useMultiplayer } from "../hooks/useMultiplayer";
import MultiplayerLobby from "../components/MultiplayerLobby";
import ChatBox from "../components/ChatBox";
import Button from "../components/common/Button";
import GlassPanel from "../components/common/GlassPanel";
import PageShell from "../components/common/PageShell";
import SetupForm from "../components/common/SetupForm";
import { dailyQuestions, loveQuestions } from "../data/questionCards";

interface QuestionCardsMultiplayerProps {
  onBack: () => void;
}

interface GameState {
  currentQuestionId: number | null;
  flippedCards: number[];
  currentCategory: "daily" | "love";
}

export default function QuestionCardsMultiplayer({
  onBack,
}: QuestionCardsMultiplayerProps) {
  const multiplayer = useMultiplayer();
  const [gameStarted, setGameStarted] = useState(false);
  const [setupMode, setSetupMode] = useState<"none" | "create" | "join">(
    "none"
  );
  const [nickname, setNickname] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<"daily" | "love">(
    "daily"
  );

  const gameState = multiplayer.gameState as GameState | null;

  useEffect(() => {
    if (multiplayer.gameState) {
      setGameStarted(true);
    }
  }, [multiplayer.gameState]);

  // Sync local category with shared game state
  useEffect(() => {
    if (
      gameState?.currentCategory &&
      gameState.currentCategory !== currentCategory
    ) {
      setCurrentCategory(gameState.currentCategory);
    }
  }, [gameState?.currentCategory, currentCategory]);

  // Scroll to the focused card
  useEffect(() => {
    if (gameState?.currentQuestionId) {
      const cardElement = document.getElementById(
        `card-${gameState.currentQuestionId}`
      );
      cardElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [gameState?.currentQuestionId, currentCategory]);

  const handleCreateRoom = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요");
      return;
    }
    const created = await multiplayer.createRoom(nickname.trim());
    if (created) {
      setSetupMode("none");
    }
  };

  const handleJoinRoom = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요");
      return;
    }
    if (!roomIdInput.trim()) {
      alert("방 코드를 입력해주세요");
      return;
    }
    const joined = await multiplayer.joinRoom(
      nickname.trim(),
      roomIdInput.trim().toUpperCase()
    );
    if (joined) {
      setSetupMode("none");
    }
  };

  const handleStartGame = () => {
    const initialState: GameState = {
      currentQuestionId: null,
      flippedCards: [],
      currentCategory: "daily",
    };
    multiplayer.startGame(initialState as unknown);
    setGameStarted(true);
  };

  const handleCardFlip = (questionId: number) => {
    if (!multiplayer.isMyTurn() || !gameState) return;

    // Prevent flipping if a card is already focused this turn
    if (gameState.currentQuestionId !== null) {
      return;
    }

    // Prevent flipping a card that is already in flippedCards
    if (gameState.flippedCards.includes(questionId)) {
      return;
    }

    const isDaily = dailyQuestions.some((q) => q.id === questionId);
    const category = isDaily ? "daily" : "love";

    const newState: GameState = {
      ...gameState,
      currentQuestionId: questionId,
      flippedCards: [...gameState.flippedCards, questionId],
      currentCategory: category,
    };

    multiplayer.updateGameState(newState);
  };

  const handleNextTurn = () => {
    if (!multiplayer.isMyTurn() || !gameState) return;

    // Reset the focused card, but keep the flippedCards history
    const newState: GameState = {
      ...gameState,
      currentQuestionId: null,
    };
    multiplayer.updateGameState(newState);

    const nextPlayerId = multiplayer.getNextPlayer();
    multiplayer.changeTurn(nextPlayerId);
  };

  const handleLeave = () => {
    multiplayer.leaveRoom();
    onBack();
  };

  // Setup screen
  if (setupMode === "none" && !multiplayer.isConnected) {
    return (
      <PageShell centered>
        <GlassPanel size="lg" className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💝</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              질문카드 멀티플레이어
            </h1>
            <p className="text-white/70">친구들과 함께 서로를 알아가보세요!</p>
          </div>

          <div className="space-y-4">
            <Button onClick={() => setSetupMode("create")} size="lg" fullWidth>
              🎮 방 만들기
            </Button>
            <Button
              onClick={() => setSetupMode("join")}
              variant="secondary"
              size="lg"
              fullWidth
            >
              🚪 방 참가하기
            </Button>
            <Button onClick={onBack} variant="secondary" fullWidth>
              돌아가기
            </Button>
          </div>
        </GlassPanel>
      </PageShell>
    );
  }

  // Create room screen
  if (setupMode === "create") {
    return (
      <PageShell centered>
        <SetupForm
          icon="🎮"
          title="방 만들기"
          description="닉네임을 입력해주세요"
          nickname={nickname}
          onNicknameChange={setNickname}
          primaryLabel="방 만들기"
          isLoading={multiplayer.isConnecting}
          error={multiplayer.error}
          onSubmit={handleCreateRoom}
          onBack={() => setSetupMode("none")}
        />
      </PageShell>
    );
  }

  // Join room screen
  if (setupMode === "join") {
    return (
      <PageShell centered>
        <SetupForm
          icon="🚪"
          title="방 참가하기"
          description="닉네임과 방 코드를 입력해주세요"
          nickname={nickname}
          onNicknameChange={setNickname}
          roomId={roomIdInput}
          onRoomIdChange={(value) => setRoomIdInput(value.toUpperCase())}
          primaryLabel="참가하기"
          isLoading={multiplayer.isConnecting}
          error={multiplayer.error}
          onSubmit={handleJoinRoom}
          onBack={() => setSetupMode("none")}
        />
      </PageShell>
    );
  }

  // Lobby screen
  if (multiplayer.isConnected && !gameStarted) {
    return (
      <MultiplayerLobby
        isHost={multiplayer.isHost}
        roomId={multiplayer.roomId || ""}
        players={multiplayer.players}
        localPlayer={multiplayer.localPlayer}
        onReady={multiplayer.setReady}
        onStartGame={handleStartGame}
        onBack={handleLeave}
        allPlayersReady={multiplayer.areAllPlayersReady()}
      />
    );
  }

  // Game screen
  const questions =
    currentCategory === "daily" ? dailyQuestions : loveQuestions;
  const currentTurnPlayer = Array.from(multiplayer.players.values()).find(
    (p) => p.id === multiplayer.currentTurn
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Emoji Reactions Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {multiplayer.emojiReactions.map((reaction, index) => (
          <div
            key={reaction.timestamp}
            className="absolute animate-float-up"
            style={{
              left: `${20 + (index % 5) * 15}%`,
              bottom: "10%",
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div className="text-6xl">{reaction.emoji}</div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={handleLeave}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group"
              >
                <svg
                  className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-medium">나가기</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">방:</span>
                <span className="text-yellow-400 font-mono font-bold">
                  {multiplayer.roomId}
                </span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 drop-shadow-lg">
                💝 질문카드 (멀티플레이어)
              </h1>

              {/* Current Turn Indicator */}
              <div className="flex items-center justify-center gap-2">
                <div
                  className={`px-4 py-2 rounded-full ${
                    multiplayer.isMyTurn()
                      ? "bg-green-500/30 border-2 border-green-400"
                      : "bg-white/10"
                  }`}
                >
                  <span className="text-white font-semibold">
                    {multiplayer.isMyTurn()
                      ? "🎯 내 차례!"
                      : `${currentTurnPlayer?.nickname || ""}님의 차례`}
                  </span>
                </div>
              </div>

              {/* Next Turn Button */}
              {multiplayer.isMyTurn() && gameState?.currentQuestionId && (
                <button
                  onClick={handleNextTurn}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  다음 사람 차례 넘기기 →
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Category Tabs */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setCurrentCategory("daily")}
              className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 ${
                currentCategory === "daily"
                  ? "bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-lg"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              🌱 일상편
            </button>
            <button
              onClick={() => setCurrentCategory("love")}
              className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 ${
                currentCategory === "love"
                  ? "bg-gradient-to-r from-pink-400 to-red-400 text-white shadow-lg"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              💕 연애편
            </button>
          </div>

          {/* Question Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8">
            {questions.map((question) => {
              const isFlipped = gameState?.flippedCards.includes(question.id);
              const isCurrentCard =
                gameState?.currentQuestionId === question.id;

              return (
                <button
                  key={question.id}
                  id={`card-${question.id}`}
                  onClick={() => handleCardFlip(question.id)}
                  disabled={!multiplayer.isMyTurn() || isFlipped}
                  className={`relative group ${
                    !multiplayer.isMyTurn() || isFlipped
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                >
                  <div
                    className={`aspect-[3/4] rounded-2xl shadow-2xl transition-all duration-500 transform ${
                      isCurrentCard ? "ring-4 ring-yellow-400 scale-105" : ""
                    } ${
                      multiplayer.isMyTurn()
                        ? "hover:scale-105 active:scale-95"
                        : ""
                    }`}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isFlipped
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                    }}
                  >
                    {/* Front */}
                    <div
                      className={`absolute inset-0 rounded-2xl flex items-center justify-center ${
                        currentCategory === "daily"
                          ? "bg-gradient-to-br from-green-400 to-blue-500"
                          : "bg-gradient-to-br from-pink-400 to-red-500"
                      }`}
                      style={{
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <div className="text-6xl sm:text-7xl">?</div>
                      <div className="absolute top-2 right-2 bg-black/30 px-2 py-1 rounded-lg">
                        <span className="text-white text-xs font-bold">
                          #{question.id}
                        </span>
                      </div>
                    </div>

                    {/* Back */}
                    <div
                      className={`absolute inset-0 rounded-2xl p-4 flex items-center justify-center text-center ${
                        currentCategory === "daily"
                          ? "bg-gradient-to-br from-blue-500 to-green-400"
                          : "bg-gradient-to-br from-red-500 to-pink-400"
                      }`}
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <p className="text-white text-sm sm:text-base font-medium leading-relaxed">
                        {question.text}
                      </p>
                      <div className="absolute top-2 right-2 bg-black/30 px-2 py-1 rounded-lg">
                        <span className="text-white text-xs font-bold">
                          #{question.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Players Info */}
        <div className="fixed bottom-4 left-4 z-30 bg-black/30 backdrop-blur-md rounded-2xl p-4 max-w-xs">
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            <span>👥</span>
            <span>참가자 ({multiplayer.players.size})</span>
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Array.from(multiplayer.players.values()).map((player) => (
              <div
                key={player.id}
                className={`flex items-center gap-2 text-sm ${
                  player.id === multiplayer.currentTurn
                    ? "text-yellow-400 font-bold"
                    : "text-white/70"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    player.status === "online" ? "bg-green-400" : "bg-gray-400"
                  }`}
                ></div>
                <span>{player.nickname}</span>
                {player.isHost && <span>👑</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Box */}
      <ChatBox
        messages={multiplayer.chatMessages}
        onSendMessage={multiplayer.sendChatMessage}
        onSendEmoji={multiplayer.sendEmoji}
        isMinimized={isChatMinimized}
        onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
      />
    </div>
  );
}

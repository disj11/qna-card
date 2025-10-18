import { useState, useEffect } from "react";
import { useMultiplayer } from "../hooks/useMultiplayer";
import MultiplayerLobby from "../components/MultiplayerLobby";
import ChatBox from "../components/ChatBox";

interface BalanceQuestion {
  id: number;
  optionA: string;
  optionB: string;
  emoji: string;
}

const questions: BalanceQuestion[] = [
  { id: 1, optionA: "평생 여름", optionB: "평생 겨울", emoji: "🌡️" },
  { id: 2, optionA: "투명인간", optionB: "하늘을 나는 능력", emoji: "🦸" },
  { id: 3, optionA: "과거로 가기", optionB: "미래로 가기", emoji: "⏰" },
  {
    id: 4,
    optionA: "평생 아침형 인간",
    optionB: "평생 저녁형 인간",
    emoji: "🌅",
  },
  {
    id: 5,
    optionA: "부자이지만 불행",
    optionB: "가난하지만 행복",
    emoji: "💰",
  },
  { id: 6, optionA: "평생 짜장면", optionB: "평생 짬뽕", emoji: "🍜" },
  {
    id: 7,
    optionA: "읽는 능력 상실",
    optionB: "말하는 능력 상실",
    emoji: "🗣️",
  },
  { id: 8, optionA: "10억 받기", optionB: "진정한 사랑 찾기", emoji: "❤️" },
  { id: 9, optionA: "과거 기억 삭제", optionB: "미래 기억 삭제", emoji: "🧠" },
  { id: 10, optionA: "평생 단 음식", optionB: "평생 짠 음식", emoji: "🍰" },
];

interface BalanceGameMultiplayerProps {
  onBack: () => void;
}

interface GameState {
  currentQuestionIndex: number;
  votes: [string, { questionId: number; choice: "A" | "B" }][];
  allVoted: boolean;
}

export default function BalanceGameMultiplayer({
  onBack,
}: BalanceGameMultiplayerProps) {
  const multiplayer = useMultiplayer();
  const [gameStarted, setGameStarted] = useState(false);
  const [setupMode, setSetupMode] = useState<"none" | "create" | "join">(
    "none",
  );
  const [nickname, setNickname] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  useEffect(() => {
    if (multiplayer.gameState) {
      setGameStarted(true);
    }
  }, [multiplayer.gameState]);

  const handleCreateRoom = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요");
      return;
    }
    await multiplayer.createRoom(nickname.trim());
    setSetupMode("none");
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
    await multiplayer.joinRoom(
      nickname.trim(),
      roomIdInput.trim().toUpperCase(),
    );
    setSetupMode("none");
  };

  const handleStartGame = () => {
    const initialState: GameState = {
      currentQuestionIndex: 0,
      votes: [],
      allVoted: false,
    };
    multiplayer.startGame(initialState);
    setGameStarted(true);
  };

  const handleVote = (choice: "A" | "B") => {
    const gameState = multiplayer.gameState as GameState;
    const currentQuestion = questions[gameState.currentQuestionIndex];
    const newVotes = new Map(gameState.votes);
    newVotes.set(multiplayer.localPlayer!.id, {
      questionId: currentQuestion.id,
      choice,
    });

    const allVoted = newVotes.size === multiplayer.players.size;

    const newState: GameState = {
      ...gameState,
      votes: Array.from(newVotes.entries()),
      allVoted,
    };

    multiplayer.updateGameState(newState);
  };

  const handleNextQuestion = () => {
    const gameState = multiplayer.gameState as GameState;
    const nextIndex = gameState.currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      return;
    }

    const newState: GameState = {
      currentQuestionIndex: nextIndex,
      votes: [],
      allVoted: false,
    };

    multiplayer.updateGameState(newState);
  };

  const handleLeave = () => {
    multiplayer.leaveRoom();
    onBack();
  };

  const gameState = multiplayer.gameState as GameState | null;
  const currentQuestion = gameState
    ? questions[gameState.currentQuestionIndex]
    : null;
  const myVote = gameState
    ? new Map(gameState.votes).get(multiplayer.localPlayer?.id || "")
    : null;
  const hasVoted = myVote != null;
  const isLastQuestion =
    gameState && gameState.currentQuestionIndex >= questions.length - 1;

  // Setup screen
  if (setupMode === "none" && !multiplayer.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚖️</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              밸런스 게임 멀티플레이어
            </h1>
            <p className="text-white/70">친구들과 함께 선택해보세요!</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setSetupMode("create")}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              🎮 방 만들기
            </button>
            <button
              onClick={() => setSetupMode("join")}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              🚪 방 참가하기
            </button>
            <button
              onClick={onBack}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Create room screen
  if (setupMode === "create") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-white mb-2">방 만들기</h2>
            <p className="text-white/70">닉네임을 입력해주세요</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              maxLength={20}
              className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
            />
            <button
              onClick={handleCreateRoom}
              disabled={multiplayer.isConnecting || !nickname.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {multiplayer.isConnecting ? "생성 중..." : "방 만들기"}
            </button>
            <button
              onClick={() => setSetupMode("none")}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all"
            >
              뒤로
            </button>
          </div>

          {multiplayer.error && (
            <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-xl p-3">
              <p className="text-red-200 text-sm">{multiplayer.error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Join room screen
  if (setupMode === "join") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🚪</div>
            <h2 className="text-2xl font-bold text-white mb-2">방 참가하기</h2>
            <p className="text-white/70">닉네임과 방 코드를 입력해주세요</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              maxLength={20}
              className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              type="text"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
              placeholder="방 코드 (예: ABC123)"
              maxLength={6}
              className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 font-mono text-center text-xl"
              onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
            />
            <button
              onClick={handleJoinRoom}
              disabled={
                multiplayer.isConnecting ||
                !nickname.trim() ||
                !roomIdInput.trim()
              }
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {multiplayer.isConnecting ? "참가 중..." : "참가하기"}
            </button>
            <button
              onClick={() => setSetupMode("none")}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all"
            >
              뒤로
            </button>
          </div>

          {multiplayer.error && (
            <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-xl p-3">
              <p className="text-red-200 text-sm">{multiplayer.error}</p>
            </div>
          )}
        </div>
      </div>
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
  if (!currentQuestion) return null;

  const getVotesForOption = (option: "A" | "B") => {
    if (!gameState) return [];
    return gameState.votes
      .filter(([_, vote]) => vote.choice === option)
      .map(([playerId]) => multiplayer.players.get(playerId))
      .filter(Boolean);
  };

  const votesA = getVotesForOption("A");
  const votesB = getVotesForOption("B");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 drop-shadow-lg">
                ⚖️ 밸런스 게임
              </h1>
              <div className="text-white/70 text-sm">
                질문 {gameState!.currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="max-w-4xl w-full space-y-6">
            {/* Question Display */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="text-6xl sm:text-7xl mb-4">
                  {currentQuestion.emoji}
                </div>
                <div className="text-xl sm:text-2xl text-white/90 font-medium">
                  무엇을 선택하시겠습니까?
                </div>
              </div>

              {/* Options */}
              {!gameState!.allVoted ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleVote("A")}
                    disabled={hasVoted}
                    className={`p-6 sm:p-8 rounded-2xl transition-all transform hover:scale-105 active:scale-95 ${
                      myVote?.choice === "A"
                        ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/50"
                        : "bg-white/10 hover:bg-white/20"
                    } disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    <div className="text-4xl sm:text-5xl mb-4">🅰️</div>
                    <div className="text-lg sm:text-xl text-white font-semibold leading-relaxed">
                      {currentQuestion.optionA}
                    </div>
                    {myVote?.choice === "A" && (
                      <div className="mt-3 text-green-400 font-semibold">
                        ✓ 선택됨
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => handleVote("B")}
                    disabled={hasVoted}
                    className={`p-6 sm:p-8 rounded-2xl transition-all transform hover:scale-105 active:scale-95 ${
                      myVote?.choice === "B"
                        ? "bg-gradient-to-br from-pink-500 to-pink-700 shadow-lg shadow-pink-500/50"
                        : "bg-white/10 hover:bg-white/20"
                    } disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    <div className="text-4xl sm:text-5xl mb-4">🅱️</div>
                    <div className="text-lg sm:text-xl text-white font-semibold leading-relaxed">
                      {currentQuestion.optionB}
                    </div>
                    {myVote?.choice === "B" && (
                      <div className="mt-3 text-green-400 font-semibold">
                        ✓ 선택됨
                      </div>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-500/20 rounded-2xl p-6 border border-blue-400/30">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-4xl">🅰️</span>
                        <span className="text-blue-400 font-bold text-2xl">
                          {votesA.length}명
                        </span>
                      </div>
                      <div className="text-white font-semibold mb-2">
                        {currentQuestion.optionA}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {votesA.map((player) => (
                          <span
                            key={player?.id}
                            className="bg-blue-500/30 px-2 py-1 rounded-full text-xs text-white"
                          >
                            {player?.nickname}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-pink-500/20 rounded-2xl p-6 border border-pink-400/30">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-4xl">🅱️</span>
                        <span className="text-pink-400 font-bold text-2xl">
                          {votesB.length}명
                        </span>
                      </div>
                      <div className="text-white font-semibold mb-2">
                        {currentQuestion.optionB}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {votesB.map((player) => (
                          <span
                            key={player?.id}
                            className="bg-pink-500/30 px-2 py-1 rounded-full text-xs text-white"
                          >
                            {player?.nickname}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Next Button */}
                  {!isLastQuestion && (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
                    >
                      다음 질문 →
                    </button>
                  )}
                  {isLastQuestion && (
                    <div className="text-center py-4">
                      <div className="text-white text-xl font-bold mb-2">
                        🎉 모든 질문이 끝났습니다!
                      </div>
                      <p className="text-white/70">
                        친구들과 선택을 비교해보세요
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Waiting message */}
              {hasVoted && !gameState!.allVoted && (
                <div className="text-center mt-6">
                  <div className="text-white/70">
                    다른 참가자들을 기다리는 중...
                  </div>
                  <div className="text-sm text-white/50 mt-2">
                    ({gameState!.votes.length} / {multiplayer.players.size})
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
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

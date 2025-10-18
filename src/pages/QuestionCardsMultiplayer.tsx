import { useState, useEffect } from "react";
import { useMultiplayer } from "../hooks/useMultiplayer";
import MultiplayerLobby from "../components/MultiplayerLobby";
import ChatBox from "../components/ChatBox";

interface Question {
  id: number;
  text: string;
}

const dailyQuestions: Question[] = [
  { id: 1, text: "아침에 일어나 가장 먼저 하는 일은 무엇인가요?" },
  { id: 2, text: "하루 중 가장 좋아하는 시간은 언제인가요? 그 이유는?" },
  { id: 3, text: "요즘 가장 자주 듣는 노래가 있나요?" },
  { id: 4, text: "나만 알고 싶은 동네 맛집이 있다면?" },
  { id: 5, text: "스트레스받을 때 주로 어떻게 푸나요?" },
  { id: 6, text: "최근에 가장 재미있게 본 영화나 드라마는 무엇인가요?" },
  { id: 7, text: "잠들기 전 꼭 하는 나만의 습관이 있나요?" },
  { id: 8, text: "핸드폰으로 가장 많이 사용하는 앱은 무엇인가요?" },
  { id: 9, text: '"소울 푸드"라고 부를 만한 음식이 있나요?' },
  { id: 10, text: "학창 시절 가장 좋아했던 과목은 무엇이었나요?" },
  { id: 11, text: "단 하루, 다른 사람으로 살 수 있다면 누가 되고 싶나요?" },
  { id: 12, text: "어릴 적 꿈은 무엇이었나요?" },
  { id: 13, text: "최근에 가장 크게 웃었던 기억은 무엇인가요?" },
  { id: 14, text: "나를 동물에 비유한다면 어떤 동물일 것 같나요?" },
  { id: 15, text: "여행 갈 때 꼭 챙기는 물건이 있나요?" },
  { id: 16, text: "갑자기 하루의 휴가가 주어진다면 무엇을 하고 싶나요?" },
  { id: 17, text: "초능력을 가질 수 있다면, 어떤 능력을 원하나요?" },
  { id: 18, text: "가장 좋아하는 계절과 그 이유는 무엇인가요?" },
  { id: 19, text: "내일 지구가 멸망한다면 오늘 무엇을 먹을 건가요?" },
  { id: 20, text: "가장 기억에 남는 여행지는 어디인가요?" },
  { id: 21, text: "아침형 인간인가요, 저녁형 인간인가요?" },
  { id: 22, text: "사소하지만 확실한 행복을 느끼는 순간은 언제인가요?" },
  { id: 23, text: "가장 좋아하는 음료나 카페 메뉴가 있나요?" },
  { id: 24, text: "요리하는 것을 좋아하나요? 자주 하는 요리가 있다면?" },
  { id: 25, text: "인생 책이나 인생 영화라고 할 만한 작품이 있나요?" },
  { id: 26, text: "집에서 가장 좋아하는 공간은 어디인가요?" },
  { id: 27, text: "어떤 향기를 가장 좋아하나요? (음식, 자연, 향수 등)" },
  { id: 28, text: "지금까지 받아본 선물 중 가장 기억에 남는 것은 무엇인가요?" },
  { id: 29, text: "주말에 주로 무엇을 하며 시간을 보내나요?" },
  { id: 30, text: "10년 후의 나는 어떤 모습일 것 같나요?" },
];

const loveQuestions: Question[] = [
  { id: 31, text: "저에 대한 첫인상은 어땠나요?" },
  { id: 32, text: "첫 만남에서 가장 기억에 남는 장면이 있다면?" },
  {
    id: 33,
    text: "사람을 볼 때 가장 먼저, 그리고 중요하게 보는 부분은 무엇인가요?",
  },
  {
    id: 34,
    text: "연애할 때 가장 중요하다고 생각하는 가치 한 가지를 꼽는다면?",
  },
  { id: 35, text: "가장 이상적이라고 생각하는 데이트는 어떤 모습인가요?" },
  { id: 36, text: "이성에게 '심쿵'하게 되는 순간은 언제인가요?" },
  {
    id: 37,
    text: "즉흥적인 데이트와 계획적인 데이트 중 어떤 것을 더 선호하세요?",
  },
  {
    id: 38,
    text: "'친구 같은 편안한 연애' vs '언제나 설레는 연애', 어느 쪽을 더 선호하나요?",
  },
  { id: 39, text: "연락 문제(연락 빈도 등)에 대해 어떻게 생각하세요?" },
  { id: 40, text: "연애가 삶에서 어느 정도의 우선순위를 차지하는 것 같나요?" },
  { id: 41, text: "함께 여행 가고 싶은 곳이 있다면 어디인가요? (국내/해외)" },
  { id: 42, text: "나를 색깔로 표현한다면 무슨 색일 것 같나요? 그 이유는?" },
  {
    id: 43,
    text: "연애하면서 '이것만은 존중해줬으면 좋겠다!' 하는 것이 있나요?",
  },
  { id: 44, text: "저에게 궁금했지만, 아직 물어보지 못한 질문이 있나요?" },
  { id: 45, text: "함께 도전해보고 싶은 새로운 취미가 있나요?" },
  { id: 46, text: "기념일을 챙기는 것에 대해 어떻게 생각하세요?" },
  { id: 47, text: "어떤 칭찬을 들었을 때 기분이 가장 좋은가요?" },
  { id: 48, text: "'사랑'을 한 단어로 정의한다면?" },
  { id: 49, text: "혼자만의 시간이 꼭 필요한 편인가요?" },
  {
    id: 50,
    text: "선물을 받을 때, '실용적인 선물'과 '예쁜 선물' 중 어느 쪽이 더 좋은가요?",
  },
  { id: 51, text: "학창 시절에 어떤 학생이었어요?" },
  { id: 52, text: "가장 자신 있는 요리가 있다면 무엇인가요?" },
  {
    id: 53,
    text: "플레이리스트를 공유한다면, 가장 먼저 들려주고 싶은 노래는?",
  },
  { id: 54, text: "이른바 '남사친/여사친' 문제에 대해 어떻게 생각하세요?" },
  { id: 55, text: "연인과 꼭 해보고 싶은 버킷리스트가 있나요?" },
  {
    id: 56,
    text: "글(카톡, 편지)로 마음을 표현하는 것과 말로 표현하는 것 중 어떤 게 더 편한가요?",
  },
  { id: 57, text: "주변 친구들은 보통 본인을 어떤 사람이라고 표현하나요?" },
  { id: 58, text: "쉬는 날 주로 무엇을 하며 에너지를 얻는 편인가요?" },
  { id: 59, text: "사소하지만 확실하게 행복을 느끼는 순간은 언제인가요?" },
  { id: 60, text: "오늘 대화에서 가장 인상 깊었던 점은 무엇인가요?" },
];

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
    "none",
  );
  const [nickname, setNickname] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<"daily" | "love">(
    "daily",
  );

  const gameState = multiplayer.gameState as GameState | null;

  useEffect(() => {
    if (multiplayer.gameState) {
      setGameStarted(true);
    }
  }, [multiplayer.gameState]);

  // Sync local category with shared game state
  useEffect(() => {
    if (gameState?.currentCategory && gameState.currentCategory !== currentCategory) {
      setCurrentCategory(gameState.currentCategory);
    }
  }, [gameState?.currentCategory]);

  // Scroll to the focused card
  useEffect(() => {
    if (gameState?.currentQuestionId) {
      const cardElement = document.getElementById(
        `card-${gameState.currentQuestionId}`,
      );
      cardElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [gameState?.currentQuestionId, currentCategory]);

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💝</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              질문카드 멀티플레이어
            </h1>
            <p className="text-white/70">친구들과 함께 서로를 알아가보세요!</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setSetupMode("create")}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              🎮 방 만들기
            </button>
            <button
              onClick={() => setSetupMode("join")}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
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
              className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
            />
            <button
              onClick={handleCreateRoom}
              disabled={multiplayer.isConnecting || !nickname.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
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
              className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
              placeholder="방 코드 (예: ABC123)"
              maxLength={6}
              className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-center text-xl"
              onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
            />
            <button
              onClick={handleJoinRoom}
              disabled={
                multiplayer.isConnecting ||
                !nickname.trim() ||
                !roomIdInput.trim()
              }
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
  const questions =
    currentCategory === "daily" ? dailyQuestions : loveQuestions;
  const currentTurnPlayer = Array.from(multiplayer.players.values()).find(
    (p) => p.id === multiplayer.currentTurn,
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
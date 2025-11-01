import { useState, useEffect } from "react";
import { useMultiplayer, type GameMessage } from "../hooks/useMultiplayer";
import MultiplayerLobby from "../components/MultiplayerLobby";
import ChatBox from "../components/ChatBox";

interface WordPuzzle {
  id: number;
  consonants: string;
  answer: string;
  hint: string;
  category: string;
}

const puzzles: WordPuzzle[] = [
  {
    id: 1,
    consonants: "ㅋㅍㅌ",
    answer: "컴퓨터",
    hint: "전자기기",
    category: "사물",
  },
  {
    id: 2,
    consonants: "ㅎㄷㅍ",
    answer: "핸드폰",
    hint: "전화기",
    category: "사물",
  },
  {
    id: 3,
    consonants: "ㅊㅇㅈ",
    answer: "초인종",
    hint: "문 앞에 있는",
    category: "사물",
  },
  {
    id: 4,
    consonants: "ㅅㅈ",
    answer: "사자",
    hint: "정글의 왕",
    category: "동물",
  },
  {
    id: 5,
    consonants: "ㄱㅊㅉㄱ",
    answer: "김치찌개",
    hint: "김치로 만든 찌개",
    category: "음식",
  },
  {
    id: 6,
    consonants: "ㄱㅊ",
    answer: "김치",
    hint: "한국의 대표 반찬",
    category: "음식",
  },
  {
    id: 7,
    consonants: "ㅂㅌㅅㄴㄷ",
    answer: "방탄소년단",
    hint: "글로벌 K-POP 그룹",
    category: "연예인",
  },
  {
    id: 8,
    consonants: "ㅊㅊㄱ",
    answer: "춤추기",
    hint: "음악에 맞춰 몸을 움직이는 것",
    category: "동작",
  },
  {
    id: 9,
    consonants: "ㅇㅋㅅㅌ",
    answer: "오케스트라",
    hint: "악단",
    category: "음악",
  },
  {
    id: 10,
    consonants: "ㅅㅁㅌㅍ",
    answer: "스마트폰",
    hint: "똑똑한 전화기",
    category: "사물",
  },
  {
    id: 11,
    consonants: "ㅂㄴㄴ",
    answer: "바나나",
    hint: "노란 과일",
    category: "과일",
  },
  {
    id: 12,
    consonants: "ㅍㅈ",
    answer: "피자",
    hint: "이탈리아 음식",
    category: "음식",
  },
  {
    id: 13,
    consonants: "ㅊㅋ",
    answer: "치킨",
    hint: "국민 야식",
    category: "음식",
  },
  {
    id: 14,
    consonants: "ㅇㅇㅅㅋㄹ",
    answer: "아이스크림",
    hint: "시원한 디저트",
    category: "음식",
  },
  {
    id: 15,
    consonants: "ㅅㅅㅇㄱ",
    answer: "소설읽기",
    hint: "책으로 이야기 즐기기",
    category: "활동",
  },
  {
    id: 16,
    consonants: "ㅇㅎ",
    answer: "여행",
    hint: "떠나는 것",
    category: "활동",
  },
  {
    id: 17,
    consonants: "ㅋㅍ",
    answer: "커피",
    hint: "카페 음료",
    category: "음료",
  },
  {
    id: 18,
    consonants: "ㅈㅈㅁ",
    answer: "짜장면",
    hint: "중국집 메뉴",
    category: "음식",
  },
  {
    id: 19,
    consonants: "ㅉㅃ",
    answer: "짬뽕",
    hint: "빨간 국물",
    category: "음식",
  },
  {
    id: 20,
    consonants: "ㅅㅇㅋ",
    answer: "사이클",
    hint: "자전거 타기",
    category: "운동",
  },
  {
    id: 21,
    consonants: "ㅁㄹㅌ",
    answer: "마라톤",
    hint: "장거리 달리기",
    category: "운동",
  },
  {
    id: 22,
    consonants: "ㅂㄱ",
    answer: "복권",
    hint: "로또",
    category: "사물",
  },
  {
    id: 23,
    consonants: "ㅎㅂㄱ",
    answer: "햄버거",
    hint: "패스트푸드",
    category: "음식",
  },
  {
    id: 24,
    consonants: "ㄴㅍㄹㅅ",
    answer: "넷플릭스",
    hint: "OTT 서비스",
    category: "앱",
  },
  {
    id: 25,
    consonants: "ㅇㅅㅌㄱㄹ",
    answer: "인스타그램",
    hint: "사진 SNS",
    category: "앱",
  },
];

interface WordChainMultiplayerProps {
  onBack: () => void;
}

interface GameState {
  currentPuzzleIndex: number;
  scores: [string, number][];
  isGameOver: boolean;
}

export default function WordChainMultiplayer({
  onBack,
}: WordChainMultiplayerProps) {
  const multiplayer = useMultiplayer();
  const [gameStarted, setGameStarted] = useState(false);
  const [setupMode, setSetupMode] = useState<"none" | "create" | "join">(
    "none",
  );
  const [nickname, setNickname] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const [userInput, setUserInput] = useState("");

  const gameState = multiplayer.gameState as GameState | null;

  useEffect(() => {
    if (multiplayer.gameState) {
      setGameStarted(true);
    }
  }, [multiplayer.gameState]);

  useEffect(() => {
    setUserInput("");
  }, [gameState?.currentPuzzleIndex]);

  // Host-side logic to handle incoming answers
  useEffect(() => {
    if (!multiplayer.isHost) return;

    const handleMessage = (message: GameMessage) => {
      if (message.type === "wordchain-submit") {
        const currentGameState = multiplayer.gameState as GameState;
        if (!currentGameState || currentGameState.isGameOver) return;

        const currentPuzzle = puzzles[currentGameState.currentPuzzleIndex];
        // Prevent processing for already advanced puzzle
        if (!currentPuzzle) return;

        const submittedAnswer = (message.data as { answer: string }).answer;

        if (submittedAnswer === currentPuzzle.answer) {
          const winnerId = message.from;
          const scores = new Map(currentGameState.scores);
          scores.set(winnerId, (scores.get(winnerId) || 0) + 1);

          const nextIndex = currentGameState.currentPuzzleIndex + 1;

          if (nextIndex >= puzzles.length) {
            multiplayer.updateGameState({
              ...currentGameState,
              scores: Array.from(scores.entries()),
              isGameOver: true,
            });
          } else {
            multiplayer.updateGameState({
              ...currentGameState,
              scores: Array.from(scores.entries()),
              currentPuzzleIndex: nextIndex,
            });
          }
        }
      }
    };

    return multiplayer.onMessage(handleMessage);
  }, [multiplayer]);

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
    const playerIds = Array.from(multiplayer.players.keys());
    const initialState: GameState = {
      currentPuzzleIndex: 0,
      scores: playerIds.map((id) => [id, 0]),
      isGameOver: false,
    };
    multiplayer.startGame(initialState);
    setGameStarted(true);
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !gameState) return;

    const submittedAnswer = userInput.trim();
    const currentPuzzle = puzzles[gameState.currentPuzzleIndex];

    if (submittedAnswer === currentPuzzle.answer) {
      if (multiplayer.isHost) {
        // Host handles their own win directly
        const winnerId = multiplayer.localPlayer!.id;
        const scores = new Map(gameState.scores);
        scores.set(winnerId, (scores.get(winnerId) || 0) + 1);

        const nextIndex = gameState.currentPuzzleIndex + 1;

        if (nextIndex >= puzzles.length) {
          multiplayer.updateGameState({
            ...gameState,
            scores: Array.from(scores.entries()),
            isGameOver: true,
          });
        } else {
          multiplayer.updateGameState({
            ...gameState,
            scores: Array.from(scores.entries()),
            currentPuzzleIndex: nextIndex,
          });
        }
      } else {
        // Client sends message to host
        multiplayer.sendMessage({
          type: "wordchain-submit",
          data: { answer: submittedAnswer },
          from: multiplayer.localPlayer!.id,
          timestamp: Date.now(),
        });
      }
    }

    setUserInput("");
  };

  const handleEndGame = () => {
    if (!multiplayer.isHost || !gameState) return;
    const newState: GameState = { ...gameState, isGameOver: true };
    multiplayer.updateGameState(newState);
  };

  const handleLeave = () => {
    multiplayer.leaveRoom();
    onBack();
  };

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
        </div>
      </div>
    );
  }

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
        </div>
      </div>
    );
  }

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

  if (gameState?.isGameOver) {
    const sortedScores = Array.from(new Map(gameState.scores).entries())
      .map(([playerId, score]) => ({
        player: multiplayer.players.get(playerId),
        score,
      }))
      .sort((a, b) => b.score - a.score);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
          <div className="text-center space-y-6">
            <div className="text-6xl">🏆</div>
            <h2 className="text-3xl font-bold text-white">게임 종료!</h2>
            <div className="space-y-3">
              {sortedScores.map((entry, index) => (
                <div
                  key={entry.player?.id}
                  className={`p-4 rounded-2xl ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {index === 0
                          ? "🥇"
                          : index === 1
                            ? "🥈"
                            : index === 2
                              ? "🥉"
                              : `${index + 1}위`}
                      </span>
                      <span className="text-white font-bold">
                        {entry.player?.nickname}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {entry.score}점
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleLeave}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all"
            >
              나가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameStarted && gameState) {
    const currentPuzzle = puzzles[gameState.currentPuzzleIndex];
    const scores = new Map(gameState.scores);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="relative z-10 p-4">
          <header className="flex items-center justify-between mb-4">
            <button
              onClick={handleLeave}
              className="text-white/80 hover:text-white"
            >
              ← 나가기
            </button>
            <h1 className="text-2xl font-bold text-white">초성 게임</h1>
            <div className="text-white/80">
              {gameState.currentPuzzleIndex + 1} / {puzzles.length}
            </div>
          </header>

          <main className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
              <div className="text-sm text-white/70 mb-2">
                {currentPuzzle.category}
              </div>
              <div className="text-7xl font-bold text-white tracking-widest my-4">
                {currentPuzzle.consonants}
              </div>
              <div className="text-sm text-white/70 mb-6">
                힌트: {currentPuzzle.hint}
              </div>

              <form onSubmit={handleSubmitAnswer}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="정답을 입력하세요"
                  className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white text-center text-xl placeholder-white/40 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold"
                >
                  제출
                </button>
              </form>
            </div>

            <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <h3 className="text-white font-bold mb-2 text-center">점수판</h3>
              <div className="grid grid-cols-2 gap-2">
                {Array.from(scores.entries()).map(([playerId, score]) => {
                  const player = multiplayer.players.get(playerId);
                  return (
                    <div
                      key={playerId}
                      className="bg-black/20 p-2 rounded-lg text-sm"
                    >
                      <span className="text-yellow-400">
                        {player?.nickname}
                      </span>
                      : <span className="text-white">{score}점</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {multiplayer.isHost && (
              <div className="text-center mt-6">
                <button
                  onClick={handleEndGame}
                  className="bg-red-500/50 text-white px-4 py-2 rounded-lg text-sm"
                >
                  게임 종료
                </button>
              </div>
            )}
          </main>
        </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔤</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            초성 게임 멀티플레이어
          </h1>
          <p className="text-white/70">친구들과 함께 초성 퀴즈를 풀어보세요!</p>
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

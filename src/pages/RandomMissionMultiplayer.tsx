import { useState, useEffect, useRef } from "react";
import { useMultiplayer, type GameMessage } from "../hooks/useMultiplayer";
import MultiplayerLobby from "../components/MultiplayerLobby";
import ChatBox from "../components/ChatBox";

// (Missions array is unchanged)
const missions = [
  { id: 1, text: "옆 사람과 하이파이브하기", difficulty: "easy", emoji: "🙌" },
  { id: 2, text: "30초 동안 한 발로 서있기", difficulty: "easy", emoji: "🦩" },
  { id: 3, text: "좋아하는 노래 1절 부르기", difficulty: "medium", emoji: "🎤" },
  { id: 4, text: "자기소개를 영어로 하기", difficulty: "medium", emoji: "🗣️" },
  { id: 5, text: "10초 안에 5명에게 칭찬하기", difficulty: "medium", emoji: "💝" },
  { id: 6, text: "최근 찍은 사진 보여주기", difficulty: "easy", emoji: "📸" },
  { id: 7, text: "내 폰의 마지막 검색 기록 공개하기", difficulty: "hard", emoji: "🔍" },
  { id: 8, text: "손뼉치기 10번 연속하기", difficulty: "easy", emoji: "👏" },
  { id: 9, text: "애교 부리기", difficulty: "hard", emoji: "😊" },
  { id: 10, text: "좋아하는 춤 동작 하나 보여주기", difficulty: "medium", emoji: "💃" },
];

interface RandomMissionMultiplayerProps {
  onBack: () => void;
}

interface GameState {
  currentMissionId: number | null;
  scores: [string, number][];
  usedMissionIds: number[];
  isGameOver: boolean;
}

export default function RandomMissionMultiplayer({
  onBack,
}: RandomMissionMultiplayerProps) {
  const multiplayer = useMultiplayer();
  const [gameStarted, setGameStarted] = useState(false);
  const [setupMode, setSetupMode] = useState<"none" | "create" | "join">(
    "none",
  );
  const [nickname, setNickname] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  const gameState = multiplayer.gameState as GameState | null;

  // Ref to hold the latest multiplayer state and methods to avoid stale closures
  const multiplayerRef = useRef(multiplayer);
  useEffect(() => {
    multiplayerRef.current = multiplayer;
  });

  useEffect(() => {
    if (multiplayer.gameState) {
      setGameStarted(true);
    }
  }, [multiplayer.gameState]);

  // Host-side logic
  useEffect(() => {
    if (!multiplayer.isHost) return;

    const handleMessage = (message: GameMessage) => {
      const { currentTurn, gameState, updateGameState, getNextPlayer } = multiplayerRef.current;

      if (message.from !== currentTurn) return;

      const currentGameState = gameState as GameState;
      if (!currentGameState) return;

      switch (message.type) {
        case "randommission-draw": {
          const availableMissions = missions.filter(
            (m) => !currentGameState.usedMissionIds.includes(m.id),
          );
          if (availableMissions.length === 0) {
            updateGameState({ ...currentGameState, isGameOver: true });
            return;
          }
          const randomMission = availableMissions[Math.floor(Math.random() * availableMissions.length)];
          updateGameState({
            ...currentGameState,
            currentMissionId: randomMission.id,
            usedMissionIds: [...currentGameState.usedMissionIds, randomMission.id],
          });
          break;
        }
        case "randommission-complete": {
          const scores = new Map(currentGameState.scores);
          scores.set(message.from, (scores.get(message.from) || 0) + 1);
          updateGameState({
            ...currentGameState,
            scores: Array.from(scores.entries()),
            currentMissionId: null,
          });
          multiplayerRef.current.changeTurn(getNextPlayer());
          break;
        }
        case "randommission-pass": {
          updateGameState({ ...currentGameState, currentMissionId: null });
          multiplayerRef.current.changeTurn(getNextPlayer());
          break;
        }
      }
    };

    return multiplayer.onMessage(handleMessage);
  }, [multiplayer.isHost, multiplayer.onMessage]);

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
      currentMissionId: null,
      scores: playerIds.map((id) => [id, 0]),
      usedMissionIds: [],
      isGameOver: false,
    };
    multiplayer.startGame(initialState);
    multiplayer.changeTurn(playerIds[0]);
    setGameStarted(true);
  };

  const sendPlayerAction = (type: "randommission-draw" | "randommission-complete" | "randommission-pass") => {
      if (!multiplayer.isMyTurn()) return;
      multiplayer.sendMessage({ type, data: {}, from: multiplayer.localPlayer!.id, timestamp: Date.now() });
  }

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
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
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
                        className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                        onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
                    />
                    <button
                        onClick={handleCreateRoom}
                        disabled={multiplayer.isConnecting || !nickname.trim()}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
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
                        className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <input
                        type="text"
                        value={roomIdInput}
                        onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                        placeholder="방 코드 (예: ABC123)"
                        maxLength={6}
                        className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono text-center text-xl"
                        onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
                    />
                    <button
                        onClick={handleJoinRoom}
                        disabled={multiplayer.isConnecting || !nickname.trim() || !roomIdInput.trim()}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
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
    const currentMission = missions.find(m => m.id === gameState.currentMissionId);
    const currentTurnPlayer = multiplayer.players.get(multiplayer.currentTurn || "");

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white p-4">
            <header className="flex items-center justify-between mb-4">
                <button onClick={handleLeave} className="text-white/80 hover:text-white">← 나가기</button>
                <h1 className="text-2xl font-bold">랜덤 미션</h1>
                <div></div>
            </header>

            <main className="max-w-2xl mx-auto text-center">
                <div className="mb-6 bg-black/20 p-3 rounded-xl">
                    <p className="text-xl">{currentTurnPlayer?.nickname}님의 차례</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl min-h-[300px] flex flex-col justify-center items-center">
                    {currentMission ? (
                        <div className="animate-slide-up space-y-4">
                            <div className="text-7xl">{currentMission.emoji}</div>
                            <p className="text-2xl font-semibold">{currentMission.text}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-7xl">🎲</div>
                            <p className="text-xl">{multiplayer.isMyTurn() ? "미션을 뽑아주세요" : "미션을 기다리는 중..."}</p>
                        </div>
                    )}
                </div>

                {multiplayer.isMyTurn() && (
                    <div className="mt-6">
                        {currentMission ? (
                            <div className="flex gap-4">
                                <button onClick={() => sendPlayerAction("randommission-pass")} className="flex-1 bg-white/20 p-4 rounded-xl">넘기기</button>
                                <button onClick={() => sendPlayerAction("randommission-complete")} className="flex-1 bg-green-500 p-4 rounded-xl font-bold">성공!</button>
                            </div>
                        ) : (
                            <button onClick={() => sendPlayerAction("randommission-draw")} className="w-full bg-purple-500 p-4 rounded-xl font-bold">미션 뽑기</button>
                        )}
                    </div>
                )}

                 <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4">
                    <h3 className="text-white font-bold mb-2 text-center">점수판</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {Array.from(new Map(gameState.scores).entries()).map(([playerId, score]) => {
                        const player = multiplayer.players.get(playerId);
                        return (
                            <div key={playerId} className="bg-black/20 p-2 rounded-lg text-sm">
                            <span className="text-yellow-400">{player?.nickname}</span>: <span className="text-white">{score}점</span>
                            </div>
                        )
                        })}
                    </div>
                </div>

                {multiplayer.isHost && (
                <div className="text-center mt-6">
                    <button onClick={handleEndGame} className="bg-red-500/50 text-white px-4 py-2 rounded-lg text-sm">게임 종료</button>
                </div>
                )}
            </main>

             <ChatBox
                messages={multiplayer.chatMessages}
                onSendMessage={multiplayer.sendChatMessage}
                onSendEmoji={multiplayer.sendEmoji}
                isMinimized={isChatMinimized}
                onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
            />
        </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
            <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎲</div>
                <h1 className="text-3xl font-bold text-white mb-2">랜덤 미션 멀티플레이어</h1>
                <p className="text-white/70">친구들과 함께 미션을 수행하세요!</p>
            </div>
            <div className="space-y-4">
                <button onClick={() => setSetupMode("create")} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg">🎮 방 만들기</button>
                <button onClick={() => setSetupMode("join")} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-bold text-lg">🚪 방 참가하기</button>
                <button onClick={onBack} className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold">돌아가기</button>
            </div>
        </div>
    </div>
  )
}

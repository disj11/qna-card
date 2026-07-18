import { useState } from "react";
import { useMultiplayer } from "./hooks/useMultiplayer";
import MultiplayerLobby from "./MultiplayerLobby";
import ChatBox from "./ChatBox";
import Button from "../../components/Button";
import GlassPanel from "../../components/GlassPanel";
import PageShell from "../../components/PageShell";
import SetupForm from "../../components/SetupForm";
import StickyPageHeader from "../../components/StickyPageHeader";
import QuestionFlipCard from "../question-deck/QuestionFlipCard";
import {
  buildInitialState,
  computeNextState,
  type GameState,
} from "./gameState";
import { questionsByLevel, levelGateThreshold } from "../../data/questionCards";
import { levelMeta } from "../../design-system/tokens";
import type { QuestionLevel } from "../../types";

interface MultiplayerPageProps {
  onBack: () => void;
}

const levels: QuestionLevel[] = [1, 2, 3];
/** .qcard-face의 opacity/transform 트랜지션 시간(index.css)과 반드시 맞춰야 함 */
const CARD_TRANSITION_MS = 350;

export default function MultiplayerPage({ onBack }: MultiplayerPageProps) {
  const multiplayer = useMultiplayer();
  const [setupMode, setSetupMode] = useState<"none" | "create" | "join">(
    "none"
  );
  const [nickname, setNickname] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const gameState = multiplayer.gameState as GameState | null;

  const [gameStarted, setGameStarted] = useState(false);
  const [prevGameState, setPrevGameState] = useState(multiplayer.gameState);
  if (multiplayer.gameState !== prevGameState) {
    setPrevGameState(multiplayer.gameState);
    if (multiplayer.gameState && !gameStarted) {
      setGameStarted(true);
    }
  }

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
    multiplayer.startGame(buildInitialState() as unknown);
    setGameStarted(true);
  };

  const handleReveal = () => {
    if (
      !multiplayer.isMyTurn() ||
      !gameState ||
      gameState.isRevealed ||
      isTransitioning
    )
      return;
    multiplayer.updateGameState({ ...gameState, isRevealed: true });
  };

  const advance = (mark: boolean) => {
    if (!multiplayer.isMyTurn() || !gameState || isTransitioning) return;
    const currentId = gameState.queueIds[0];
    if (currentId === undefined) return;

    setIsTransitioning(true);
    // 뒷면이 완전히 가려질 때까지(qcard-face 트랜지션 종료) 먼저 앞면으로 되돌린 뒤,
    // 그 다음에 실제 카드 데이터를 바꿔서 양쪽 화면 모두 페이드 도중 다음 질문이 비치지 않게 한다.
    multiplayer.updateGameState({
      ...gameState,
      isRevealed: false,
      pickResult: null,
    });

    window.setTimeout(() => {
      const newState = computeNextState(gameState, mark, currentId);
      multiplayer.updateGameState(newState);
      multiplayer.changeTurn(multiplayer.getNextPlayer());
      setIsTransitioning(false);
    }, CARD_TRANSITION_MS);
  };

  const handlePickFirst = () => {
    if (!multiplayer.isMyTurn() || !gameState) return;
    const players = Array.from(multiplayer.players.values());
    if (players.length === 0) return;
    const picked = players[Math.floor(Math.random() * players.length)];
    multiplayer.updateGameState({ ...gameState, pickResult: picked.nickname });
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
            <div className="text-6xl mb-4">🌐</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              원거리 함께하기
            </h1>
            <p className="text-white/70">
              서로 다른 폰으로 방을 만들어 같은 질문을 나눠보세요
            </p>
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

  if (!gameState) {
    return null;
  }

  const currentTurnPlayer = Array.from(multiplayer.players.values()).find(
    (p) => p.id === multiplayer.currentTurn
  );
  const totalAnswered = levels.reduce(
    (sum, l) => sum + gameState.visited[l].length,
    0
  );
  const currentId = gameState.queueIds[0];
  const currentQuestion = currentId
    ? questionsByLevel[gameState.level].find((q) => q.id === currentId)
    : undefined;

  // Finished screen
  if (gameState.finished) {
    return (
      <PageShell centered>
        <GlassPanel size="lg" className="max-w-lg w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-2 break-keep">
            오늘 {totalAnswered}개의 질문을 나눴어요
          </h1>
          <p className="text-white/70 mb-6">
            진심편까지 모두 나눴네요. 다음 만남도 기대돼요!
          </p>
          <Button onClick={handleLeave} size="lg" fullWidth>
            나가기
          </Button>
        </GlassPanel>
      </PageShell>
    );
  }

  // Game screen
  return (
    <PageShell>
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

      <StickyPageHeader
        title="💝 질문카드 (원거리 함께하기)"
        onBack={handleLeave}
        backLabel="나가기"
        topRight={
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">방:</span>
            <span className="text-[#D9695A] font-mono font-bold">
              {multiplayer.roomId}
            </span>
          </div>
        }
      >
        {/* Current Turn Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div
            className={`px-4 py-2 rounded-full border ${
              multiplayer.isMyTurn()
                ? "bg-green-500/15 border-green-400/40"
                : "bg-white/[0.04] border-white/10"
            }`}
          >
            <span className="text-white font-semibold">
              {multiplayer.isMyTurn()
                ? "🎯 내가 카드를 넘길 차례!"
                : `${currentTurnPlayer?.nickname || ""}님이 카드를 넘길 차례`}
            </span>
          </div>
        </div>
      </StickyPageHeader>

      <div className="container mx-auto px-4 py-4 max-w-2xl">
        {/* Level tabs (read-only indicator) */}
        <div className="flex justify-center gap-2 my-4">
          {levels.map((l) => (
            <div
              key={l}
              className={`px-4 py-2 rounded-2xl font-bold text-sm border ${
                l === gameState.level
                  ? "bg-white/10 text-white"
                  : "bg-white/[0.04] text-white/40 border-white/10"
              }`}
              style={
                l === gameState.level
                  ? { borderColor: levelMeta[l].color }
                  : undefined
              }
            >
              {levelMeta[l].emoji} {levelMeta[l].label}
            </div>
          ))}
        </div>

        <p className="text-center text-white/60 text-sm mb-4">
          Level {gameState.level} · {gameState.visited[gameState.level].length}/
          {levelGateThreshold[gameState.level]} · 총 {totalAnswered}개 진행
        </p>

        {currentQuestion ? (
          <>
            {gameState.pickResult && (
              <div className="text-center mb-4 animate-slide-up">
                <span className="inline-block bg-[#CBB794] text-[#211A17] font-bold px-4 py-2 rounded-full shadow-lg">
                  🎲 이번엔 {gameState.pickResult}님 먼저!
                </span>
              </div>
            )}

            <QuestionFlipCard
              question={currentQuestion}
              level={gameState.level}
              revealed={gameState.isRevealed}
              onReveal={handleReveal}
              hint="눌러서 확인하기"
              className="mx-auto max-w-md"
            />

            <div className="flex justify-center gap-3 mt-6">
              <Button
                onClick={handlePickFirst}
                variant="secondary"
                disabled={!multiplayer.isMyTurn() || isTransitioning}
              >
                🎲 먼저 답할 사람
              </Button>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <Button
                onClick={() => advance(false)}
                variant="ghost"
                size="lg"
                disabled={!multiplayer.isMyTurn() || isTransitioning}
              >
                패스
              </Button>
              <Button
                onClick={() => advance(true)}
                size="lg"
                disabled={
                  !multiplayer.isMyTurn() ||
                  !gameState.isRevealed ||
                  isTransitioning
                }
                disabledReason={
                  !multiplayer.isMyTurn()
                    ? undefined
                    : "카드를 눌러 질문을 먼저 확인해주세요"
                }
              >
                다음 카드 →
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-white/60">
            이 레벨의 질문을 모두 살펴봤어요.
          </p>
        )}
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
                  ? "text-[#D9695A] font-bold"
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

      {/* Chat Box */}
      <ChatBox
        messages={multiplayer.chatMessages}
        onSendMessage={multiplayer.sendChatMessage}
        onSendEmoji={multiplayer.sendEmoji}
        isMinimized={isChatMinimized}
        onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
      />
    </PageShell>
  );
}

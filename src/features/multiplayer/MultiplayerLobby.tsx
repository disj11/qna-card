import { useState } from "react";
import type { Player } from "./lib/P2PConnection";
import Button from "../../components/Button";
import GlassPanel from "../../components/GlassPanel";
import PageShell from "../../components/PageShell";
import StatusBadge from "../../components/StatusBadge";

interface MultiplayerLobbyProps {
  isHost: boolean;
  roomId: string;
  players: Map<string, Player>;
  localPlayer: Player | null;
  onReady: (isReady: boolean) => void;
  onStartGame: () => void;
  onBack: () => void;
  allPlayersReady: boolean;
}

export default function MultiplayerLobby({
  isHost,
  roomId,
  players,
  localPlayer,
  onReady,
  onStartGame,
  onBack,
  allPlayersReady,
}: MultiplayerLobbyProps) {
  const [copied, setCopied] = useState(false);
  const playerList = Array.from(players.values());

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canStartGame = isHost && allPlayersReady && playerList.length >= 2;
  const startDisabledReason =
    playerList.length < 2
      ? "최소 2명 이상의 참가자가 필요합니다"
      : "모든 참가자가 준비될 때까지 기다려주세요";

  return (
    <PageShell centered>
      <GlassPanel size="lg" className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            멀티플레이어 대기실
          </h1>
          <p className="text-white/70">
            {isHost
              ? "친구들이 입장할 때까지 기다려주세요"
              : "게임 시작을 기다리는 중..."}
          </p>
        </div>

        {/* Room Code */}
        <GlassPanel variant="subtle" className="mb-6">
          <div className="text-center mb-3">
            <p className="text-white/70 text-sm mb-2">방 코드</p>
            <div className="flex items-center justify-center gap-3">
              <div className="bg-black/30 px-6 py-3 rounded-xl">
                <span className="text-3xl font-mono font-bold text-[#D9695A] tracking-wider">
                  {roomId}
                </span>
              </div>
              <button
                onClick={handleCopyRoomId}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                title="복사"
                aria-label="방 코드 복사"
              >
                {copied ? (
                  <span className="text-green-400 text-xl">✓</span>
                ) : (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-green-400 text-sm mt-2 animate-fade-in">
                복사되었습니다!
              </p>
            )}
          </div>
          <p className="text-white/60 text-xs text-center">
            친구에게 이 코드를 공유하세요
          </p>
        </GlassPanel>

        {/* Player List */}
        <GlassPanel variant="subtle" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              참가자 ({playerList.length})
            </h2>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {playerList.map((player) => (
              <div
                key={player.id}
                className="bg-white/10 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {/* Status indicator */}
                  <div
                    className={`w-3 h-3 rounded-full ${
                      player.status === "online"
                        ? "bg-green-400 animate-pulse"
                        : "bg-gray-400"
                    }`}
                  ></div>

                  {/* Player info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">
                        {player.nickname}
                      </span>
                      {player.id === localPlayer?.id && (
                        <StatusBadge tone="info">나</StatusBadge>
                      )}
                      {player.isHost && (
                        <StatusBadge tone="warning">호스트</StatusBadge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ready status */}
                <div>
                  {player.isReady ? (
                    <span className="text-green-300 font-semibold flex items-center gap-1">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      준비완료
                    </span>
                  ) : (
                    <span className="text-white/50 text-sm">대기중...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Ready Button (for non-host) */}
        {!isHost && localPlayer && (
          <Button
            onClick={() => onReady(!localPlayer.isReady)}
            variant={localPlayer.isReady ? "secondary" : "primary"}
            size="lg"
            fullWidth
            isSelected={localPlayer.isReady}
            className="mb-4"
          >
            {localPlayer.isReady ? "준비 취소" : "준비 완료"}
          </Button>
        )}

        {/* Start Game Button (for host) */}
        {isHost && (
          <div className="mb-4">
            <Button
              id="start-game"
              onClick={onStartGame}
              disabled={!canStartGame}
              size="lg"
              fullWidth
              disabledReason={!canStartGame ? startDisabledReason : undefined}
            >
              게임 시작
            </Button>
          </div>
        )}

        {/* Back Button */}
        <Button onClick={onBack} variant="secondary" fullWidth>
          나가기
        </Button>

        {/* Tips */}
        <div className="mt-6 bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
          <p className="text-blue-200 text-sm">
            <strong>팁:</strong> 친구들과 함께 게임을 즐기세요! 방 코드를
            공유하면 누구나 입장할 수 있습니다.
          </p>
        </div>
      </GlassPanel>
    </PageShell>
  );
}

import { useState } from "react";
import type { Player } from "../multiplayer/P2PConnection";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
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
        <div className="bg-white/10 rounded-2xl p-6 mb-6">
          <div className="text-center mb-3">
            <p className="text-white/70 text-sm mb-2">방 코드</p>
            <div className="flex items-center justify-center gap-3">
              <div className="bg-black/30 px-6 py-3 rounded-xl">
                <span className="text-3xl font-mono font-bold text-yellow-400 tracking-wider">
                  {roomId}
                </span>
              </div>
              <button
                onClick={handleCopyRoomId}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all transform hover:scale-105 active:scale-95"
                title="복사"
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
        </div>

        {/* Player List */}
        <div className="bg-white/10 rounded-2xl p-6 mb-6">
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
                        <span className="text-xs bg-blue-500/50 px-2 py-0.5 rounded-full text-white">
                          나
                        </span>
                      )}
                      {player.isHost && (
                        <span className="text-xs bg-yellow-500/50 px-2 py-0.5 rounded-full text-white">
                          👑 호스트
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ready status */}
                <div>
                  {player.isReady ? (
                    <span className="text-green-400 font-semibold flex items-center gap-1">
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
        </div>

        {/* Ready Button (for non-host) */}
        {!isHost && localPlayer && (
          <button
            onClick={() => onReady(!localPlayer.isReady)}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 mb-4 ${
              localPlayer.isReady
                ? "bg-gray-500/50 text-white/70"
                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg"
            }`}
          >
            {localPlayer.isReady ? "준비 취소" : "준비 완료"}
          </button>
        )}

        {/* Start Game Button (for host) */}
        {isHost && (
          <div className="mb-4">
            <button
              onClick={onStartGame}
              disabled={!canStartGame}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 ${
                canStartGame
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg"
                  : "bg-gray-500/30 text-white/40 cursor-not-allowed"
              }`}
            >
              {canStartGame
                ? "🎮 게임 시작"
                : "모든 참가자가 준비될 때까지 기다려주세요"}
            </button>
            {playerList.length < 2 && (
              <p className="text-yellow-400 text-sm text-center mt-2">
                ⚠️ 최소 2명 이상의 참가자가 필요합니다
              </p>
            )}
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all"
        >
          나가기
        </button>

        {/* Tips */}
        <div className="mt-6 bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
          <p className="text-blue-200 text-sm">
            💡 <strong>팁:</strong> 친구들과 함께 게임을 즐기세요! 방 코드를
            공유하면 누구나 입장할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

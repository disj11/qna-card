import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface GameModeSelectorProps {
  gameTitle: string;
  gameEmoji: string;
  gameDescription: string;
  gradient: string;
}

export default function GameModeSelector({
  gameTitle,
  gameEmoji,
  gameDescription,
}: GameModeSelectorProps) {
  const [hoveredMode, setHoveredMode] = useState<"single" | "multi" | null>(
    null,
  );
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  const handleSelectMode = (mode: "single" | "multi") => {
    navigate(`/game/${gameId}/${mode}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors group"
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
            <span className="font-medium">메뉴로 돌아가기</span>
          </button>

          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="text-7xl sm:text-8xl mb-6">{gameEmoji}</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {gameTitle}
            </h1>
            <p className="text-white/80 text-lg sm:text-xl">
              {gameDescription}
            </p>
          </div>

          {/* Mode Selection */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-3">
              게임 모드를 선택하세요
            </h2>
            <p className="text-white/60">
              혼자 즐기거나 친구들과 함께 플레이하세요
            </p>
          </div>

          {/* Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Single Player Mode */}
            <button
              onClick={() => handleSelectMode("single")}
              onMouseEnter={() => setHoveredMode("single")}
              onMouseLeave={() => setHoveredMode(null)}
              className="group relative animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div
                className={`relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-2 transition-all duration-300 transform ${hoveredMode === "single"
                    ? "scale-105 border-white/40 bg-white/20"
                    : "border-white/20 hover:border-white/30"
                  } active:scale-95`}
              >
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-6xl sm:text-7xl mb-4">🎯</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    혼자 플레이
                  </h3>
                  <p className="text-white/70 text-base sm:text-lg mb-6">
                    나만의 속도로 편안하게 즐기세요
                  </p>

                  {/* Features */}
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-white/80">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>자유로운 진행 속도</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>언제든지 멈추고 재개 가능</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>모든 콘텐츠 이용 가능</span>
                    </div>
                  </div>

                  {/* Play button */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-white font-semibold">
                    <span>시작하기</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-bl-full rounded-tr-3xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-cyan-400/10 rounded-tr-full rounded-bl-3xl"></div>
              </div>
            </button>

            {/* Multiplayer Mode */}
            <button
              onClick={() => handleSelectMode("multi")}
              onMouseEnter={() => setHoveredMode("multi")}
              onMouseLeave={() => setHoveredMode(null)}
              className="group relative animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div
                className={`relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-2 transition-all duration-300 transform ${hoveredMode === "multi"
                    ? "scale-105 border-white/40 bg-white/20"
                    : "border-white/20 hover:border-white/30"
                  } active:scale-95`}
              >
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}
                ></div>

                {/* New badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                  NEW!
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-6xl sm:text-7xl mb-4">👥</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    친구와 함께
                  </h3>
                  <p className="text-white/70 text-base sm:text-lg mb-6">
                    실시간으로 친구들과 함께 즐기세요
                  </p>

                  {/* Features */}
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-white/80">
                      <svg
                        className="w-5 h-5 text-pink-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>실시간 P2P 연결</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <svg
                        className="w-5 h-5 text-pink-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>실시간 채팅 & 이모지</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <svg
                        className="w-5 h-5 text-pink-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>최대 10명까지 참여 가능</span>
                    </div>
                  </div>

                  {/* Play button */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-white font-semibold">
                    <span>시작하기</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-pink-400/10 rounded-bl-full rounded-tr-3xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-400/10 rounded-tr-full rounded-bl-3xl"></div>
              </div>
            </button>
          </div>

          {/* Info Box */}
          <div
            className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="text-white font-semibold mb-2">
                  멀티플레이어 모드 안내
                </h4>
                <p className="text-blue-200 text-sm leading-relaxed">
                  친구와 함께 플레이하려면 한 명이 <strong>방을 만들고</strong>,
                  다른 친구들은 <strong>방 코드</strong>를 입력하여 참가하세요.
                  서버 없이 브라우저끼리 직접 연결되는 P2P 방식으로 안전하게
                  즐길 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

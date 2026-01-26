import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface GameOption {
  id: string;
  title: string;
  emoji: string;
  description: string;
  gradient: string;
  textColor: string;
}

const games: GameOption[] = [
  {
    id: "question-cards",
    title: "질문카드",
    emoji: "💝",
    description: "서로를 알아가는 질문 게임",
    gradient: "from-purple-500 to-pink-500",
    textColor: "text-purple-100",
  },
  {
    id: "truth-or-dare",
    title: "진실 혹은 거짓",
    emoji: "🎭",
    description: "진실을 맞추는 추리 게임",
    gradient: "from-blue-500 to-cyan-500",
    textColor: "text-blue-100",
  },
  {
    id: "random-mission",
    title: "랜덤 미션",
    emoji: "🎲",
    description: "재미있는 랜덤 미션 수행",
    gradient: "from-green-500 to-emerald-500",
    textColor: "text-green-100",
  },
  {
    id: "balance-game",
    title: "밸런스 게임",
    emoji: "⚖️",
    description: "둘 중 하나를 선택하세요",
    gradient: "from-orange-500 to-red-500",
    textColor: "text-orange-100",
  },
  {
    id: "word-chain",
    title: "초성 게임",
    emoji: "🔤",
    description: "초성으로 단어 맞추기",
    gradient: "from-indigo-500 to-purple-500",
    textColor: "text-indigo-100",
  },
];

export default function Menu() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGameSelect = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 drop-shadow-lg mb-4 animate-slide-up">
            🎉 아이스브레이킹 게임
          </h1>
          <p
            className="text-white/80 text-lg sm:text-xl animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            원하는 게임을 선택해주세요
          </p>
        </header>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <button
              key={game.id}
              onClick={() => handleGameSelect(game.id)}
              onMouseEnter={() => setHoveredCard(game.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`relative bg-gradient-to-br ${game.gradient} rounded-2xl p-8 shadow-2xl transition-all duration-300 transform ${hoveredCard === game.id
                    ? "scale-105 shadow-3xl"
                    : "hover:scale-102"
                  } active:scale-95`}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="text-6xl sm:text-7xl transform group-hover:scale-110 transition-transform duration-300">
                    {game.emoji}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {game.title}
                  </h2>
                  <p className={`${game.textColor} text-sm sm:text-base`}>
                    {game.description}
                  </p>

                  {/* Play button indicator */}
                  <div className="mt-4 flex items-center justify-center space-x-2 text-white/90 text-sm font-medium">
                    <span>시작하기</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-tr-full rounded-bl-2xl"></div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <footer
          className="text-center mt-12 animate-slide-up"
          style={{ animationDelay: "0.5s" }}
        >
          <p className="text-white/60 text-sm">Made by [disj11] with ❤️</p>
        </footer>
      </div>
    </div>
  );
}

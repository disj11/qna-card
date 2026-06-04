import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "../components/common/GameCard";
import PageShell from "../components/common/PageShell";
import { games } from "../data/games";
import type { GameId } from "../types";

export default function Menu() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGameSelect = (gameId: GameId) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8">
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
            <GameCard
              key={game.id}
              onClick={() => handleGameSelect(game.id)}
              onMouseEnter={() => setHoveredCard(game.id)}
              onMouseLeave={() => setHoveredCard(null)}
              aria-label={`${game.title} 선택`}
              icon={game.emoji}
              title={game.title}
              description={game.description}
              gradient={game.gradient}
              isSelected={hoveredCard === game.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              meta={
                <div className="mt-4 flex items-center justify-center space-x-2 text-white/90 text-sm font-medium">
                  <span>시작하기</span>
                  <span aria-hidden="true">→</span>
                </div>
              }
            />
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
    </PageShell>
  );
}

import { useState } from "react";
import { dailyQuestions, loveQuestions } from "../data/questionCards";
import type { Question } from "../types";

interface CardProps {
  question: Question;
  isFlipped: boolean;
  onFlip: (id: number) => void;
  adminMode: boolean;
  cardType: "daily" | "love";
}

const Card = ({
  question,
  isFlipped,
  onFlip,
  adminMode,
  cardType,
}: CardProps) => {
  const shouldShowBack = adminMode || isFlipped;
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFlip(question.id);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);

    // Only trigger flip if touch movement is minimal (not a scroll)
    if (deltaX < 10 && deltaY < 10) {
      e.preventDefault();
      e.stopPropagation();
      onFlip(question.id);
    }

    setTouchStart(null);
  };

  return (
    <div
      className={`card-container h-48 sm:h-52 md:h-56 ${shouldShowBack ? "flipped" : ""}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFlip(question.id);
        }
      }}
    >
      <div className="card-inner shadow-2xl">
        {/* Card Front */}
        <div
          className={`card-face ${cardType === "daily" ? "card-front-daily" : "card-front-love"}`}
        >
          <div className="question-mark">?</div>
          <div className="card-number-badge">
            <span>#{question.id}</span>
          </div>
        </div>

        {/* Card Back */}
        <div
          className={`card-face ${cardType === "daily" ? "card-back-daily" : "card-back-love"}`}
        >
          <div className="card-question-text">{question.text}</div>
          <div className="card-number-badge">
            <span>#{question.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuestionCardsProps {
  onBack: () => void;
}

export default function QuestionCards({ onBack }: QuestionCardsProps) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [adminMode, setAdminMode] = useState(false);

  const handleCardFlip = (id: number) => {
    if (adminMode) return; // 관리자 모드에서는 개별 카드 플립 비활성화

    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleAdminMode = () => {
    setAdminMode((prev) => !prev);
    // 관리자 모드를 끌 때는 플립된 카드 상태를 유지함
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={onBack}
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
                <span className="font-medium">메뉴로 돌아가기</span>
              </button>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 drop-shadow-lg">
                💝 질문카드
              </h1>

              {/* Show All Toggle */}
              <div className="flex items-center justify-center space-x-2">
                <span className="text-white/80 text-sm font-medium">
                  모든 질문 보기
                </span>
                <button
                  onClick={toggleAdminMode}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    adminMode ? "bg-purple-500" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-lg ${
                      adminMode ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-4 relative z-20">
          {/* Daily Questions Section */}
          <section className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                🌱 일상편
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dailyQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Card
                    question={question}
                    isFlipped={flippedCards.has(question.id)}
                    onFlip={handleCardFlip}
                    adminMode={adminMode}
                    cardType="daily"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Love Questions Section */}
          <section>
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                💕 연애편
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-pink-400 to-red-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loveQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${(index + 30) * 0.05}s` }}
                >
                  <Card
                    question={question}
                    isFlipped={flippedCards.has(question.id)}
                    onFlip={handleCardFlip}
                    adminMode={adminMode}
                    cardType="love"
                  />
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-white/60 text-sm">Made by [disj11] with ❤️</p>
        </footer>
      </div>
    </div>
  );
}

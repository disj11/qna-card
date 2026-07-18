import { useState } from "react";
import {
  level1Questions,
  level2Questions,
  level3Questions,
} from "../data/questionCards";
import { levelMeta } from "../design-system/tokens";
import PageShell from "../components/common/PageShell";
import type { Question, QuestionLevel } from "../types";

interface CardProps {
  question: Question;
  isFlipped: boolean;
  onFlip: (id: number) => void;
  adminMode: boolean;
  level: QuestionLevel;
}

const Card = ({ question, isFlipped, onFlip, adminMode, level }: CardProps) => {
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
      className={`qcard h-64 sm:h-72 ${shouldShowBack ? "revealed" : ""}`}
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
      <div
        className="qcard-face qcard-face--front"
        style={{ borderTop: `4px solid ${levelMeta[level].color}` }}
      >
        <div className="question-mark">?</div>
      </div>

      <div
        className="qcard-face qcard-face--back"
        style={{ borderTop: `4px solid ${levelMeta[level].color}` }}
      >
        <div className="card-question-text text-sm sm:text-base">
          {question.text}
        </div>
        {question.followUp && (
          <p className="mt-2 text-center text-xs sm:text-sm text-[#211A17]/60 italic">
            💬 {question.followUp}
          </p>
        )}
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
    <PageShell tone="question">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#2B222D]/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors group"
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              💝 혼자 미리보기
            </h1>
            <p className="text-white/50 text-sm">
              애프터 전, 어떤 질문이 나올지 미리 훑어보세요
            </p>

            {/* Show All Toggle */}
            <div className="flex items-center justify-center space-x-2">
              <span className="text-white/70 text-sm font-medium">
                모든 질문 보기
              </span>
              <button
                onClick={toggleAdminMode}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#D9695A]/60 focus:ring-offset-2 focus:ring-offset-[#2B222D] ${
                  adminMode ? "bg-[#D9695A]" : "bg-white/20"
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
      <main className="container mx-auto px-4 py-4">
        {(
          [
            [1, level1Questions] as const,
            [2, level2Questions] as const,
            [3, level3Questions] as const,
          ]
        ).map(([level, questions], sectionIndex) => (
          <section key={level} className={sectionIndex < 2 ? "mb-8" : undefined}>
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {levelMeta[level].emoji} Level {level} · {levelMeta[level].label}
              </h2>
              <div
                className="w-16 h-0.5 mx-auto rounded-full"
                style={{ backgroundColor: levelMeta[level].color }}
              ></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="animate-slide-up"
                  style={{
                    animationDelay: `${(index + sectionIndex * questions.length) * 0.05}s`,
                  }}
                >
                  <Card
                    question={question}
                    isFlipped={flippedCards.has(question.id)}
                    onFlip={handleCardFlip}
                    adminMode={adminMode}
                    level={level}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="text-center py-4">
        <p className="text-white/40 text-sm">Made by [disj11] with ❤️</p>
      </footer>
    </PageShell>
  );
}

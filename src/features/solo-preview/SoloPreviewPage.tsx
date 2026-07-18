import { useState } from "react";
import QuestionFlipCard from "../question-deck/QuestionFlipCard";
import {
  level1Questions,
  level2Questions,
  level3Questions,
} from "../../data/questionCards";
import { levelMeta } from "../../design-system/tokens";
import PageShell from "../../components/PageShell";
import StickyPageHeader from "../../components/StickyPageHeader";
import type { QuestionLevel } from "../../types";

interface SoloPreviewPageProps {
  onBack: () => void;
}

export default function SoloPreviewPage({ onBack }: SoloPreviewPageProps) {
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
    <PageShell>
      <StickyPageHeader
        title="💝 혼자 미리보기"
        onBack={onBack}
        backLabel="메뉴로 돌아가기"
      >
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
      </StickyPageHeader>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        {[
          [1, level1Questions] as const,
          [2, level2Questions] as const,
          [3, level3Questions] as const,
        ].map(([level, questions], sectionIndex) => (
          <section
            key={level}
            className={sectionIndex < 2 ? "mb-8" : undefined}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {levelMeta[level].emoji} Level {level} ·{" "}
                {levelMeta[level].label}
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
                  <QuestionFlipCard
                    question={question}
                    level={level as QuestionLevel}
                    revealed={adminMode || flippedCards.has(question.id)}
                    onReveal={() => handleCardFlip(question.id)}
                    size="compact"
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

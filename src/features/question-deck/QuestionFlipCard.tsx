import { useState, type KeyboardEvent, type MouseEvent, type TouchEvent } from "react";
import { levelMeta } from "../../design-system/tokens";
import type { Question, QuestionLevel } from "../../types";

interface QuestionFlipCardProps {
  question: Question;
  level: QuestionLevel;
  revealed: boolean;
  /**
   * 카드를 탭/클릭/키보드로 조작했을 때 호출됨. 이미 뒤집힌 카드를 다시
   * 뒤집을지, 턴/전환 중에는 무시할지 등의 판단은 호출부(onReveal 구현)에서 담당함.
   */
  onReveal: () => void;
  /** 앞면에 표시할 안내 문구 (예: "눌러서 확인하기") */
  hint?: string;
  /** featured: 단일 중앙 카드(기본), compact: 그리드에 여러 장 배치되는 카드 */
  size?: "featured" | "compact";
  className?: string;
}

export default function QuestionFlipCard({
  question,
  level,
  revealed,
  onReveal,
  hint,
  size = "featured",
  className = "",
}: QuestionFlipCardProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReveal();
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);

    // 스크롤이 아니라 탭일 때만 반응
    if (deltaX < 10 && deltaY < 10) {
      e.preventDefault();
      e.stopPropagation();
      onReveal();
    }

    setTouchStart(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onReveal();
    }
  };

  const questionTextClass =
    size === "featured" ? "text-lg sm:text-xl" : "text-sm sm:text-base";
  const followUpClass =
    size === "featured"
      ? "mt-3 text-center text-sm text-[#211A17]/60 italic"
      : "mt-2 text-center text-xs sm:text-sm text-[#211A17]/60 italic";

  return (
    <div
      className={`qcard h-64 sm:h-72 ${revealed ? "revealed" : ""} ${className}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className="qcard-face qcard-face--front"
        style={{ borderTop: `4px solid ${levelMeta[level].color}` }}
      >
        <div className="question-mark">?</div>
        {hint && <p className="text-sm text-[#211A17]/50">{hint}</p>}
      </div>
      <div
        className="qcard-face qcard-face--back"
        style={{ borderTop: `4px solid ${levelMeta[level].color}` }}
      >
        <div className={`card-question-text ${questionTextClass}`}>
          {question.text}
        </div>
        {question.followUp && (
          <p className={followUpClass}>💬 {question.followUp}</p>
        )}
      </div>
    </div>
  );
}

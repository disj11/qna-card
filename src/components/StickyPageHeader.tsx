import type { ReactNode } from "react";

interface StickyPageHeaderProps {
  title: string;
  onBack: () => void;
  backLabel: string;
  /** 뒤로가기 버튼과 같은 줄, 오른쪽에 표시할 내용 (예: 방 코드) */
  topRight?: ReactNode;
  /** 타이틀 아래에 표시할 내용 (부제, 토글, 턴 표시줄 등) */
  children?: ReactNode;
}

export default function StickyPageHeader({
  title,
  onBack,
  backLabel,
  topRight,
  children,
}: StickyPageHeaderProps) {
  return (
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
            <span className="font-medium">{backLabel}</span>
          </button>
          {topRight}
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
          {children}
        </div>
      </div>
    </header>
  );
}

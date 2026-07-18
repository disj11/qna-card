import type { ButtonHTMLAttributes, ReactNode } from "react";
import { focusRing, motion, radius } from "../design-system/tokens";

interface GameCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  title: string;
  description: string;
  /** 아이콘 배지와 좌측 포인트 라인에 쓰이는 은은한 포인트 컬러 */
  accent?: string;
  meta?: ReactNode;
  isSelected?: boolean;
}

export default function GameCard({
  icon,
  title,
  description,
  accent = "#D9695A",
  meta,
  isSelected = false,
  className = "",
  ...props
}: GameCardProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={`group relative text-left h-full ${focusRing} focus-visible:ring-[#D9695A]/60 ${className}`}
      {...props}
    >
      <div
        className={`relative overflow-hidden h-full bg-white/[0.04] border border-white/10 ${radius.panel} p-8 ${motion.lift} hover:bg-white/[0.06] ${
          isSelected ? "ring-2 ring-white/40" : ""
        }`}
        style={{ borderLeft: `3px solid ${accent}` }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 h-full">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${accent}26` }}
            aria-hidden="true"
          >
            {icon}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
          <p className="text-sm sm:text-base text-white/60">{description}</p>
          {meta}
        </div>
      </div>
    </button>
  );
}

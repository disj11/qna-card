import type { QuestionLevel } from "../types";

/** 레벨별 은은한 포인트 컬러 — 카드 전체가 아닌 칩/테두리에만 사용 */
export const levelMeta: Record<
  QuestionLevel,
  { label: string; emoji: string; color: string }
> = {
  1: { label: "워밍업", emoji: "🌱", color: "#8FA98C" },
  2: { label: "연결", emoji: "💕", color: "#C98A8A" },
  3: { label: "진심", emoji: "🔥", color: "#C99A4A" },
};

export type FeedbackTone = "info" | "success" | "warning" | "danger";

/** 차분한 다크 톤 하나만 사용 — 짙은 자흑 배경 + 로즈 계열 단일 포인트 컬러 */
export const theme = {
  background: "bg-[#2B222D]",
  accent: "bg-[#D9695A] hover:bg-[#C15848]",
  accentText: "text-[#FBF1E7]",
  focusRing: "focus-visible:ring-[#D9695A]/60",
  softSurface: "bg-white/[0.04]",
  border: "border-white/10",
};

export const surface = {
  glass: "bg-white/[0.05] backdrop-blur-sm border border-white/10 shadow-xl text-white",
  glassSubtle: "bg-white/[0.03] border border-white/10 text-white",
  dark: "bg-black/20 text-white",
  /** 질문 카드 전용 종이 질감 표면 */
  paper: "bg-[#CBB794] text-[#211A17]",
};

export const radius = {
  control: "rounded-xl",
  panel: "rounded-2xl",
  feature: "rounded-3xl",
  pill: "rounded-full",
};

export const motion = {
  interactive:
    "transition-all duration-200 active:scale-[0.98] motion-reduce:transition-none motion-reduce:transform-none",
  lift: "transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transition-none motion-reduce:transform-none",
};

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2B222D]";

export const feedbackToneStyles: Record<FeedbackTone, string> = {
  info: "bg-blue-500/15 border-blue-300/25 text-blue-100",
  success: "bg-green-500/15 border-green-300/25 text-green-100",
  warning: "bg-yellow-500/15 border-yellow-300/25 text-yellow-100",
  danger: "bg-red-500/15 border-red-300/25 text-red-100",
};

import type { GameId } from "../types";

export type DesignTone =
  | "brand"
  | "question"
  | "truth"
  | "mission"
  | "balance"
  | "word";

export type FeedbackTone = "info" | "success" | "warning" | "danger";

export interface GameTheme {
  tone: DesignTone;
  gameId?: GameId;
  background: string;
  accentGradient: string;
  accentText: string;
  focusRing: string;
  softSurface: string;
  border: string;
}

export const themeByTone: Record<DesignTone, GameTheme> = {
  brand: {
    tone: "brand",
    background: "from-indigo-900 via-purple-900 to-pink-900",
    accentGradient: "from-purple-500 to-pink-500",
    accentText: "text-purple-100",
    focusRing: "focus-visible:ring-purple-300",
    softSurface: "bg-purple-500/20",
    border: "border-purple-300/30",
  },
  question: {
    tone: "question",
    gameId: "question-cards",
    background: "from-indigo-900 via-purple-900 to-pink-900",
    accentGradient: "from-purple-500 to-pink-500",
    accentText: "text-purple-100",
    focusRing: "focus-visible:ring-purple-300",
    softSurface: "bg-purple-500/20",
    border: "border-purple-300/30",
  },
  truth: {
    tone: "truth",
    gameId: "truth-or-dare",
    background: "from-blue-900 via-cyan-900 to-teal-900",
    accentGradient: "from-blue-500 to-cyan-500",
    accentText: "text-blue-100",
    focusRing: "focus-visible:ring-cyan-300",
    softSurface: "bg-blue-500/20",
    border: "border-blue-300/30",
  },
  mission: {
    tone: "mission",
    gameId: "random-mission",
    background: "from-green-900 via-emerald-900 to-teal-900",
    accentGradient: "from-green-500 to-emerald-500",
    accentText: "text-green-100",
    focusRing: "focus-visible:ring-emerald-300",
    softSurface: "bg-green-500/20",
    border: "border-green-300/30",
  },
  balance: {
    tone: "balance",
    gameId: "balance-game",
    background: "from-orange-900 via-red-900 to-pink-900",
    accentGradient: "from-orange-500 to-red-500",
    accentText: "text-orange-100",
    focusRing: "focus-visible:ring-orange-300",
    softSurface: "bg-orange-500/20",
    border: "border-orange-300/30",
  },
  word: {
    tone: "word",
    gameId: "word-chain",
    background: "from-indigo-900 via-purple-900 to-pink-900",
    accentGradient: "from-indigo-500 to-purple-500",
    accentText: "text-indigo-100",
    focusRing: "focus-visible:ring-indigo-300",
    softSurface: "bg-indigo-500/20",
    border: "border-indigo-300/30",
  },
};

export const gameToneById: Record<GameId, DesignTone> = {
  "question-cards": "question",
  "truth-or-dare": "truth",
  "random-mission": "mission",
  "balance-game": "balance",
  "word-chain": "word",
};

export const surface = {
  glass:
    "bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-white",
  glassSubtle: "bg-white/10 border border-white/10 text-white",
  dark: "bg-black/30 text-white",
};

export const radius = {
  control: "rounded-xl",
  panel: "rounded-2xl",
  feature: "rounded-3xl",
  pill: "rounded-full",
};

export const motion = {
  interactive:
    "transition-all duration-200 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none",
  lift: "transition-all duration-300 hover:scale-[1.02] active:scale-95 motion-reduce:transition-none motion-reduce:transform-none",
};

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

export const feedbackToneStyles: Record<FeedbackTone, string> = {
  info: "bg-blue-500/20 border-blue-300/30 text-blue-100",
  success: "bg-green-500/20 border-green-300/30 text-green-100",
  warning: "bg-yellow-500/20 border-yellow-300/30 text-yellow-100",
  danger: "bg-red-500/20 border-red-300/30 text-red-100",
};

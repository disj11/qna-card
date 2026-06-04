import type { Game } from "../types";

export const games: Game[] = [
  {
    id: "question-cards",
    title: "질문카드",
    emoji: "💝",
    description: "서로를 알아가는 질문 게임",
    gradient: "from-purple-500 to-pink-500",
    textColor: "text-purple-100",
    hasMultiplayer: true,
  },
  {
    id: "truth-or-dare",
    title: "진실 혹은 거짓",
    emoji: "🎭",
    description: "진실을 맞추는 추리 게임",
    gradient: "from-blue-500 to-cyan-500",
    textColor: "text-blue-100",
    hasMultiplayer: true,
  },
  {
    id: "random-mission",
    title: "랜덤 미션",
    emoji: "🎲",
    description: "재미있는 랜덤 미션 수행",
    gradient: "from-green-500 to-emerald-500",
    textColor: "text-green-100",
    hasMultiplayer: true,
  },
  {
    id: "balance-game",
    title: "밸런스 게임",
    emoji: "⚖️",
    description: "둘 중 하나를 선택하세요",
    gradient: "from-orange-500 to-red-500",
    textColor: "text-orange-100",
    hasMultiplayer: true,
  },
  {
    id: "word-chain",
    title: "초성 게임",
    emoji: "🔤",
    description: "초성으로 단어 맞추기",
    gradient: "from-indigo-500 to-purple-500",
    textColor: "text-indigo-100",
    hasMultiplayer: true,
  },
];

export const gameInfoMap = Object.fromEntries(
  games.map((game) => [game.id, game])
) as Record<Game["id"], Game>;

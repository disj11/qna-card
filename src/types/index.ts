/**
 * 게임 관련 타입 정의
 */

/**
 * 게임 ID 타입
 */
export type GameId =
  | "question-cards"
  | "truth-or-dare"
  | "random-mission"
  | "balance-game"
  | "word-chain";

/**
 * 게임 정보 인터페이스
 */
export interface Game {
  id: GameId;
  title: string;
  emoji: string;
  description: string;
  gradient: string;
  textColor: string;
  hasMultiplayer: boolean;
}

/**
 * 질문 인터페이스
 */
export interface Question {
  id: number;
  text: string;
  category?: "daily" | "love";
}

/**
 * 미션 인터페이스
 */
export interface Mission {
  id: number;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  emoji?: string;
}

/**
 * 밸런스 게임 질문 인터페이스
 */
export interface BalanceQuestion {
  id: number;
  optionA: string;
  optionB: string;
  emoji?: string;
}

/**
 * 초성 게임 퍼즐 인터페이스
 */
export interface WordPuzzle {
  id: number;
  consonants: string;
  answer: string;
  category: string;
  hint?: string;
}

/**
 * 진실/거짓 진술 인터페이스
 */
export interface Statement {
  id: number;
  text: string;
  isTrue: boolean;
}

/**
 * 플레이어 인터페이스
 */
export interface Player {
  id: string;
  nickname: string;
  isHost: boolean;
  isReady: boolean;
  status: "online" | "disconnected";
}

/**
 * 게임 메시지 타입
 */
export type GameMessageType =
  | "player-join"
  | "player-leave"
  | "player-ready"
  | "game-start"
  | "game-state"
  | "chat"
  | "emoji"
  | "turn-change"
  | "player-list"
  | "wordchain-submit"
  | "randommission-draw"
  | "randommission-complete"
  | "randommission-pass";

/**
 * 게임 메시지 인터페이스
 */
export interface GameMessage {
  type: GameMessageType;
  data: unknown;
  from: string;
  timestamp: number;
}

/**
 * 게임 통계 인터페이스
 */
export interface GameStats {
  totalGamesPlayed: number;
  favoriteGame?: GameId;
  questionStats?: {
    totalFlipped: number;
    favoriteQuestions: number[];
  };
  missionStats?: {
    completed: number;
    passed: number;
    completionRate: number;
  };
  playTime: {
    total: number;
    byGame: Partial<Record<GameId, number>>;
  };
}

/**
 * 테마 타입
 */
export type Theme = "light" | "dark";

/**
 * 채팅 메시지 인터페이스
 */
export interface ChatMessage {
  id: string;
  from: string;
  message: string;
  timestamp: number;
}

/**
 * 이모지 반응 인터페이스
 */
export interface EmojiReaction {
  emoji: string;
  from: string;
  timestamp: number;
}

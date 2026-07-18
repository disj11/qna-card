/**
 * 게임 관련 타입 정의
 */

/**
 * 게임 ID 타입 (질문카드 단일 목적 앱)
 */
export type GameId = "question-cards";

/**
 * 질문 레벨: 1 워밍업 · 2 연결 · 3 진심
 */
export type QuestionLevel = 1 | 2 | 3;

/**
 * 질문 인터페이스
 */
export interface Question {
  id: number;
  text: string;
  level: QuestionLevel;
  followUp?: string;
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
  | "player-list";

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

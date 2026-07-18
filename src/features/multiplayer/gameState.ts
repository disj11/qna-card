import {
  buildQueueIds,
  isGateReached,
  nextLevelOf,
} from "../question-deck/deckEngine";
import type { QuestionLevel } from "../../types";

export interface GameState {
  level: QuestionLevel;
  queueIds: number[];
  visited: Record<QuestionLevel, number[]>;
  isRevealed: boolean;
  finished: boolean;
  pickResult: string | null;
}

export function buildInitialState(): GameState {
  return {
    level: 1,
    queueIds: buildQueueIds(1, []),
    visited: { 1: [], 2: [], 3: [] },
    isRevealed: false,
    finished: false,
    pickResult: null,
  };
}

/** 카드 하나를 처리(패스 또는 답변 완료)한 뒤의 다음 GameState를 계산하는 순수 함수 */
export function computeNextState(
  gameState: GameState,
  mark: boolean,
  currentId: number
): GameState {
  const visited = mark
    ? {
        ...gameState.visited,
        [gameState.level]: [...gameState.visited[gameState.level], currentId],
      }
    : gameState.visited;

  const remainingQueue = gameState.queueIds.slice(1);
  const gateReached = isGateReached(
    gameState.level,
    visited[gameState.level].length
  );
  const levelExhausted = remainingQueue.length === 0;
  const nextLevel = nextLevelOf(gameState.level);

  if (nextLevel && (gateReached || levelExhausted)) {
    return {
      level: nextLevel,
      queueIds: buildQueueIds(nextLevel, visited[nextLevel]),
      visited,
      isRevealed: false,
      finished: false,
      pickResult: null,
    };
  }

  if (levelExhausted && !nextLevel) {
    return {
      ...gameState,
      queueIds: remainingQueue,
      visited,
      isRevealed: false,
      finished: true,
      pickResult: null,
    };
  }

  return {
    ...gameState,
    queueIds: remainingQueue,
    visited,
    isRevealed: false,
    pickResult: null,
  };
}

import { levelGateThreshold, questionsByLevel } from "../../data/questionCards";
import type { QuestionLevel } from "../../types";

/** Fisher-Yates 셔플. 원본 배열은 변경하지 않음 */
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** 다음 레벨. 마지막 레벨(3)이면 null */
export function nextLevelOf(level: QuestionLevel): QuestionLevel | null {
  return level < 3 ? ((level + 1) as QuestionLevel) : null;
}

/** 해당 레벨에서 다음 레벨로 넘어갈 수 있는 게이트에 도달했는지 여부 */
export function isGateReached(level: QuestionLevel, visitedCount: number) {
  return visitedCount >= levelGateThreshold[level];
}

/** 해당 레벨의 질문 중 아직 보지 않은 것들을 섞어서 id 큐로 반환 */
export function buildQueueIds(level: QuestionLevel, excludeIds: number[]) {
  const remaining = questionsByLevel[level].filter(
    (q) => !excludeIds.includes(q.id)
  );
  return shuffle(remaining.map((q) => q.id));
}

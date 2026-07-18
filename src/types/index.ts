/**
 * 게임 관련 타입 정의
 */

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

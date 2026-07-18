import { useEffect, useMemo, useState } from "react";
import Button from "../components/common/Button";
import GlassPanel from "../components/common/GlassPanel";
import PageShell from "../components/common/PageShell";
import GameHeader from "../components/common/GameHeader";
import {
  questionsByLevel,
  levelGateThreshold,
} from "../data/questionCards";
import { levelMeta } from "../design-system/tokens";
import type { Question, QuestionLevel } from "../types";

const STORAGE_KEY = "qna-card:together-progress";
/** .qcard-face의 opacity/transform 트랜지션 시간(index.css)과 반드시 맞춰야 함 */
const CARD_TRANSITION_MS = 350;

const levels: QuestionLevel[] = [1, 2, 3];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface SavedProgress {
  level: QuestionLevel;
  visited: Record<QuestionLevel, number[]>;
  names: { me: string; partner: string };
}

function loadSavedProgress(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedProgress;
  } catch {
    return null;
  }
}

interface QuestionDeckProps {
  onBack: () => void;
}

export default function QuestionDeck({ onBack }: QuestionDeckProps) {
  const savedProgress = useMemo(loadSavedProgress, []);

  const [phase, setPhase] = useState<"intro" | "playing" | "summary">(
    "intro"
  );
  const [names, setNames] = useState({ me: "나", partner: "상대방" });
  const [level, setLevel] = useState<QuestionLevel>(1);
  const [visited, setVisited] = useState<Record<QuestionLevel, number[]>>({
    1: [],
    2: [],
    3: [],
  });
  const [queue, setQueue] = useState<Question[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pickResult, setPickResult] = useState<string | null>(null);
  const [showLevelUpPrompt, setShowLevelUpPrompt] = useState(false);

  const buildQueue = (targetLevel: QuestionLevel, alreadyVisited: number[]) => {
    const remaining = questionsByLevel[targetLevel].filter(
      (q) => !alreadyVisited.includes(q.id)
    );
    setQueue(shuffle(remaining));
    setIsRevealed(false);
  };

  const startFresh = () => {
    setVisited({ 1: [], 2: [], 3: [] });
    setLevel(1);
    buildQueue(1, []);
    setPhase("playing");
  };

  const resumeSaved = () => {
    if (!savedProgress) return;
    setNames(savedProgress.names);
    setVisited(savedProgress.visited);
    setLevel(savedProgress.level);
    buildQueue(savedProgress.level, savedProgress.visited[savedProgress.level]);
    setPhase("playing");
  };

  // Persist progress whenever it changes during play
  useEffect(() => {
    if (phase !== "playing") return;
    const data: SavedProgress = { level, visited, names };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [phase, level, visited, names]);

  const totalAnswered = levels.reduce((sum, l) => sum + visited[l].length, 0);
  const currentCard = queue[0];
  const gateReached = visited[level].length >= levelGateThreshold[level];
  const nextLevel = level < 3 ? ((level + 1) as QuestionLevel) : null;

  const advance = (idToMark?: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsRevealed(false);
    setPickResult(null);

    // 뒷면이 완전히 가려질 때까지(qcard-face 트랜지션 종료) 기다린 뒤에
    // 다음 카드 내용으로 바꿔야, 페이드 도중 다음 질문이 비치지 않는다.
    window.setTimeout(() => {
      const updatedVisited = idToMark
        ? { ...visited, [level]: [...visited[level], idToMark] }
        : visited;
      if (idToMark) setVisited(updatedVisited);

      const remainingQueue = queue.slice(1);
      setQueue(remainingQueue);
      setIsTransitioning(false);

      const justReachedGate =
        idToMark && updatedVisited[level].length >= levelGateThreshold[level];
      const levelExhausted = remainingQueue.length === 0;

      if (nextLevel && (justReachedGate || levelExhausted)) {
        setShowLevelUpPrompt(true);
        return;
      }

      if (levelExhausted && !nextLevel) {
        setPhase("summary");
      }
    }, CARD_TRANSITION_MS);
  };

  const handleReveal = () => setIsRevealed(true);

  const handleAnswered = () => {
    if (!currentCard) return;
    advance(currentCard.id);
  };

  const handlePass = () => {
    if (!currentCard) return;
    advance();
  };

  const goToNextLevel = () => {
    if (!nextLevel) return;
    setShowLevelUpPrompt(false);
    setLevel(nextLevel);
    buildQueue(nextLevel, visited[nextLevel]);
  };

  const stayOnLevel = () => {
    setShowLevelUpPrompt(false);
    if (queue.length === 0) {
      buildQueue(level, visited[level]);
    }
  };

  const finishNow = () => {
    setShowLevelUpPrompt(false);
    setPhase("summary");
  };

  const jumpToLevel = (target: QuestionLevel) => {
    if (target === level || isTransitioning) return;
    const prevLevel = (target - 1) as QuestionLevel;
    const isUnlocked =
      target === 1 || visited[prevLevel].length >= levelGateThreshold[prevLevel];
    if (!isUnlocked) return;

    setIsTransitioning(true);
    setIsRevealed(false);
    setPickResult(null);
    window.setTimeout(() => {
      setLevel(target);
      buildQueue(target, visited[target]);
      setIsTransitioning(false);
    }, CARD_TRANSITION_MS);
  };

  const pickWhoAnswersFirst = () => {
    const options = [names.me || "나", names.partner || "상대방"];
    setPickResult(options[Math.floor(Math.random() * options.length)]);
  };

  const endSession = () => {
    setPhase("summary");
  };

  const restartAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPhase("intro");
  };

  const backToMenu = () => {
    onBack();
  };

  // ---- Intro screen ----
  if (phase === "intro") {
    return (
      <PageShell tone="question" centered>
        <GlassPanel size="lg" className="max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💝</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              한 기기로 함께
            </h1>
            <p className="text-white/70">
              폰 하나를 같이 보면서, 번갈아 가며 답해보세요
            </p>
          </div>

          <div className="space-y-2 mb-6 text-left text-white/80 text-sm">
            {[
              "워밍업 → 연결 → 진심, 3단계로 천천히 깊어져요",
              "부담스러운 질문은 언제든 패스할 수 있어요",
              "둘 다 같은 질문에 번갈아 답해보세요",
            ].map((line) => (
              <div key={line} className="flex items-start gap-2">
                <span className="text-[#D9695A]">✓</span>
                <span>{line}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <label className="text-left">
              <span className="text-white/60 text-xs">내 이름(선택)</span>
              <input
                value={names.me}
                onChange={(e) =>
                  setNames((prev) => ({ ...prev, me: e.target.value }))
                }
                maxLength={10}
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D9695A]/60"
                placeholder="나"
              />
            </label>
            <label className="text-left">
              <span className="text-white/60 text-xs">상대방 이름(선택)</span>
              <input
                value={names.partner}
                onChange={(e) =>
                  setNames((prev) => ({ ...prev, partner: e.target.value }))
                }
                maxLength={10}
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D9695A]/60"
                placeholder="상대방"
              />
            </label>
          </div>

          <div className="space-y-3">
            {savedProgress && (
              <Button onClick={resumeSaved} size="lg" fullWidth>
                이어서 하기 (Level {savedProgress.level})
              </Button>
            )}
            <Button
              onClick={startFresh}
              variant={savedProgress ? "secondary" : "primary"}
              size="lg"
              fullWidth
            >
              처음부터 시작하기
            </Button>
            <Button onClick={backToMenu} variant="ghost" fullWidth>
              돌아가기
            </Button>
          </div>
        </GlassPanel>
      </PageShell>
    );
  }

  // ---- Summary screen ----
  if (phase === "summary") {
    return (
      <PageShell tone="question" centered>
        <GlassPanel size="lg" className="max-w-lg w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-2 break-keep">
            오늘 {totalAnswered}개의 질문을 나눴어요
          </h1>
          <p className="text-white/70 mb-6">
            {level === 3 && visited[3].length >= levelGateThreshold[3]
              ? "진심편까지 모두 나눴네요. 오늘 대화, 정말 좋았어요!"
              : "다음에 또 만나면, 이어서 더 깊은 이야기를 나눠봐요."}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {levels.map((l) => (
              <div
                key={l}
                className="rounded-xl bg-white/10 border border-white/20 p-3"
              >
                <div className="text-2xl">{levelMeta[l].emoji}</div>
                <div className="text-white text-sm font-semibold">
                  {levelMeta[l].label}
                </div>
                <div className="text-white/60 text-xs">
                  {visited[l].length}개
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button onClick={restartAll} size="lg" fullWidth>
              처음부터 다시
            </Button>
            <Button onClick={backToMenu} variant="secondary" fullWidth>
              메뉴로 돌아가기
            </Button>
          </div>
        </GlassPanel>
      </PageShell>
    );
  }

  // ---- Level-up interstitial ----
  if (showLevelUpPrompt) {
    return (
      <PageShell tone="question" centered>
        <GlassPanel size="lg" className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">{levelMeta[level].emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Level {level} · {levelMeta[level].label} 완료!
          </h2>
          <p className="text-white/70 mb-6">
            {nextLevel
              ? `Level ${nextLevel} · ${levelMeta[nextLevel].label}(으)로 넘어가볼까요?`
              : "여기까지가 마지막 단계예요."}
          </p>
          <div className="space-y-3">
            {nextLevel && (
              <Button onClick={goToNextLevel} size="lg" fullWidth>
                다음 레벨로 →
              </Button>
            )}
            <Button onClick={stayOnLevel} variant="secondary" fullWidth>
              이 레벨 질문 더 보기
            </Button>
            <Button onClick={finishNow} variant="ghost" fullWidth>
              오늘은 여기까지
            </Button>
          </div>
        </GlassPanel>
      </PageShell>
    );
  }

  // ---- Playing screen ----
  return (
    <PageShell tone="question">
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <GameHeader
          title="한 기기로 함께"
          icon="💝"
          onBack={endSession}
          backLabel="그만하기"
          meta={
            <span className="text-white/60 text-sm">
              총 {totalAnswered}개 진행
            </span>
          }
        />

        {/* Level tabs */}
        <div className="flex justify-center gap-2 my-6">
          {levels.map((l) => {
            const prevLevel = (l - 1) as QuestionLevel;
            const unlocked =
              l === 1 || visited[prevLevel].length >= levelGateThreshold[prevLevel];
            const isActive = l === level;
            return (
              <button
                key={l}
                onClick={() => jumpToLevel(l)}
                disabled={!unlocked || isTransitioning}
                className={`px-4 py-2 rounded-2xl font-bold text-sm border transition-all ${
                  isActive
                    ? "bg-white/10 text-white"
                    : unlocked
                      ? "bg-white/[0.04] text-white/60 border-white/10 hover:bg-white/10"
                      : "bg-white/[0.02] text-white/25 border-white/5 cursor-not-allowed"
                }`}
                style={isActive ? { borderColor: levelMeta[l].color } : undefined}
              >
                {unlocked ? levelMeta[l].emoji : "🔒"} {levelMeta[l].label}
              </button>
            );
          })}
        </div>

        <p className="text-center text-white/60 text-sm mb-4">
          Level {level} · {visited[level].length}/{levelGateThreshold[level]}{" "}
          {gateReached && nextLevel ? "· 다음 레벨 열림!" : ""}
        </p>

        {currentCard ? (
          <>
            {pickResult && (
              <div className="text-center mb-4 animate-slide-up">
                <span className="inline-block bg-[#CBB794] text-[#211A17] font-bold px-4 py-2 rounded-full shadow-lg">
                  🎲 이번엔 {pickResult}님 먼저!
                </span>
              </div>
            )}

            <div
              className={`qcard h-64 sm:h-72 mx-auto max-w-md ${
                isRevealed ? "revealed" : ""
              }`}
              onClick={() => !isRevealed && !isTransitioning && handleReveal()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (
                  (e.key === "Enter" || e.key === " ") &&
                  !isRevealed &&
                  !isTransitioning
                ) {
                  e.preventDefault();
                  handleReveal();
                }
              }}
            >
              <div
                className="qcard-face qcard-face--front"
                style={{ borderTop: `4px solid ${levelMeta[level].color}` }}
              >
                <div className="question-mark">?</div>
                <p className="text-sm text-[#211A17]/50">눌러서 확인하기</p>
              </div>
              <div
                className="qcard-face qcard-face--back"
                style={{ borderTop: `4px solid ${levelMeta[level].color}` }}
              >
                <div className="card-question-text text-lg sm:text-xl">
                  {currentCard.text}
                </div>
                {currentCard.followUp && (
                  <p className="mt-3 text-center text-sm text-[#211A17]/60 italic">
                    💬 {currentCard.followUp}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <Button onClick={pickWhoAnswersFirst} variant="secondary">
                🎲 먼저 답할 사람
              </Button>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <Button
                onClick={handlePass}
                variant="ghost"
                size="lg"
                disabled={isTransitioning}
              >
                패스
              </Button>
              <Button
                onClick={handleAnswered}
                disabled={!isRevealed || isTransitioning}
                disabledReason="카드를 눌러 질문을 먼저 확인해주세요"
                size="lg"
              >
                다음 카드 →
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-white/60">
            이 레벨의 질문을 모두 살펴봤어요.
          </p>
        )}
      </div>
    </PageShell>
  );
}

import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import GlassPanel from "../../components/GlassPanel";
import PageShell from "../../components/PageShell";
import QuestionFlipCard from "../question-deck/QuestionFlipCard";
import {
  level1Questions,
  level2Questions,
  level3Questions,
} from "../../data/questionCards";
import { levelMeta } from "../../design-system/tokens";
import type { QuestionLevel } from "../../types";

const sampleCards: { level: QuestionLevel; question: (typeof level1Questions)[number] }[] =
  [
    { level: 1, question: level1Questions[0] },
    { level: 2, question: level2Questions[0] },
    { level: 3, question: level3Questions[0] },
  ];

const moments = [
  "처음 만난 자리에서 무슨 말을 꺼내야 할지 막막할 때",
  "마주 앉았는데 대화가 뚝뚝 끊길 때",
  "예의상 나누는 대화 말고, 진짜 이야기를 하고 싶을 때",
  "멀리 떨어져 있어도 같이 대화를 이어가고 싶을 때",
];

const steps = [
  { n: 1, text: "마주 앉아서 폰 하나를 같이 봐요" },
  { n: 2, text: "질문을 눌러 확인하고, 번갈아 가며 답해요" },
  { n: 3, text: "워밍업 → 연결 → 진심, 천천히 깊어져요" },
];

const modes = [
  {
    title: "한 기기로 함께",
    description: "폰 하나를 같이 보며, 번갈아 답해요",
    accent: "#D9695A",
  },
  {
    title: "혼자 미리보기",
    description: "만나기 전, 질문들을 미리 둘러보세요",
    accent: "#8FA98C",
  },
  {
    title: "원거리 함께하기",
    description: "서로 다른 폰으로 방 코드를 만들어 연결해요",
    accent: "#C99A4A",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const goToStart = () => navigate("/start");

  return (
    <PageShell>
      <div className="container mx-auto px-4">
        {/* Hero */}
        <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 animate-slide-up">
            질문카드
          </h1>
          <p
            className="max-w-xl mx-auto text-white/70 text-lg sm:text-xl mb-2 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            어색함이 무거운 그 순간을 위해
          </p>
          <p
            className="max-w-xl mx-auto text-white/50 text-base sm:text-lg mb-10 animate-slide-up"
            style={{ animationDelay: "0.15s" }}
          >
            워밍업 → 연결 → 진심, 3단계로 천천히 깊어지는 질문으로 편하게
            대화를 이어가 보세요.
          </p>
          <div
            className="animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Button onClick={goToStart} size="lg">
              지금 시작하기 →
            </Button>
            <p className="mt-3 text-white/40 text-sm">
              무료 · 회원가입 없이 바로 시작
            </p>
          </div>
        </section>

        {/* Sample cards */}
        <section className="pb-16 sm:pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {sampleCards.map(({ level, question }, index) => (
              <div
                key={level}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${0.25 + index * 0.1}s` }}
              >
                <p
                  className="mb-3 text-sm font-semibold"
                  style={{ color: levelMeta[level].color }}
                >
                  {levelMeta[level].emoji} Level {level} · {levelMeta[level].label}
                </p>
                <QuestionFlipCard
                  question={question}
                  level={level}
                  revealed
                  onReveal={() => {}}
                  size="compact"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section className="pb-16 sm:pb-20">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-8">
            이런 순간에 딱이에요
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {moments.map((moment) => (
              <GlassPanel key={moment} variant="subtle">
                <span className="text-white/80 text-sm sm:text-base">
                  {moment}
                </span>
              </GlassPanel>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="pb-16 sm:pb-20">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-8">
            이렇게 진행돼요
          </h2>
          <GlassPanel variant="subtle" className="max-w-xl mx-auto">
            <ol className="space-y-4">
              {steps.map((step) => (
                <li key={step.n} className="flex items-center gap-4">
                  <span className="flex-none w-8 h-8 rounded-full bg-white/10 text-white/90 text-sm font-bold flex items-center justify-center">
                    {step.n}
                  </span>
                  <span className="text-white/80 text-base">{step.text}</span>
                </li>
              ))}
            </ol>
          </GlassPanel>
        </section>

        {/* Modes */}
        <section className="pb-16 sm:pb-20">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-8">
            세 가지 방법으로 즐겨보세요
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {modes.map((mode) => (
              <div
                key={mode.title}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center"
                style={{ borderLeft: `3px solid ${mode.accent}` }}
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {mode.title}
                </h3>
                <p className="text-white/60 text-sm">{mode.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="pb-16 sm:pb-20">
          <GlassPanel size="lg" className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              둘만의 대화, 서버에 남지 않아요
            </h2>
            <p className="text-white/60 text-sm sm:text-base">
              원거리 함께하기는 P2P(브라우저 간 직접 연결) 방식으로 동작해요.
              채팅과 답변 모두 두 사람 사이에서만 오가고, 어디에도 저장되지
              않아요.
            </p>
          </GlassPanel>
        </section>

        {/* Final CTA */}
        <section className="pb-20 text-center">
          <Button onClick={goToStart} size="lg">
            지금 시작하기 →
          </Button>
        </section>

      </div>
    </PageShell>
  );
}

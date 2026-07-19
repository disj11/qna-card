import { useNavigate } from "react-router-dom";
import GameCard from "../components/GameCard";
import GlassPanel from "../components/GlassPanel";
import PageShell from "../components/PageShell";

const steps = [
  { n: 1, text: "마주 앉아서 폰 하나를 같이 봐요" },
  { n: 2, text: "질문을 눌러 확인하고, 번갈아 가며 답해요" },
  { n: 3, text: "워밍업 → 연결 → 진심, 천천히 깊어져요" },
];

export default function Menu() {
  const navigate = useNavigate();

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>홈으로</span>
        </button>

        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 animate-slide-up">
            질문카드
          </h1>
          <p
            className="text-white/70 text-lg animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            마주 앉은 두 사람을 위한 대화 카드
          </p>
        </header>

        {/* What happens — clarity up front, no guessing what this app does */}
        <div
          className="max-w-2xl mx-auto mb-10 animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <GlassPanel variant="subtle">
            <ol className="space-y-2">
              {steps.map((step) => (
                <li
                  key={step.n}
                  className="flex items-center gap-3 text-white/80 text-sm sm:text-base"
                >
                  <span className="flex-none w-6 h-6 rounded-full bg-white/10 text-white/90 text-xs font-bold flex items-center justify-center">
                    {step.n}
                  </span>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </GlassPanel>
        </div>

        {/* Entry Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <GameCard
            onClick={() => navigate("/together")}
            aria-label="한 기기로 함께 시작"
            title="한 기기로 함께"
            description="폰 하나를 같이 보며, 번갈아 답해요"
            accent="#D9695A"
            className="animate-slide-up"
            style={{ animationDelay: "0.2s" }}
            meta={
              <div className="mt-2 text-[#D9695A] text-sm font-semibold">
                오늘 만남에 추천 →
              </div>
            }
          />

          <GameCard
            onClick={() => navigate("/solo")}
            aria-label="혼자 미리보기 시작"
            title="혼자 미리보기"
            description="만나기 전, 질문들을 미리 둘러보세요"
            accent="#8FA98C"
            className="animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          />

          <GameCard
            onClick={() => navigate("/remote")}
            aria-label="원거리 함께하기 시작"
            title="원거리 함께하기"
            description="서로 다른 폰으로 방 코드를 만들어 연결해요"
            accent="#C99A4A"
            className="animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          />
        </div>

      </div>
    </PageShell>
  );
}

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GameCard from "./common/GameCard";
import GameHeader from "./common/GameHeader";
import GlassPanel from "./common/GlassPanel";
import PageShell from "./common/PageShell";

interface GameModeSelectorProps {
  gameTitle: string;
  gameEmoji: string;
  gameDescription: string;
  gradient: string;
}

export default function GameModeSelector({
  gameTitle,
  gameEmoji,
  gameDescription,
}: GameModeSelectorProps) {
  const [hoveredMode, setHoveredMode] = useState<"single" | "multi" | null>(
    null
  );
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  const handleSelectMode = (mode: "single" | "multi") => {
    navigate(`/game/${gameId}/${mode}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <PageShell centered>
      <div className="max-w-4xl w-full">
        <GameHeader
          title={gameTitle}
          description={gameDescription}
          icon={gameEmoji}
          onBack={handleBack}
          backLabel="메뉴로 돌아가기"
        />

        <div className="text-center my-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-3">
            게임 모드를 선택하세요
          </h2>
          <p className="text-white/60">
            혼자 즐기거나 친구들과 함께 플레이하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <GameCard
            onClick={() => handleSelectMode("single")}
            onMouseEnter={() => setHoveredMode("single")}
            onMouseLeave={() => setHoveredMode(null)}
            aria-label={`${gameTitle} 혼자 플레이 시작`}
            icon="🎯"
            title="혼자 플레이"
            description="나만의 속도로 편안하게 즐기세요"
            gradient="from-blue-500 to-cyan-500"
            isSelected={hoveredMode === "single"}
            className="animate-slide-up"
            style={{ animationDelay: "0.1s" }}
            meta={
              <div className="space-y-2 text-left text-white/80">
                {[
                  "자유로운 진행 속도",
                  "언제든지 멈추고 재개 가능",
                  "모든 콘텐츠 이용 가능",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <span className="text-green-300" aria-hidden="true">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
                <div className="pt-4 text-center font-semibold text-white">
                  시작하기 →
                </div>
              </div>
            }
          />

          <GameCard
            onClick={() => handleSelectMode("multi")}
            onMouseEnter={() => setHoveredMode("multi")}
            onMouseLeave={() => setHoveredMode(null)}
            aria-label={`${gameTitle} 친구와 함께 플레이 시작`}
            icon="👥"
            title="친구와 함께"
            description="실시간으로 친구들과 함께 즐기세요"
            gradient="from-pink-500 to-purple-500"
            isSelected={hoveredMode === "multi"}
            className="animate-slide-up"
            style={{ animationDelay: "0.2s" }}
            meta={
              <div className="space-y-2 text-left text-white/80">
                {[
                  "실시간 P2P 연결",
                  "실시간 채팅 & 이모지",
                  "최대 10명까지 참여 가능",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <span className="text-pink-200" aria-hidden="true">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
                <div className="pt-4 text-center font-semibold text-white">
                  시작하기 →
                </div>
              </div>
            }
          />
        </div>

        <GlassPanel
          variant="subtle"
          className="bg-blue-500/20 border-blue-400/30 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl" aria-hidden="true">
              💡
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">
                멀티플레이어 모드 안내
              </h4>
              <p className="text-blue-200 text-sm leading-relaxed">
                친구와 함께 플레이하려면 한 명이 <strong>방을 만들고</strong>,
                다른 친구들은 <strong>방 코드</strong>를 입력하여 참가하세요.
                서버 없이 브라우저끼리 직접 연결되는 P2P 방식으로 안전하게 즐길
                수 있습니다.
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </PageShell>
  );
}

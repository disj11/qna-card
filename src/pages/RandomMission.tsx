import { useState } from "react";

interface Mission {
  id: number;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  emoji: string;
}

const missions: Mission[] = [
  { id: 1, text: "옆 사람과 하이파이브하기", difficulty: "easy", emoji: "🙌" },
  { id: 2, text: "30초 동안 한 발로 서있기", difficulty: "easy", emoji: "🦩" },
  { id: 3, text: "좋아하는 노래 1절 부르기", difficulty: "medium", emoji: "🎤" },
  { id: 4, text: "자기소개를 영어로 하기", difficulty: "medium", emoji: "🗣️" },
  { id: 5, text: "10초 안에 5명에게 칭찬하기", difficulty: "medium", emoji: "💝" },
  { id: 6, text: "최근 찍은 사진 보여주기", difficulty: "easy", emoji: "📸" },
  { id: 7, text: "내 폰의 마지막 검색 기록 공개하기", difficulty: "hard", emoji: "🔍" },
  { id: 8, text: "손뼉치기 10번 연속하기", difficulty: "easy", emoji: "👏" },
  { id: 9, text: "애교 부리기", difficulty: "hard", emoji: "😊" },
  { id: 10, text: "좋아하는 춤 동작 하나 보여주기", difficulty: "medium", emoji: "💃" },
  { id: 11, text: "제일 최근에 본 꿈 이야기하기", difficulty: "easy", emoji: "💭" },
  { id: 12, text: "10초간 눈 감고 명상하기", difficulty: "easy", emoji: "🧘" },
  { id: 13, text: "동물 소리 3가지 흉내내기", difficulty: "medium", emoji: "🐶" },
  { id: 14, text: "다음 사람에게 스킨십하기 (하이터치, 악수 등)", difficulty: "medium", emoji: "🤝" },
  { id: 15, text: "어릴 적 사진 보여주기", difficulty: "hard", emoji: "👶" },
  { id: 16, text: "지갑 속 영수증 공개하기", difficulty: "hard", emoji: "🧾" },
  { id: 17, text: "최애 음식 3가지 말하기", difficulty: "easy", emoji: "🍕" },
  { id: 18, text: "1분 동안 웃지 않기", difficulty: "medium", emoji: "😐" },
  { id: 19, text: "가장 감동받았던 순간 이야기하기", difficulty: "medium", emoji: "😢" },
  { id: 20, text: "다음 사람 칭찬 3가지 하기", difficulty: "easy", emoji: "⭐" },
  { id: 21, text: "좋아하는 개그 하나 보여주기", difficulty: "hard", emoji: "🤡" },
  { id: 22, text: "손으로 하트 만들기", difficulty: "easy", emoji: "💗" },
  { id: 23, text: "최근에 산 물건 자랑하기", difficulty: "easy", emoji: "🛍️" },
  { id: 24, text: "버킷리스트 1개 말하기", difficulty: "easy", emoji: "📝" },
  { id: 25, text: "5초 안에 혀 트위스터 성공하기", difficulty: "hard", emoji: "👅" },
  { id: 26, text: "자신의 매력 포인트 3가지 말하기", difficulty: "medium", emoji: "✨" },
  { id: 27, text: "최애 연예인 흉내내기", difficulty: "hard", emoji: "🎬" },
  { id: 28, text: "옆 사람 손잡고 5초 응시하기", difficulty: "hard", emoji: "👀" },
  { id: 29, text: "가장 좋아하는 이모티콘 보여주기", difficulty: "easy", emoji: "😎" },
  { id: 30, text: "다음 사람에게 질문 하나 하기", difficulty: "easy", emoji: "❓" },
];

interface RandomMissionProps {
  onBack: () => void;
}

export default function RandomMission({ onBack }: RandomMissionProps) {
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [usedMissions, setUsedMissions] = useState<Set<number>>(new Set());
  const [isSpinning, setIsSpinning] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const getRandomMission = () => {
    const availableMissions = missions.filter(
      (m) => !usedMissions.has(m.id)
    );

    if (availableMissions.length === 0) {
      setUsedMissions(new Set());
      return missions[Math.floor(Math.random() * missions.length)];
    }

    return availableMissions[
      Math.floor(Math.random() * availableMissions.length)
    ];
  };

  const handleSpin = () => {
    setIsSpinning(true);

    setTimeout(() => {
      const mission = getRandomMission();
      setCurrentMission(mission);
      setUsedMissions((prev) => new Set([...prev, mission.id]));
      setIsSpinning(false);
    }, 1000);
  };

  const handleComplete = () => {
    setCompletedCount((prev) => prev + 1);
    setCurrentMission(null);
  };

  const handleSkip = () => {
    setCurrentMission(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-500/20 border-green-400/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-400/30";
      case "hard":
        return "text-red-400 bg-red-500/20 border-red-400/30";
      default:
        return "text-white bg-white/20 border-white/30";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "쉬움";
      case "medium":
        return "보통";
      case "hard":
        return "어려움";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group"
              >
                <svg
                  className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform"
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
                <span className="font-medium">돌아가기</span>
              </button>
              <div className="text-white font-semibold">
                완료: {completedCount}개
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-2xl w-full space-y-8">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
                🎲 랜덤 미션
              </h1>
              <p className="text-white/80 text-lg">
                뽑기 버튼을 눌러 미션을 시작하세요!
              </p>
            </div>

            {/* Mission Display */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 min-h-[400px] flex flex-col justify-center">
              {isSpinning ? (
                <div className="text-center space-y-6">
                  <div className="text-8xl animate-spin">🎲</div>
                  <div className="text-2xl text-white font-semibold">
                    미션 추첨 중...
                  </div>
                </div>
              ) : currentMission ? (
                <div className="text-center space-y-8 animate-slide-up">
                  <div className="text-8xl">{currentMission.emoji}</div>
                  <div className="space-y-4">
                    <div
                      className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold border ${getDifficultyColor(currentMission.difficulty)}`}
                    >
                      {getDifficultyText(currentMission.difficulty)}
                    </div>
                    <div className="text-2xl sm:text-3xl text-white font-medium leading-relaxed">
                      {currentMission.text}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="text-8xl">🎯</div>
                  <div className="text-2xl text-white font-semibold">
                    미션을 뽑아주세요!
                  </div>
                  <div className="text-white/70">
                    총 {missions.length}개의 미션이 준비되어 있습니다
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            {!currentMission ? (
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSpinning ? "추첨 중..." : "🎲 미션 뽑기"}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleSkip}
                  className="bg-white/10 text-white py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all transform hover:scale-105 active:scale-95"
                >
                  건너뛰기
                </button>
                <button
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  완료! ✓
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {missions.length}
                </div>
                <div className="text-xs text-white/70">전체 미션</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-emerald-400">
                  {completedCount}
                </div>
                <div className="text-xs text-white/70">완료</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-yellow-400">
                  {usedMissions.size}
                </div>
                <div className="text-xs text-white/70">사용됨</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

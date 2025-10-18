import { useState } from "react";

interface BalanceQuestion {
  id: number;
  optionA: string;
  optionB: string;
  emoji: string;
}

const questions: BalanceQuestion[] = [
  { id: 1, optionA: "평생 여름", optionB: "평생 겨울", emoji: "🌡️" },
  { id: 2, optionA: "투명인간", optionB: "하늘을 나는 능력", emoji: "🦸" },
  { id: 3, optionA: "과거로 가기", optionB: "미래로 가기", emoji: "⏰" },
  { id: 4, optionA: "평생 아침형 인간", optionB: "평생 저녁형 인간", emoji: "🌅" },
  { id: 5, optionA: "부자이지만 불행", optionB: "가난하지만 행복", emoji: "💰" },
  { id: 6, optionA: "평생 짜장면", optionB: "평생 짬뽕", emoji: "🍜" },
  { id: 7, optionA: "읽는 능력 상실", optionB: "말하는 능력 상실", emoji: "🗣️" },
  { id: 8, optionA: "10억 받기", optionB: "진정한 사랑 찾기", emoji: "❤️" },
  { id: 9, optionA: "과거 기억 삭제", optionB: "미래 기억 삭제", emoji: "🧠" },
  { id: 10, optionA: "평생 단 음식", optionB: "평생 짠 음식", emoji: "🍰" },
  { id: 11, optionA: "텔레포트", optionB: "시간 정지", emoji: "⚡" },
  { id: 12, optionA: "마음을 읽는 능력", optionB: "거짓말 탐지 능력", emoji: "🔮" },
  { id: 13, optionA: "평생 해외여행", optionB: "평생 국내여행", emoji: "✈️" },
  { id: 14, optionA: "10년 젊어지기", optionB: "10억 받기", emoji: "⏳" },
  { id: 15, optionA: "평생 봄", optionB: "평생 가을", emoji: "🍂" },
  { id: 16, optionA: "천재이지만 게으름", optionB: "평범하지만 부지런", emoji: "📚" },
  { id: 17, optionA: "유명하지만 사생활 無", optionB: "평범하지만 자유로움", emoji: "📸" },
  { id: 18, optionA: "과거의 실수 바로잡기", optionB: "미래 1년 미리보기", emoji: "🔭" },
  { id: 19, optionA: "평생 치킨", optionB: "평생 피자", emoji: "🍕" },
  { id: 20, optionA: "동물과 대화", optionB: "외국어 자동 습득", emoji: "🐶" },
  { id: 21, optionA: "평생 영화만 보기", optionB: "평생 음악만 듣기", emoji: "🎬" },
  { id: 22, optionA: "날씬하지만 먹는 즐거움 없음", optionB: "살찌지만 먹는 즐거움 유지", emoji: "🍔" },
  { id: 23, optionA: "평생 샤워만", optionB: "평생 목욕만", emoji: "🚿" },
  { id: 24, optionA: "하루 3시간 수면으로 충분", optionB: "아무리 자도 피곤", emoji: "😴" },
  { id: 25, optionA: "100명의 지인", optionB: "3명의 진짜 친구", emoji: "👥" },
];

interface BalanceGameProps {
  onBack: () => void;
}

export default function BalanceGame({ onBack }: BalanceGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<{ [key: number]: "A" | "B" }>({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];
  const hasVoted = votes[currentQuestion.id] !== undefined;

  const handleVote = (choice: "A" | "B") => {
    setVotes((prev) => ({ ...prev, [currentQuestion.id]: choice }));
    setShowResult(false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowResult(false);
    }
  };

  const handleShowStats = () => {
    setShowResult(true);
  };

  const getTotalVotes = () => {
    return Object.keys(votes).length;
  };

  const getACount = () => {
    return Object.values(votes).filter((v) => v === "A").length;
  };

  const getBCount = () => {
    return Object.values(votes).filter((v) => v === "B").length;
  };

  if (showResult) {
    const total = getTotalVotes();
    const aCount = getACount();
    const bCount = getBCount();
    const aPercent = total > 0 ? Math.round((aCount / total) * 100) : 0;
    const bPercent = total > 0 ? Math.round((bCount / total) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
          <div className="text-center space-y-6">
            <div className="text-6xl">📊</div>
            <h2 className="text-3xl font-bold text-white">통계</h2>

            <div className="space-y-4">
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-4xl font-bold text-white mb-2">
                  {total}
                </div>
                <div className="text-white/80">총 선택 횟수</div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">옵션 A</span>
                    <span className="text-blue-400 font-bold text-xl">{aPercent}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${aPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-white/70 text-sm mt-1">{aCount}번 선택</div>
                </div>

                <div className="bg-pink-500/20 rounded-xl p-4 border border-pink-400/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">옵션 B</span>
                    <span className="text-pink-400 font-bold text-xl">{bPercent}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full transition-all"
                      style={{ width: `${bPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-white/70 text-sm mt-1">{bCount}번 선택</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-4">
              <button
                onClick={() => setShowResult(false)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                계속하기
              </button>
              <button
                onClick={onBack}
                className="bg-white/10 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                메뉴로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
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
                {currentIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-3xl w-full space-y-8">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
                ⚖️ 밸런스 게임
              </h1>
              <p className="text-white/80 text-lg">
                둘 중 하나를 선택해주세요!
              </p>
            </div>

            {/* Question Display */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="text-6xl sm:text-7xl mb-4">{currentQuestion.emoji}</div>
                <div className="text-xl sm:text-2xl text-white/90 font-medium">
                  무엇을 선택하시겠습니까?
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option A */}
                <button
                  onClick={() => handleVote("A")}
                  className={`group relative p-6 sm:p-8 rounded-2xl transition-all transform hover:scale-105 active:scale-95 ${
                    hasVoted && votes[currentQuestion.id] === "A"
                      ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/50"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="text-4xl sm:text-5xl mb-4">🅰️</div>
                    <div className="text-lg sm:text-xl text-white font-semibold leading-relaxed">
                      {currentQuestion.optionA}
                    </div>
                  </div>
                  {hasVoted && votes[currentQuestion.id] === "A" && (
                    <div className="absolute top-3 right-3 text-2xl">✓</div>
                  )}
                </button>

                {/* VS Divider */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">
                    VS
                  </div>
                </div>

                {/* Option B */}
                <button
                  onClick={() => handleVote("B")}
                  className={`group relative p-6 sm:p-8 rounded-2xl transition-all transform hover:scale-105 active:scale-95 ${
                    hasVoted && votes[currentQuestion.id] === "B"
                      ? "bg-gradient-to-br from-pink-500 to-pink-700 shadow-lg shadow-pink-500/50"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="text-4xl sm:text-5xl mb-4">🅱️</div>
                    <div className="text-lg sm:text-xl text-white font-semibold leading-relaxed">
                      {currentQuestion.optionB}
                    </div>
                  </div>
                  {hasVoted && votes[currentQuestion.id] === "B" && (
                    <div className="absolute top-3 right-3 text-2xl">✓</div>
                  )}
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← 이전
              </button>
              <button
                onClick={handleShowStats}
                disabled={getTotalVotes() === 0}
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                📊 통계 보기
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                다음 →
              </button>
            </div>

            {/* Progress */}
            <div className="text-center text-white/70 text-sm">
              {hasVoted ? "✓ 선택 완료" : "선택을 기다리는 중..."}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

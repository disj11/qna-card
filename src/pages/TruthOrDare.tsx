import { useState } from "react";

interface Statement {
  id: number;
  text: string;
  isTrue: boolean;
}

const statements: Statement[] = [
  { id: 1, text: "나는 한 번도 지각을 한 적이 없다", isTrue: false },
  { id: 2, text: "나는 롤러코스터를 타본 적이 있다", isTrue: true },
  { id: 3, text: "나는 외국어를 2개 이상 할 수 있다", isTrue: false },
  { id: 4, text: "나는 요리하는 것을 좋아한다", isTrue: true },
  { id: 5, text: "나는 아침형 인간이다", isTrue: false },
  { id: 6, text: "나는 커피보다 차를 더 좋아한다", isTrue: false },
  { id: 7, text: "나는 운동을 주 3회 이상 한다", isTrue: false },
  { id: 8, text: "나는 노래방에서 18번을 부른 적이 있다", isTrue: true },
  { id: 9, text: "나는 번지점프를 해본 적이 있다", isTrue: false },
  { id: 10, text: "나는 매운 음식을 잘 먹는다", isTrue: true },
  { id: 11, text: "나는 공포영화를 혼자 볼 수 있다", isTrue: false },
  { id: 12, text: "나는 수영을 할 줄 안다", isTrue: true },
  { id: 13, text: "나는 밤샘을 해본 적이 있다", isTrue: true },
  { id: 14, text: "나는 길을 자주 잃는 편이다", isTrue: true },
  { id: 15, text: "나는 SNS를 하루에 10번 이상 확인한다", isTrue: true },
  { id: 16, text: "나는 해외여행을 5번 이상 다녀왔다", isTrue: false },
  { id: 17, text: "나는 애완동물을 키워본 적이 있다", isTrue: true },
  { id: 18, text: "나는 혼자 영화관에 가본 적이 있다", isTrue: true },
  { id: 19, text: "나는 컴퓨터 게임을 좋아한다", isTrue: true },
  { id: 20, text: "나는 악기를 하나 이상 연주할 수 있다", isTrue: false },
];

interface TruthOrDareProps {
  onBack: () => void;
}

export default function TruthOrDare({ onBack }: TruthOrDareProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [answered, setAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const currentStatement = statements[currentIndex];

  const handleGuess = (guess: boolean) => {
    if (answered) return;

    setAnswered(true);
    setRevealed(true);

    if (guess === currentStatement.isTrue) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
    }
  };

  const handleNext = () => {
    if (currentIndex < statements.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setRevealed(false);
      setAnswered(false);
    } else {
      setGameFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setRevealed(false);
    setScore({ correct: 0, wrong: 0 });
    setAnswered(false);
    setGameFinished(false);
  };

  if (gameFinished) {
    const total = score.correct + score.wrong;
    const percentage = Math.round((score.correct / total) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-3xl font-bold text-white">게임 종료!</h2>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-5xl font-bold text-white mb-2">
                  {percentage}%
                </div>
                <div className="text-white/80">정답률</div>
              </div>
              <div className="flex justify-around text-white">
                <div>
                  <div className="text-3xl font-bold text-green-400">
                    {score.correct}
                  </div>
                  <div className="text-sm text-white/70">정답</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400">
                    {score.wrong}
                  </div>
                  <div className="text-sm text-white/70">오답</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleRestart}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                다시 시작
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
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
                {currentIndex + 1} / {statements.length}
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
                🎭 진실 혹은 거짓
              </h1>
              <p className="text-white/80 text-lg">
                다음 진술이 참인지 거짓인지 맞춰보세요!
              </p>
            </div>

            {/* Score */}
            <div className="flex justify-center space-x-6">
              <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-green-400/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {score.correct}
                  </div>
                  <div className="text-xs text-white/70">정답</div>
                </div>
              </div>
              <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-red-400/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {score.wrong}
                  </div>
                  <div className="text-xs text-white/70">오답</div>
                </div>
              </div>
            </div>

            {/* Statement Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 min-h-[300px] flex flex-col justify-center">
              <div className="text-center space-y-8">
                <div className="text-xl sm:text-2xl md:text-3xl text-white font-medium leading-relaxed">
                  {currentStatement.text}
                </div>

                {revealed && (
                  <div
                    className={`animate-slide-up p-6 rounded-2xl ${
                      currentStatement.isTrue
                        ? "bg-green-500/20 border-2 border-green-400"
                        : "bg-red-500/20 border-2 border-red-400"
                    }`}
                  >
                    <div className="text-4xl mb-2">
                      {currentStatement.isTrue ? "✓" : "✗"}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {currentStatement.isTrue ? "진실입니다!" : "거짓입니다!"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            {!revealed ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleGuess(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={answered}
                >
                  <div className="text-3xl mb-1">✓</div>
                  <div>진실</div>
                </button>
                <button
                  onClick={() => handleGuess(false)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={answered}
                >
                  <div className="text-3xl mb-1">✗</div>
                  <div>거짓</div>
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-bold text-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                {currentIndex < statements.length - 1 ? "다음 문제" : "결과 보기"}
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

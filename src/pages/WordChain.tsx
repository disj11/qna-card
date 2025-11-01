import { useState, useEffect, useCallback } from "react";

interface WordPuzzle {
  id: number;
  consonants: string;
  answer: string;
  hint: string;
  category: string;
}

const puzzles: WordPuzzle[] = [
  {
    id: 1,
    consonants: "ㅋㅍㅌ",
    answer: "컴퓨터",
    hint: "전자기기",
    category: "사물",
  },
  {
    id: 2,
    consonants: "ㅎㄷㅍ",
    answer: "핸드폰",
    hint: "전화기",
    category: "사물",
  },
  {
    id: 3,
    consonants: "ㅊㅇㅈ",
    answer: "초인종",
    hint: "문 앞에 있는",
    category: "사물",
  },
  {
    id: 4,
    consonants: "ㅅㅈ",
    answer: "사자",
    hint: "정글의 왕",
    category: "동물",
  },
  {
    id: 5,
    consonants: "ㄱㅊㅉㄱ",
    answer: "김치찌개",
    hint: "김치로 만든 찌개",
    category: "음식",
  },
  {
    id: 6,
    consonants: "ㄱㅊ",
    answer: "김치",
    hint: "한국의 대표 반찬",
    category: "음식",
  },
  {
    id: 7,
    consonants: "ㅂㅌㅅㄴㄷ",
    answer: "방탄소년단",
    hint: "글로벌 K-POP 그룹",
    category: "연예인",
  },
  {
    id: 8,
    consonants: "ㅊㅊㄱ",
    answer: "춤추기",
    hint: "음악에 맞춰 몸을 움직이는 것",
    category: "동작",
  },
  {
    id: 9,
    consonants: "ㅇㅋㅅㅌ",
    answer: "오케스트라",
    hint: "악단",
    category: "음악",
  },
  {
    id: 10,
    consonants: "ㅅㅁㅌㅍ",
    answer: "스마트폰",
    hint: "똑똑한 전화기",
    category: "사물",
  },
  {
    id: 11,
    consonants: "ㅂㄴㄴ",
    answer: "바나나",
    hint: "노란 과일",
    category: "과일",
  },
  {
    id: 12,
    consonants: "ㅍㅈ",
    answer: "피자",
    hint: "이탈리아 음식",
    category: "음식",
  },
  {
    id: 13,
    consonants: "ㅊㅋ",
    answer: "치킨",
    hint: "국민 야식",
    category: "음식",
  },
  {
    id: 14,
    consonants: "ㅇㅇㅅㅋㄹ",
    answer: "아이스크림",
    hint: "시원한 디저트",
    category: "음식",
  },
  {
    id: 15,
    consonants: "ㅅㅅㅇㄱ",
    answer: "소설읽기",
    hint: "책으로 이야기 즐기기",
    category: "활동",
  },
  {
    id: 16,
    consonants: "ㅇㅎ",
    answer: "여행",
    hint: "떠나는 것",
    category: "활동",
  },
  {
    id: 17,
    consonants: "ㅋㅍ",
    answer: "커피",
    hint: "카페 음료",
    category: "음료",
  },
  {
    id: 18,
    consonants: "ㅈㅈㅁ",
    answer: "짜장면",
    hint: "중국집 메뉴",
    category: "음식",
  },
  {
    id: 19,
    consonants: "ㅉㅃ",
    answer: "짬뽕",
    hint: "빨간 국물",
    category: "음식",
  },
  {
    id: 20,
    consonants: "ㅅㅇㅋ",
    answer: "사이클",
    hint: "자전거 타기",
    category: "운동",
  },
  {
    id: 21,
    consonants: "ㅁㄹㅌ",
    answer: "마라톤",
    hint: "장거리 달리기",
    category: "운동",
  },
  {
    id: 22,
    consonants: "ㅂㄱ",
    answer: "복권",
    hint: "로또",
    category: "사물",
  },
  {
    id: 23,
    consonants: "ㅎㅂㄱ",
    answer: "햄버거",
    hint: "패스트푸드",
    category: "음식",
  },
  {
    id: 24,
    consonants: "ㄴㅍㄹㅅ",
    answer: "넷플릭스",
    hint: "OTT 서비스",
    category: "앱",
  },
  {
    id: 25,
    consonants: "ㅇㅅㅌㄱㄹ",
    answer: "인스타그램",
    hint: "사진 SNS",
    category: "앱",
  },
];

interface WordChainProps {
  onBack: () => void;
}

export default function WordChain({ onBack }: WordChainProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameActive, setIsGameActive] = useState(true);
  const [gameFinished, setGameFinished] = useState(false);

  const currentPuzzle = puzzles[currentIndex];

  const handleSkip = useCallback(() => {
    setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
    if (currentIndex < puzzles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserInput("");
      setShowHint(false);
      setIsCorrect(null);
      setTimeLeft(30);
      setIsGameActive(true);
    } else {
      setGameFinished(true);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isGameActive || gameFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSkip();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, currentIndex, gameFinished, handleSkip]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (userInput.trim() === "") return;

    const isAnswerCorrect = userInput.trim() === currentPuzzle.answer;
    setIsCorrect(isAnswerCorrect);
    setIsGameActive(false);

    if (isAnswerCorrect) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
      setTimeout(() => {
        setIsCorrect(null);
        setIsGameActive(true);
        setUserInput("");
      }, 1500);
    }
  };

  const handleNext = () => {
    if (currentIndex < puzzles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserInput("");
      setShowHint(false);
      setIsCorrect(null);
      setTimeLeft(30);
      setIsGameActive(true);
    } else {
      setGameFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserInput("");
    setShowHint(false);
    setIsCorrect(null);
    setScore({ correct: 0, wrong: 0 });
    setTimeLeft(30);
    setIsGameActive(true);
    setGameFinished(false);
  };

  if (gameFinished) {
    const total = score.correct + score.wrong;
    const percentage =
      total > 0 ? Math.round((score.correct / total) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
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
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
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
                {currentIndex + 1} / {puzzles.length}
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
                🔤 초성 게임
              </h1>
              <p className="text-white/80 text-lg">
                초성을 보고 단어를 맞춰보세요!
              </p>
            </div>

            {/* Timer and Score */}
            <div className="flex justify-center space-x-4">
              <div
                className={`bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border ${
                  timeLeft <= 10
                    ? "border-red-400/50 animate-pulse"
                    : "border-white/20"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-400" : "text-white"}`}
                  >
                    ⏱️ {timeLeft}s
                  </div>
                </div>
              </div>
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

            {/* Puzzle Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 min-h-[350px] flex flex-col justify-center">
              <div className="text-center space-y-6">
                {/* Category Badge */}
                <div className="inline-flex px-4 py-2 bg-white/10 rounded-full text-sm font-semibold text-white/80">
                  {currentPuzzle.category}
                </div>

                {/* Consonants */}
                <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-wider">
                  {currentPuzzle.consonants}
                </div>

                {/* Hint Button */}
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-white/70 hover:text-white text-sm underline transition-colors"
                  >
                    💡 힌트 보기
                  </button>
                ) : (
                  <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 animate-slide-up">
                    <div className="text-yellow-400 font-semibold">
                      힌트: {currentPuzzle.hint}
                    </div>
                  </div>
                )}

                {/* Answer Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={!isGameActive}
                    placeholder="정답을 입력하세요"
                    className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white text-center text-xl placeholder-white/40 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                    autoFocus
                  />

                  {isCorrect === null ? (
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={!isGameActive || userInput.trim() === ""}
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        제출
                      </button>
                      <button
                        type="button"
                        onClick={handleSkip}
                        className="px-6 bg-white/10 text-white py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all"
                      >
                        건너뛰기
                      </button>
                    </div>
                  ) : isCorrect ? (
                    <div className="bg-green-500/20 border-2 border-green-400 rounded-2xl p-6 animate-slide-up">
                      <div className="text-4xl mb-2">🎉</div>
                      <div className="text-2xl font-bold text-white">
                        정답입니다!
                      </div>
                      <div className="text-green-400 mt-2">
                        {currentPuzzle.answer}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-500/20 border-2 border-red-400 rounded-2xl p-6 animate-slide-up">
                      <div className="text-4xl mb-2">😅</div>
                      <div className="text-2xl font-bold text-white">
                        틀렸습니다!
                      </div>
                      <div className="text-red-400 mt-2">다시 시도해보세요</div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";

interface Question {
  id: number;
  text: string;
}

const dailyQuestions: Question[] = [
  { id: 1, text: "아침에 일어나 가장 먼저 하는 일은 무엇인가요?" },
  { id: 2, text: "하루 중 가장 좋아하는 시간은 언제인가요? 그 이유는?" },
  { id: 3, text: "요즘 가장 자주 듣는 노래가 있나요?" },
  { id: 4, text: "나만 알고 싶은 동네 맛집이 있다면?" },
  { id: 5, text: "스트레스받을 때 주로 어떻게 푸나요?" },
  { id: 6, text: "최근에 가장 재미있게 본 영화나 드라마는 무엇인가요?" },
  { id: 7, text: "잠들기 전 꼭 하는 나만의 습관이 있나요?" },
  { id: 8, text: "핸드폰으로 가장 많이 사용하는 앱은 무엇인가요?" },
  { id: 9, text: '"소울 푸드"라고 부를 만한 음식이 있나요?' },
  { id: 10, text: "학창 시절 가장 좋아했던 과목은 무엇이었나요?" },
  { id: 11, text: "단 하루, 다른 사람으로 살 수 있다면 누가 되고 싶나요?" },
  { id: 12, text: "어릴 적 꿈은 무엇이었나요?" },
  { id: 13, text: "최근에 가장 크게 웃었던 기억은 무엇인가요?" },
  { id: 14, text: "나를 동물에 비유한다면 어떤 동물일 것 같나요?" },
  { id: 15, text: "여행 갈 때 꼭 챙기는 물건이 있나요?" },
  { id: 16, text: "갑자기 하루의 휴가가 주어진다면 무엇을 하고 싶나요?" },
  { id: 17, text: "초능력을 가질 수 있다면, 어떤 능력을 원하나요?" },
  { id: 18, text: "가장 좋아하는 계절과 그 이유는 무엇인가요?" },
  { id: 19, text: "내일 지구가 멸망한다면 오늘 무엇을 먹을 건가요?" },
  { id: 20, text: "가장 기억에 남는 여행지는 어디인가요?" },
  { id: 21, text: "아침형 인간인가요, 저녁형 인간인가요?" },
  { id: 22, text: "사소하지만 확실한 행복을 느끼는 순간은 언제인가요?" },
  { id: 23, text: "가장 좋아하는 음료나 카페 메뉴가 있나요?" },
  { id: 24, text: "요리하는 것을 좋아하나요? 자주 하는 요리가 있다면?" },
  { id: 25, text: "인생 책이나 인생 영화라고 할 만한 작품이 있나요?" },
  { id: 26, text: "집에서 가장 좋아하는 공간은 어디인가요?" },
  { id: 27, text: "어떤 향기를 가장 좋아하나요? (음식, 자연, 향수 등)" },
  { id: 28, text: "지금까지 받아본 선물 중 가장 기억에 남는 것은 무엇인가요?" },
  { id: 29, text: "주말에 주로 무엇을 하며 시간을 보내나요?" },
  { id: 30, text: "10년 후의 나는 어떤 모습일 것 같나요?" },
];

const loveQuestions: Question[] = [
  { id: 31, text: "저에 대한 첫인상은 어땠나요?" },
  { id: 32, text: "첫 만남에서 가장 기억에 남는 장면이 있다면?" },
  {
    id: 33,
    text: "사람을 볼 때 가장 먼저, 그리고 중요하게 보는 부분은 무엇인가요?",
  },
  {
    id: 34,
    text: "연애할 때 가장 중요하다고 생각하는 가치 한 가지를 꼽는다면?",
  },
  { id: 35, text: "가장 이상적이라고 생각하는 데이트는 어떤 모습인가요?" },
  { id: 36, text: "이성에게 '심쿵'하게 되는 순간은 언제인가요?" },
  {
    id: 37,
    text: "즉흥적인 데이트와 계획적인 데이트 중 어떤 것을 더 선호하세요?",
  },
  {
    id: 38,
    text: "'친구 같은 편안한 연애' vs '언제나 설레는 연애', 어느 쪽을 더 선호하나요?",
  },
  { id: 39, text: "연락 문제(연락 빈도 등)에 대해 어떻게 생각하세요?" },
  { id: 40, text: "연애가 삶에서 어느 정도의 우선순위를 차지하는 것 같나요?" },
  { id: 41, text: "함께 여행 가고 싶은 곳이 있다면 어디인가요? (국내/해외)" },
  { id: 42, text: "나를 색깔로 표현한다면 무슨 색일 것 같나요? 그 이유는?" },
  {
    id: 43,
    text: "연애하면서 '이것만은 존중해줬으면 좋겠다!' 하는 것이 있나요?",
  },
  { id: 44, text: "저에게 궁금했지만, 아직 물어보지 못한 질문이 있나요?" },
  { id: 45, text: "함께 도전해보고 싶은 새로운 취미가 있나요?" },
  { id: 46, text: "기념일을 챙기는 것에 대해 어떻게 생각하세요?" },
  { id: 47, text: "어떤 칭찬을 들었을 때 기분이 가장 좋은가요?" },
  { id: 48, text: "'사랑'을 한 단어로 정의한다면?" },
  { id: 49, text: "혼자만의 시간이 꼭 필요한 편인가요?" },
  {
    id: 50,
    text: "선물을 받을 때, '실용적인 선물'과 '예쁜 선물' 중 어느 쪽이 더 좋은가요?",
  },
  { id: 51, text: "학창 시절에 어떤 학생이었어요?" },
  { id: 52, text: "가장 자신 있는 요리가 있다면 무엇인가요?" },
  {
    id: 53,
    text: "플레이리스트를 공유한다면, 가장 먼저 들려주고 싶은 노래는?",
  },
  { id: 54, text: "이른바 '남사친/여사친' 문제에 대해 어떻게 생각하세요?" },
  { id: 55, text: "연인과 꼭 해보고 싶은 버킷리스트가 있나요?" },
  {
    id: 56,
    text: "글(카톡, 편지)로 마음을 표현하는 것과 말로 표현하는 것 중 어떤 게 더 편한가요?",
  },
  { id: 57, text: "주변 친구들은 보통 본인을 어떤 사람이라고 표현하나요?" },
  { id: 58, text: "쉬는 날 주로 무엇을 하며 에너지를 얻는 편인가요?" },
  { id: 59, text: "사소하지만 확실하게 행복을 느끼는 순간은 언제인가요?" },
  { id: 60, text: "오늘 대화에서 가장 인상 깊었던 점은 무엇인가요?" },
];

interface CardProps {
  question: Question;
  isFlipped: boolean;
  onFlip: (id: number) => void;
  adminMode: boolean;
  cardType: "daily" | "love";
}

const Card = ({
  question,
  isFlipped,
  onFlip,
  adminMode,
  cardType,
}: CardProps) => {
  const shouldShowBack = adminMode || isFlipped;
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFlip(question.id);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);

    // Only trigger flip if touch movement is minimal (not a scroll)
    if (deltaX < 10 && deltaY < 10) {
      e.preventDefault();
      e.stopPropagation();
      onFlip(question.id);
    }

    setTouchStart(null);
  };

  return (
    <div
      className={`card-container h-48 sm:h-52 md:h-56 ${shouldShowBack ? "flipped" : ""}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFlip(question.id);
        }
      }}
    >
      <div className="card-inner shadow-2xl">
        {/* Card Front */}
        <div
          className={`card-face ${cardType === "daily" ? "card-front-daily" : "card-front-love"}`}
        >
          <div className="question-mark">?</div>
          <div className="card-number-badge">
            <span>#{question.id}</span>
          </div>
        </div>

        {/* Card Back */}
        <div
          className={`card-face ${cardType === "daily" ? "card-back-daily" : "card-back-love"}`}
        >
          <div className="card-question-text">{question.text}</div>
          <div className="card-number-badge">
            <span>#{question.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuestionCardsProps {
  onBack: () => void;
}

export default function QuestionCards({ onBack }: QuestionCardsProps) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [adminMode, setAdminMode] = useState(false);

  const handleCardFlip = (id: number) => {
    if (adminMode) return; // 관리자 모드에서는 개별 카드 플립 비활성화

    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleAdminMode = () => {
    setAdminMode((prev) => !prev);
    // 관리자 모드를 끌 때는 플립된 카드 상태를 유지함
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
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
                <span className="font-medium">메뉴로 돌아가기</span>
              </button>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 drop-shadow-lg">
                💝 질문카드
              </h1>

              {/* Show All Toggle */}
              <div className="flex items-center justify-center space-x-2">
                <span className="text-white/80 text-sm font-medium">
                  모든 질문 보기
                </span>
                <button
                  onClick={toggleAdminMode}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800 ${adminMode ? "bg-purple-500" : "bg-white/20"
                    }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-lg ${adminMode ? "translate-x-5" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-4 relative z-20">
          {/* Daily Questions Section */}
          <section className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                🌱 일상편
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dailyQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Card
                    question={question}
                    isFlipped={flippedCards.has(question.id)}
                    onFlip={handleCardFlip}
                    adminMode={adminMode}
                    cardType="daily"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Love Questions Section */}
          <section>
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                💕 연애편
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-pink-400 to-red-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loveQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${(index + 30) * 0.05}s` }}
                >
                  <Card
                    question={question}
                    isFlipped={flippedCards.has(question.id)}
                    onFlip={handleCardFlip}
                    adminMode={adminMode}
                    cardType="love"
                  />
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-white/60 text-sm">Made by [disj11] with ❤️</p>
        </footer>
      </div>
    </div>
  );
}

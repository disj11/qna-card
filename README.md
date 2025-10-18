# 🎉 아이스브레이킹 게임 모음 (Icebreaker Games)

사람들과 친해지기 위한 다양한 인터랙티브 게임 모음 웹 애플리케이션입니다. 5가지 재미있는 게임으로 어색함을 깨고 즐거운 시간을 만들어보세요!

## ✨ 게임 종류

### 💝 질문카드
- **설명**: 서로를 알아가는 질문 게임
- **특징**: 
  - 일상편 30개 + 연애편 30개 질문
  - 카드 뒤집기 인터랙션
  - 모든 질문 보기 토글 기능
  - 색상별 카테고리 구분

### 🎭 진실 혹은 거짓
- **설명**: 진실을 맞추는 추리 게임
- **특징**:
  - 20개의 진술문 제공
  - 30초 제한시간
  - 정답/오답 실시간 카운트
  - 최종 정답률 통계

### 🎲 랜덤 미션
- **설명**: 재미있는 랜덤 미션 수행
- **특징**:
  - 30개의 다양한 미션
  - 난이도별 구분 (쉬움/보통/어려움)
  - 완료/건너뛰기 선택 가능
  - 미션 사용 통계 추적

### ⚖️ 밸런스 게임
- **설명**: 둘 중 하나를 선택하는 게임
- **특징**:
  - 25개의 선택 질문
  - A/B 옵션 중 선택
  - 개인 선택 통계 표시
  - 이전/다음 문제 자유 이동

### 🔤 초성 게임
- **설명**: 초성으로 단어 맞추기
- **특징**:
  - 25개의 단어 퍼즐
  - 카테고리별 힌트 제공
  - 30초 타이머
  - 즉시 피드백 제공

## 🚀 데모

**Live Demo:** [https://disj11.github.io/qna-card/](https://disj11.github.io/qna-card/)

## 🎮 사용법

1. **메인 메뉴**: 원하는 게임 카드를 선택
2. **게임 플레이**: 각 게임의 규칙에 따라 진행
3. **돌아가기**: 언제든 메뉴로 돌아가기 가능
4. **통계 확인**: 게임별 결과 및 통계 확인

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 3
- **Build Tool**: Vite 7
- **Package Manager**: pnpm
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🏃‍♂️ 빠른 시작

### 사전 요구사항

- Node.js 20 이상
- pnpm (권장) 또는 npm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/disj11/qna-card.git
cd qna-card

# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 브라우저에서 http://localhost:5173/qna-card/ 접속
```

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

## 📦 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

### 자동 배포 설정

1. GitHub 저장소 설정에서 Pages 활성화
2. Source를 "GitHub Actions"로 설정
3. `main` 브랜치에 push하면 자동 배포

## 🏗️ 프로젝트 구조

```
qna-card/
├── public/
│   ├── .nojekyll          # GitHub Pages 설정
│   └── vite.svg
├── src/
│   ├── pages/
│   │   ├── Menu.tsx           # 메인 메뉴
│   │   ├── QuestionCards.tsx  # 질문카드 게임
│   │   ├── TruthOrDare.tsx    # 진실/거짓 게임
│   │   ├── RandomMission.tsx  # 랜덤 미션 게임
│   │   ├── BalanceGame.tsx    # 밸런스 게임
│   │   └── WordChain.tsx      # 초성 게임
│   ├── App.tsx            # 메인 컴포넌트 (라우팅)
│   ├── index.css          # Tailwind + 커스텀 스타일
│   └── main.tsx           # 엔트리 포인트
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions 배포 설정
├── index.html             # HTML 템플릿
├── package.json
├── tailwind.config.js     # Tailwind CSS 설정
├── tsconfig.json          # TypeScript 설정
└── vite.config.ts         # Vite 설정
```

## 🎨 디자인 시스템

### 색상 팔레트

- **질문카드**: 퍼플 → 핑크
- **진실/거짓**: 블루 → 사이안
- **랜덤 미션**: 그린 → 에메랄드
- **밸런스 게임**: 오렌지 → 레드
- **초성 게임**: 인디고 → 퍼플

### 주요 기능

- ✨ **Glass Morphism**: 반투명 배경 + 블러 효과
- 🎭 **3D 카드 플립**: CSS transform 3D 애니메이션
- 📱 **완벽한 모바일 대응**: 터치 최적화 및 반응형 디자인
- 💫 **부드러운 전환**: 페이지 간 자연스러운 전환 효과
- 🎨 **통일된 UI/UX**: 모든 게임의 일관된 디자인 언어

## 🔧 개발

### 개발 가이드라인

- **컴포넌트**: 함수형 컴포넌트 + React Hooks 사용
- **상태 관리**: useState/useCallback을 활용한 로컬 상태 관리
- **스타일링**: Tailwind CSS utility-first 접근법
- **타입 안정성**: TypeScript strict 모드 활성화
- **코드 구조**: 게임별 독립적인 페이지 컴포넌트

### 코드 품질

```bash
# ESLint 검사
pnpm lint

# 타입 검사
tsc -b
```

### 새로운 게임 추가하기

1. `src/pages/` 폴더에 새 게임 컴포넌트 생성
2. `src/pages/Menu.tsx`의 `games` 배열에 게임 정보 추가
3. `src/App.tsx`에 라우팅 로직 추가

예시:
```typescript
// src/App.tsx
if (currentGame === "new-game") {
  return <NewGame onBack={handleBack} />;
}
```

### 게임별 콘텐츠 수정

각 게임의 데이터는 해당 페이지 컴포넌트 상단에 배열로 정의되어 있습니다:
- 질문카드: `dailyQuestions`, `loveQuestions`
- 진실/거짓: `statements`
- 랜덤 미션: `missions`
- 밸런스 게임: `questions`
- 초성 게임: `puzzles`

## 📱 모바일 최적화

- **터치 이벤트**: 스크롤과 탭 동작 명확히 구분
- **반응형 디자인**: 모든 화면 크기 대응
- **성능 최적화**: 최소한의 리렌더링
- **접근성**: 키보드 네비게이션 지원

## 🎯 사용 사례

- 💼 **팀 빌딩**: 새로운 팀원과의 아이스브레이킹
- 🎓 **OT/MT**: 대학 동아리 및 학생회 행사
- 🎉 **파티**: 친구들과의 모임에서 분위기 메이커
- 💑 **소개팅**: 어색함을 깨는 대화 주제
- 👨‍👩‍👧‍👦 **가족 모임**: 세대 간 소통의 다리

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 👨‍💻 개발자

**disj11**
- GitHub: [@disj11](https://github.com/disj11)

## 🙏 기여하기

버그 리포트, 기능 제안, Pull Request 모두 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**더 나은 대화와 즐거운 시간을 위해 만들어진 프로젝트입니다.** ❤️
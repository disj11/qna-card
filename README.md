# 🎉 아이스브레이킹 게임 모음 (Icebreaker Games)

사람들과 친해지기 위한 다양한 인터랙티브 게임 모음 웹 애플리케이션입니다. 5가지 재미있는 게임으로 어색함을 깨고 즐거운 시간을 만들어보세요!

**🎮 NEW! 멀티플레이어 모드 추가**: 이제 친구들과 실시간으로 함께 게임을 즐길 수 있습니다! (P2P 방식)

## ✨ 게임 종류

### 💝 질문카드
- **설명**: 서로를 알아가는 질문 게임
- **특징**: 
  - 일상편 30개 + 연애편 30개 질문
  - 카드 뒤집기 인터랙션
  - 모든 질문 보기 토글 기능
  - 색상별 카테고리 구분
  - **🎮 멀티플레이어 지원**: 턴제 카드 선택 시스템

### 🎭 진실 혹은 거짓
- **설명**: 진실을 맞추는 추리 게임
- **특징**:
  - 20개의 진술문 제공
  - 30초 제한시간
  - 정답/오답 실시간 카운트
  - 최종 정답률 통계
  - **🎮 멀티플레이어 지원**: 플레이어가 직접 질문을 만들고 점수 경쟁

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
  - **🎮 멀티플레이어 지원**: 모두가 선택한 후 결과 공개

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
2. **모드 선택**: 혼자 플레이 또는 친구와 함께 플레이 선택
3. **게임 플레이**: 각 게임의 규칙에 따라 진행
4. **돌아가기**: 언제든 메뉴로 돌아가기 가능
5. **통계 확인**: 게임별 결과 및 통계 확인

### 🎮 멀티플레이어 모드

**지원 게임**: 질문카드, 진실 혹은 거짓, 밸런스 게임

**사용 방법**:
1. 게임 선택 후 "친구와 함께" 모드 선택
2. **호스트**: "방 만들기" → 방 코드를 친구에게 공유
3. **참가자**: "방 참가하기" → 방 코드 입력
4. 모두 준비되면 게임 시작!

**주요 기능**:
- 🔗 P2P 실시간 연결 (서버 불필요)
- 💬 실시간 채팅
- 😊 이모지 반응
- 👥 참가자 상태 표시
- 🎯 턴 기반 시스템

**자세한 내용**: 
- 📖 [멀티플레이어 가이드](MULTIPLAYER_README.md)
- 🔧 [문제 해결 가이드](TROUBLESHOOTING.md)
- 🚀 [로컬 PeerJS 서버 설정](LOCAL_PEERJS_SETUP.md)

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 3
- **Build Tool**: Vite 7
- **Package Manager**: pnpm
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions
- **P2P Library**: PeerJS (WebRTC)

## 🏃‍♂️ 빠른 시작

### 사전 요구사항

- Node.js 20 이상
- pnpm (권장) 또는 npm

### 싱글 플레이어 모드

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

### 🎮 멀티플레이어 모드

멀티플레이어 기능을 사용하려면 로컬 PeerJS 서버가 필요합니다.

#### ⚡ 자동 실행 (가장 쉬움!)

```bash
# PeerJS 서버 + 개발 서버 동시 실행
pnpm run dev:full
```

#### 🔧 수동 실행

**터미널 1 - PeerJS 서버:**
```bash
pnpm run peer
```

출력 확인:
```
🚀 PeerJS Server started on port 9000
📍 Server ready at: http://localhost:9000/
```

**터미널 2 - 개발 서버:**
```bash
pnpm dev
```

#### ✅ 테스트하기

1. 브라우저 1 (일반): `http://localhost:5173/qna-card/` → 방 만들기
2. 브라우저 2 (시크릿): `http://localhost:5173/qna-card/` → 방 참가하기
3. 게임 시작! 🎉

**📖 자세한 가이드:**
- [2분 빠른 시작](QUICK_START.md)
- [멀티플레이어 설정 완료 가이드](README_MULTIPLAYER_SETUP.md)
- [상세 설정 가이드](LOCAL_PEERJS_SETUP.md)

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
│   │   ├── Menu.tsx                    # 메인 메뉴
│   │   ├── QuestionCards.tsx           # 질문카드 (싱글)
│   │   ├── QuestionCardsMultiplayer.tsx # 질문카드 (멀티)
│   │   ├── TruthOrDare.tsx             # 진실/거짓 (싱글)
│   │   ├── TruthOrDareMultiplayer.tsx  # 진실/거짓 (멀티)
│   │   ├── RandomMission.tsx           # 랜덤 미션
│   │   ├── BalanceGame.tsx             # 밸런스 게임 (싱글)
│   │   ├── BalanceGameMultiplayer.tsx  # 밸런스 게임 (멀티)
│   │   └── WordChain.tsx               # 초성 게임
│   ├── components/
│   │   ├── GameModeSelector.tsx   # 모드 선택 화면
│   │   ├── MultiplayerLobby.tsx   # 멀티플레이어 대기실
│   │   └── ChatBox.tsx            # 채팅 컴포넌트
│   ├── multiplayer/
│   │   └── P2PConnection.ts       # P2P 연결 관리
│   ├── hooks/
│   │   └── useMultiplayer.ts      # 멀티플레이어 훅
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
- 🎮 **멀티플레이어**: P2P 실시간 연결 + 채팅 + 이모지 반응

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
- 🌐 **원격 모임**: 멀티플레이어로 온라인에서도 함께!

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 👨‍💻 개발자

**disj11**
- GitHub: [@disj11](https://github.com/disj11)

## 🐛 문제 해결

### 일반적인 문제

**"생성 중..." 에서 멈춤**
- PeerJS 서버가 실행 중인지 확인: `pnpm run peer`
- 포트 9000이 사용 가능한지 확인

**포트 충돌 (EADDRINUSE)**
```bash
# Mac/Linux
lsof -ti:9000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 9000).OwningProcess | Stop-Process -Force
```

**연결 타임아웃**
- PeerJS 서버와 개발 서버가 모두 실행 중인지 확인
- 브라우저 콘솔(F12)에서 에러 확인

### 📚 상세 가이드

- 🚀 [멀티플레이어 설정 완료 가이드](README_MULTIPLAYER_SETUP.md)
- 🔧 [문제 해결 가이드](TROUBLESHOOTING.md)
- 💡 [로컬 PeerJS 서버 설정](LOCAL_PEERJS_SETUP.md)

### 임시 해결책

멀티플레이어가 작동하지 않으면 **"혼자 플레이"** 모드를 사용하세요!

## 🙏 기여하기

버그 리포트, 기능 제안, Pull Request 모두 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**더 나은 대화와 즐거운 시간을 위해 만들어진 프로젝트입니다.** ❤️
# 질문카드 — 천천히 깊어지는 대화 카드

마주 앉은 두 사람을 위한 대화 카드 웹 앱입니다. **워밍업 → 연결 → 진심**, 3단계로 천천히 깊어지는 질문으로 편하게 대화를 이어가 보세요.

## 세 가지 모드

### 한 기기로 함께
폰 하나를 같이 보면서 번갈아 가며 답하는 기본 모드입니다. 진행 상황은 브라우저에 자동 저장되어 다음에 이어서 할 수 있습니다.

### 혼자 미리보기
만나기 전에 어떤 질문이 나올지 레벨별로 미리 훑어볼 수 있는 모드입니다. "모든 질문 보기" 토글로 카드를 한 번에 펼쳐볼 수 있습니다.

### 원거리 함께하기
서로 다른 폰에서 방 코드를 만들어 P2P(WebRTC/PeerJS)로 연결하는 멀티플레이어 모드입니다. 턴제로 카드를 넘기고, 실시간 채팅과 이모지 반응을 주고받을 수 있습니다. 자세한 내용은 [멀티플레이어 가이드](MULTIPLAYER_README.md)를 참고하세요.

## 질문 구성

질문은 3개 레벨로 나뉘며, 각 레벨을 일정 개수 이상 진행해야 다음 레벨이 열립니다.

| 레벨 | 이름 | 설명 |
|---|---|---|
| 1 | 🌱 워밍업 | 부담 없이 답할 수 있는 열린 질문. 대화 초반 어색함을 풀기 위한 단계 |
| 2 | 💕 연결 | 서로를 조금 더 알아가는 질문 |
| 3 | 🔥 진심 | 마음을 나누는 깊은 질문 |

질문/게이트 기준은 `src/data/questionCards.ts`에 정의되어 있습니다.

## 데모

**Live Demo:** [https://cards.slowletters.app/](https://cards.slowletters.app/)

## 기술 스택

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite
- **Routing**: React Router
- **Package Manager**: pnpm
- **Deployment**: Cloudflare Pages (Git 연동)
- **P2P Library**: PeerJS (WebRTC)
- **Test**: Vitest + Testing Library

## 빠른 시작

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

# 개발 서버 시작 (한 기기로 함께 / 혼자 미리보기 모드만 필요할 때)
pnpm dev

# 브라우저에서 http://localhost:5173/ 접속
```

### 원거리 함께하기(멀티플레이어) 모드 개발

원거리 함께하기 모드를 로컬에서 테스트하려면 PeerJS 시그널링 서버가 추가로 필요합니다.

```bash
# PeerJS 서버 + 개발 서버 동시 실행
pnpm run dev:full
```

자세한 설정 및 문제 해결은 [로컬 PeerJS 서버 설정 가이드](LOCAL_PEERJS_SETUP.md)를 참고하세요.

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

### 코드 품질

```bash
# ESLint 검사
pnpm lint

# 타입 검사
tsc -b

# 테스트
pnpm test

# 포맷 검사/적용
pnpm format:check
pnpm format
```

## 배포

이 프로젝트는 **Cloudflare Pages**의 Git 연동으로 배포됩니다. `main` 브랜치에 push하면 Cloudflare가 저장소를 직접 빌드/배포하며, 그 외 브랜치/PR은 자동으로 프리뷰 URL이 생성됩니다. 별도의 GitHub Actions 워크플로우는 없습니다.

프로젝트를 새로 연결할 때 Cloudflare 대시보드(Workers & Pages → Create → Connect to Git)에서 다음 값을 입력하면 됩니다.

| 설정 | 값 |
|---|---|
| Build command | `pnpm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

프로덕션 도메인: `cards.slowletters.app` (Cloudflare 대시보드에서 커스텀 도메인으로 연결).

클라이언트 사이드 라우팅을 위한 SPA 폴백은 `public/_redirects`(`/* /index.html 200`)로 처리됩니다.

## 프로젝트 구조

```
qna-card/
├── public/
│   ├── _redirects         # Cloudflare Pages SPA 라우팅 폴백
│   └── manifest.json      # PWA 매니페스트
├── src/
│   ├── pages/
│   │   ├── Menu.tsx                # 모드 선택 (/start)
│   │   └── NotFound.tsx
│   ├── features/
│   │   ├── landing/                 # 서비스 소개 페이지 (/)
│   │   ├── together/               # 한 기기로 함께 모드
│   │   ├── solo-preview/           # 혼자 미리보기 모드
│   │   ├── multiplayer/            # 원거리 함께하기 모드 (PeerJS 기반)
│   │   │   ├── lib/                # P2P 연결, PeerJS 설정
│   │   │   └── hooks/              # 방/턴/채팅 상태 훅
│   │   └── question-deck/          # 질문 큐 셔플/레벨 게이트 로직
│   ├── components/                 # 공통 UI 컴포넌트 (Button, GlassPanel 등)
│   ├── design-system/              # 디자인 토큰 및 규칙
│   ├── data/
│   │   └── questionCards.ts        # 레벨별 질문 데이터
│   ├── types/                      # 공통 타입 정의
│   ├── App.tsx                     # 라우팅
│   └── main.tsx                    # 엔트리 포인트
├── peer-server.js         # 로컬 개발용 PeerJS 시그널링 서버
├── vite.config.ts
└── tailwind.config.js
```

## 디자인 시스템

- **Glass Morphism**: 반투명 배경 + 블러 효과
- **3D 카드 플립**: CSS transform 3D 애니메이션
- **모바일 최적화**: 터치 최적화 및 반응형 디자인
- **레벨별 포인트 컬러**: 워밍업(그린) → 연결(로즈) → 진심(골드)

컴포넌트 사용 규칙과 토큰 정의는 [`src/design-system/README.md`](src/design-system/README.md)를 참고하세요.

## 개발 가이드라인

- **컴포넌트**: 함수형 컴포넌트 + React Hooks 사용
- **폴더 구조**: 화면/도메인 단위 feature-folder 구조 (`src/features/*`)
- **스타일링**: Tailwind CSS utility-first 접근법
- **타입 안정성**: TypeScript strict 모드 활성화

### 질문 데이터 수정

레벨별 질문은 `src/data/questionCards.ts`의 `level1Questions` / `level2Questions` / `level3Questions` 배열에 정의되어 있습니다. 레벨을 넘어가기 위한 최소 질문 수는 같은 파일의 `levelGateThreshold`에서 조정합니다.

## 사용 사례

- **처음 만난 사이**: 어색함을 깨고 서로를 알아가는 대화 주제
- **원거리 연애**: 멀티플레이어로 떨어져 있어도 함께 대화

## 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 개발자

**disj11**
- GitHub: [@disj11](https://github.com/disj11)

## 기여하기

버그 리포트, 기능 제안, Pull Request 모두 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**더 나은 대화와 즐거운 시간을 위해 만들어진 프로젝트입니다.**

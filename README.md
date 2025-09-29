# 💝 질문카드 (QnA Card)

사람들과 친해지기 위한 인터랙티브 질문카드 웹 애플리케이션입니다. 일상편과 연애편으로 구성된 60개의 질문으로 서로를 더 깊이 알아가는 시간을 만들어보세요.

## ✨ 주요 기능

- 🎲 **카드 뒤집기**: 클릭/터치로 카드를 뒤집어 질문 확인
- 🔄 **모든 질문 보기**: 토글 스위치로 모든 질문을 한번에 표시
- 📱 **완벽한 모바일 대응**: 터치 최적화 및 반응형 디자인
- 🎨 **색상 구분**: 일상편(오렌지/그린), 연애편(핑크/퍼플)
- ⚡ **부드러운 애니메이션**: CSS 3D transform을 활용한 카드 플립 효과
- 💫 **현대적 UI**: Tailwind CSS 기반의 Glass Morphism 디자인

## 🚀 데모

**Live Demo:** [https://disj11.github.io/qna-card/](https://disj11.github.io/qna-card/)

## 📋 질문 구성

### 🌱 일상편 (30개)
일상생활, 취미, 가치관 등에 관한 편안한 질문들로 구성되어 있습니다.

### 💕 연애편 (30개)
연애관, 이상형, 로맨틱한 주제에 관한 질문들로 구성되어 있습니다.

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
git clone https://github.com/your-username/qna-card.git
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

### 수동 배포

```bash
# 빌드 후 dist 폴더를 GitHub Pages에 수동 배포
pnpm build
# dist 폴더 내용을 gh-pages 브랜치에 push
```

## 🎮 사용법

### 기본 사용법

1. **카드 선택**: 일상편 또는 연애편에서 궁금한 카드 클릭
2. **질문 확인**: 카드가 뒤집어지면서 질문 표시
3. **카드 닫기**: 열린 카드를 다시 클릭하면 원래 상태로 복귀

### 모든 질문 보기 모드

1. 상단의 "모든 질문 보기" 토글 활성화
2. 모든 카드가 뒤집어져서 질문들이 한번에 표시
3. 토글을 다시 비활성화하면 이전 상태 유지

### 모바일 사용 팁

- **터치**: 카드를 가볍게 탭하여 뒤집기
- **스크롤**: 자연스럽게 스크롤하면 카드가 의도치 않게 뒤집히지 않음
- **반응형**: 화면 크기에 따라 최적화된 카드 배치

## 🏗️ 프로젝트 구조

```
qna-card/
├── public/
│   ├── .nojekyll          # GitHub Pages 설정
│   └── vite.svg
├── src/
│   ├── App.tsx            # 메인 컴포넌트
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

- **일상편**: 따뜻한 오렌지 (#f59e0b) → 자연스러운 그린 (#10b981)
- **연애편**: 로맨틱한 핑크 (#ec4899) → 신비로운 퍼플 (#8b5cf6)
- **배경**: 그라디언트 (인디고 → 퍼플 → 핑크)

### 애니메이션

- **카드 플립**: 3D rotateY transform (0.6s cubic-bezier)
- **호버 효과**: 부드러운 scale 변환
- **입장 효과**: 스태거드 slide-up 애니메이션

## 🔧 개발

### 개발 가이드라인

- **컴포넌트**: 함수형 컴포넌트 + React Hooks 사용
- **상태 관리**: useState를 활용한 로컬 상태 관리
- **스타일링**: Tailwind CSS utility-first 접근법
- **타입 안정성**: TypeScript strict 모드 활성화

### 코드 품질

```bash
# ESLint 검사
pnpm lint

# 타입 검사
pnpm type-check
```

### 새로운 질문 추가

`src/App.tsx`에서 질문 배열을 수정:

```typescript
const dailyQuestions: Question[] = [
  { id: 31, text: "새로운 일상 질문..." },
  // ...
];

const loveQuestions: Question[] = [
  { id: 61, text: "새로운 연애 질문..." },
  // ...
];
```
## 👨‍💻 개발자

**disj11**
- GitHub: [@disj11](https://github.com/disj11)

---

**더 나은 대화를 위해 만들어진 프로젝트입니다.** ❤️

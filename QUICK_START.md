# 🚀 빠른 시작 가이드

## 멀티플레이어 개발 환경 설정 (2분이면 끝!)

### 📋 요구사항

- Node.js 20 이상
- pnpm (권장) 또는 npm

### 🎯 한 번에 실행하기

```bash
# 1. 저장소 클론
git clone https://github.com/disj11/qna-card.git
cd qna-card

# 2. 의존성 설치
pnpm install

# 3. PeerJS 서버 + 개발 서버 동시 실행
pnpm run dev:full
```

브라우저에서 `http://localhost:5173/qna-card/` 를 열면 끝! 🎉

---

## 🎮 멀티플레이어 테스트하기

### 같은 컴퓨터에서 테스트

1. **첫 번째 브라우저** (일반 모드)
   - 게임 선택 → "친구와 함께" → "방 만들기"
   - 닉네임 입력 후 방 생성
   - 방 코드 복사 (예: `ABC123`)

2. **두 번째 브라우저** (시크릿/프라이빗 모드)
   - 같은 게임 선택 → "친구와 함께" → "방 참가하기"
   - 닉네임 입력
   - 복사한 방 코드 입력

3. **게임 시작**
   - 두 번째 브라우저에서 "준비 완료"
   - 첫 번째 브라우저에서 "게임 시작"

---

## ⚠️ 문제 발생 시

### "생성 중..."에서 멈춤

**원인**: PeerJS 서버가 실행되지 않음

**해결**:
```bash
# 별도 터미널에서 PeerJS 서버 실행
pnpm run peer

# 다른 터미널에서 개발 서버 실행
pnpm dev
```

두 터미널이 모두 실행 중이어야 합니다!

### PeerJS 서버 실행 확인

```bash
Started PeerServer on ::, port: 9000, path: /
```

이 메시지가 보이면 성공!

### 여전히 안 되나요?

```bash
# PeerJS 서버 수동 설치 및 실행
npm install -g peer
peer --port 9000
```

---

## 📚 자세한 가이드

- 🎮 [멀티플레이어 가이드](MULTIPLAYER_README.md)
- 🔧 [문제 해결](TROUBLESHOOTING.md)
- 🚀 [로컬 PeerJS 서버 설정](LOCAL_PEERJS_SETUP.md)

---

## 💡 유용한 명령어

```bash
# 개발 서버만 실행 (싱글 플레이어 테스트)
pnpm dev

# PeerJS 서버만 실행
pnpm run peer

# 둘 다 동시에 실행
pnpm run dev:full

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

---

## 🎯 작동 원리

```
localhost:9000  ← PeerJS 서버 (P2P 신호 서버)
     ↑
     |
localhost:5173  ← Vite 개발 서버 (앱)
```

- **PeerJS 서버**: 플레이어들을 연결해주는 중개자
- **Vite 서버**: 실제 게임 앱

둘 다 실행되어야 멀티플레이어 작동!

---

**Happy Gaming! 🎉**
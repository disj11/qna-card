# 🎮 멀티플레이어 설정 완료 가이드

## ✅ 현재 상태

모든 설정이 완료되었습니다! 이제 멀티플레이어를 테스트할 수 있습니다.

## 🚀 실행 방법

### 방법 1: 한 번에 실행 (권장)

```bash
pnpm run dev:full
```

이 명령어는 다음 두 가지를 동시에 실행합니다:
- PeerJS 서버 (포트 9000)
- Vite 개발 서버 (포트 5173)

### 방법 2: 수동으로 실행

**터미널 1 - PeerJS 서버**
```bash
pnpm run peer
```

출력 확인:
```
🚀 PeerJS Server started on port 9000
📍 Server ready at: http://localhost:9000/

💡 Tip: Keep this terminal open while testing multiplayer
   Press Ctrl+C to stop the server
```

**터미널 2 - 개발 서버**
```bash
pnpm dev
```

출력 확인:
```
VITE v7.1.7  ready in 118 ms

➜  Local:   http://localhost:5173/qna-card/
```

## 🎯 멀티플레이어 테스트

### 같은 컴퓨터에서 테스트하기

1. **브라우저 1 (일반 모드)**
   - `http://localhost:5173/qna-card/` 접속
   - 게임 선택 (예: 질문카드)
   - "친구와 함께" 클릭
   - "방 만들기" 클릭
   - 닉네임 입력 (예: "플레이어1")
   - 방 코드 복사 (예: `ABC123`)

2. **브라우저 2 (시크릿/프라이빗 모드)**
   - `http://localhost:5173/qna-card/` 접속
   - 같은 게임 선택
   - "친구와 함께" 클릭
   - "방 참가하기" 클릭
   - 닉네임 입력 (예: "플레이어2")
   - 방 코드 입력 (`ABC123`)

3. **게임 시작**
   - 브라우저 2에서 "준비 완료" 클릭
   - 브라우저 1에서 "게임 시작" 클릭
   - 게임 즐기기! 🎉

## 🔍 정상 작동 확인

### 브라우저 개발자 도구 (F12)

**Console 탭에서 확인할 로그:**

방 생성 시:
```
Attempting to create room...
Host initialized with ID: ABC123
Room created successfully: ABC123
```

방 참가 시:
```
Attempting to join room: ABC123
Connected to host: ABC123
Successfully connected to room
```

### PeerJS 서버 터미널에서 확인

```
✅ Client connected: ABC123
✅ Client connected: XYZ789
```

## ⚠️ 문제 해결

### 1. "생성 중..." 에서 멈춤

**원인**: PeerJS 서버가 실행되지 않음

**해결**:
```bash
# PeerJS 서버가 실행 중인지 확인
# 터미널에 다음 메시지가 있어야 함:
🚀 PeerJS Server started on port 9000
```

실행되지 않았다면:
```bash
pnpm run peer
```

### 2. 포트 이미 사용 중 (EADDRINUSE)

**오류 메시지**:
```
Error: listen EADDRINUSE: address already in use :::9000
```

**해결**:
```bash
# Mac/Linux
lsof -ti:9000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 9000).OwningProcess | Stop-Process -Force

# 또는 다른 포트 사용
# peer-server.js 파일에서 port: 9000을 port: 9001로 변경
# P2PConnection.ts에서도 동일하게 변경
```

### 3. 연결이 안 됨

**체크리스트**:
- [ ] PeerJS 서버 실행 중? (`pnpm run peer`)
- [ ] 개발 서버 실행 중? (`pnpm dev`)
- [ ] 방 코드 정확히 입력? (대소문자 구분 없음)
- [ ] 같은 네트워크? (localhost 테스트 시)

**디버깅**:
```bash
# 브라우저 개발자 도구 (F12) 열기
# Console 탭에서 에러 확인
# Network 탭에서 WebSocket 연결 확인
```

### 4. "Connection timeout" 오류

**원인**: PeerJS 서버에 연결할 수 없음

**확인사항**:
1. PeerJS 서버가 `localhost:9000`에서 실행 중인가?
2. 방화벽이 차단하고 있지 않은가?
3. `src/multiplayer/P2PConnection.ts`의 설정이 맞는가?

```typescript
// 개발 환경 설정 확인
const isDev = window.location.hostname === "localhost" || 
              window.location.hostname === "127.0.0.1";

// 로컬 개발 시
{
  host: "localhost",
  port: 9000,
  path: "/",
  secure: false,
  ...
}
```

## 🌐 다른 기기에서 접속하기

같은 네트워크의 다른 기기(스마트폰, 다른 컴퓨터)에서 테스트하려면:

### 1. IP 주소 확인

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```cmd
ipconfig
```

예시: `192.168.0.100`

### 2. PeerJS 서버 설정 변경

`peer-server.js` 수정:
```javascript
const server = PeerServer({
  port: 9000,
  path: "/",
  allow_discovery: true,
  host: "0.0.0.0"  // 모든 인터페이스에서 수신
});
```

### 3. 앱 코드 수정

`src/multiplayer/P2PConnection.ts`에서:
```typescript
const isDev = window.location.hostname === "localhost" || 
              window.location.hostname === "127.0.0.1" ||
              window.location.hostname === "192.168.0.100";  // 내 IP 추가

const peerConfig = isDev ? {
  host: "192.168.0.100",  // 내 IP 주소
  port: 9000,
  path: "/",
  secure: false,
  ...
} : { ... };
```

### 4. 다른 기기에서 접속

```
http://192.168.0.100:5173/qna-card/
```

## 💡 개발 팁

### 빠른 재시작

```bash
# Ctrl+C로 중지 후
pnpm run dev:full
```

### 로그 확인

**PeerJS 서버 터미널**: 연결/해제 이벤트
```
✅ Client connected: ABC123
❌ Client disconnected: ABC123
```

**브라우저 콘솔**: 상세 디버그 로그
```javascript
// 개발자 도구 (F12) → Console
```

### 포트 변경

기본 포트가 충돌할 경우:

1. `peer-server.js`: `port: 9000` → `port: 9001`
2. `src/multiplayer/P2PConnection.ts`: `port: 9000` → `port: 9001`

## 📚 추가 문서

- **[QUICK_START.md](QUICK_START.md)** - 2분 빠른 시작
- **[LOCAL_PEERJS_SETUP.md](LOCAL_PEERJS_SETUP.md)** - 상세 설정 가이드
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - 문제 해결 가이드
- **[MULTIPLAYER_README.md](MULTIPLAYER_README.md)** - 멀티플레이어 기능 설명

## 🎯 다음 단계

1. ✅ 로컬에서 테스트 완료
2. 🌐 같은 네트워크에서 친구와 테스트
3. 🚀 프로덕션 배포 (GitHub Pages 등)

## 🆘 여전히 문제가 있나요?

### GitHub Issues

다음 정보와 함께 이슈를 등록해주세요:

1. **PeerJS 서버 로그** (터미널 출력)
2. **브라우저 콘솔 로그** (F12 → Console)
3. **운영체제 및 브라우저 버전**
4. **재현 단계**

### 임시 해결책

멀티플레이어가 작동하지 않으면:
- **"혼자 플레이"** 모드 사용
- 모든 게임을 정상적으로 즐길 수 있습니다
- 네트워크 연결 불필요

---

## ✨ 성공 메시지

모든 것이 정상 작동하면 다음을 볼 수 있습니다:

**터미널**:
```
🚀 PeerJS Server started on port 9000
📍 Server ready at: http://localhost:9000/

VITE v7.1.7  ready in 118 ms
➜  Local:   http://localhost:5173/qna-card/
```

**브라우저**:
- 방이 정상적으로 생성됨
- 방 코드가 표시됨 (예: `ABC123`)
- 참가자가 입장하면 대기실에 표시됨
- 게임이 원활하게 진행됨

---

**즐거운 게임 되세요! 🎉**
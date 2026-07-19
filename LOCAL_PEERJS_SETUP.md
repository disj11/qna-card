# 🚀 PeerJS 로컬 개발 & 문제 해결 가이드

"원거리 함께하기" 모드는 P2P(WebRTC) 연결 전에 서로의 위치를 알려주는 시그널링 서버(PeerJS 서버)가 필요합니다. 프로덕션에서는 공개 PeerJS 서버(`0.peerjs.com`)를 사용하고(`src/features/multiplayer/lib/peerConfig.ts`), 로컬 개발에서는 직접 서버를 띄워 테스트합니다.

## 📦 2분 빠른 시작

```bash
# 저장소 클론 & 설치
git clone https://github.com/disj11/qna-card.git
cd qna-card
pnpm install

# PeerJS 서버 + 개발 서버 동시 실행
pnpm run dev:full
```

브라우저에서 `http://localhost:5173/qna-card/` 를 열면 끝입니다. `localhost`/`127.0.0.1`에서 접속하면 `peerConfig.ts`가 자동으로 로컬 PeerJS 서버(`localhost:9000`)를 사용하도록 분기합니다.

## 🎮 로컬에서 멀티플레이어 테스트하기

같은 컴퓨터의 두 브라우저(예: 일반 창 + 시크릿 창)로 테스트할 수 있습니다.

1. **브라우저 1 (일반 모드)**: 메뉴 → "원거리 함께하기" → "방 만들기" → 닉네임 입력 → 방 코드 복사 (예: `ABC123`)
2. **브라우저 2 (시크릿 모드)**: 메뉴 → "원거리 함께하기" → "방 참가하기" → 닉네임과 방 코드 입력
3. 브라우저 2에서 "준비 완료" → 브라우저 1에서 "게임 시작"

## 🔧 수동으로 실행하기

`dev:full` 대신 서버를 따로 띄울 수도 있습니다.

**터미널 1 — PeerJS 서버 (`peer-server.js`, 포트 9000)**
```bash
pnpm run peer
```
출력 확인:
```
🚀 PeerJS Server started on port 9000
📍 Server ready at: http://localhost:9000/
```

**터미널 2 — 개발 서버**
```bash
pnpm dev
```
출력 확인:
```
➜  Local:   http://localhost:5173/qna-card/
```

두 프로세스가 모두 실행 중이어야 멀티플레이어가 동작합니다.

## 🌐 같은 네트워크의 다른 기기에서 접속하기

친구의 폰이나 다른 컴퓨터에서 접속하려면:

1. **PeerJS 서버를 모든 인터페이스에서 수신하도록 실행**

   `peer-server.js`를 직접 수정하거나 CLI 옵션을 사용합니다.
   ```bash
   npx peer --port 9000 --host 0.0.0.0
   ```

2. **내 IP 주소 확인**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Windows
   ipconfig
   ```
   예: `192.168.1.100`

3. **앱 환경 변수로 로컬 PeerJS 호스트 지정**

   `peerConfig.ts`는 `VITE_PEER_HOST` / `VITE_PEER_PORT` / `VITE_PEER_PATH` 환경 변수를 읽습니다. `.env.local`에 다음을 추가하세요.
   ```
   VITE_PEER_HOST=192.168.1.100
   VITE_PEER_PORT=9000
   ```

4. **다른 기기에서 접속**
   ```
   http://192.168.1.100:5173/qna-card/
   ```

## 🌍 프로덕션 시그널링 서버

기본값은 공개 PeerJS 서버(`0.peerjs.com`, `VITE_PEER_PROD_HOST`로 재정의 가능)입니다. 이 서버는 다음과 같은 한계가 있습니다.

- 일일 사용량 제한이 있을 수 있음
- 가끔 불안정하거나 다운될 수 있음

트래픽이 늘거나 안정성이 중요해지면, `peer` npm 패키지([peers/peerjs-server](https://github.com/peers/peerjs-server))를 Render, Railway, Fly.io 등에 별도 배포하고 `VITE_PEER_PROD_HOST`(및 필요시 `VITE_PEER_PORT`)를 해당 서버로 지정하면 됩니다.

## 🐛 문제 해결

### "생성 중..."에서 멈춤 (로컬 개발)

**원인**: PeerJS 서버(`pnpm run peer`)가 실행되지 않음

**해결**: 두 터미널(PeerJS 서버, 개발 서버)이 모두 실행 중인지 확인하세요.

### "생성 중..."에서 멈춤 (배포된 프로덕션 사이트)

**원인**: 공개 PeerJS 서버(`0.peerjs.com`)에 연결할 수 없음, 또는 네트워크 방화벽이 WebRTC를 차단

**확인**:
1. F12 → Console에서 에러 메시지 확인 (`Peer error: ...`, `Connection timeout` 등)
2. 다른 네트워크(모바일 데이터 등)에서 재시도
3. 회사/학교 네트워크는 WebRTC를 차단하는 경우가 있습니다

### 포트 충돌 (`EADDRINUSE`)

```bash
# Mac/Linux
lsof -ti:9000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 9000).OwningProcess | Stop-Process -Force
```

또는 다른 포트를 사용하세요 (`peer-server.js`의 `port`와 `.env.local`의 `VITE_PEER_PORT`를 함께 변경).

### 방 참가 실패 / 연결 끊김

- 방 코드를 다시 확인하세요 (대소문자 구분 없음)
- 호스트가 방을 나가면 게임이 종료됩니다 — 새로운 방을 만들어 다시 시작하세요
- 페이지를 새로고침한 후 재시도하세요

### 디버깅 팁

- **브라우저 콘솔**: F12 → Console에서 `Host initialized with ID: ...`, `Connected to host: ...` 등의 로그 확인
- **WebSocket 연결**: F12 → Network → WS 필터로 PeerJS 서버와의 연결 확인
- **WebRTC 통계**: Chrome에서 `chrome://webrtc-internals/`

### 그래도 안 될 때

멀티플레이어가 계속 작동하지 않으면 **"한 기기로 함께"** 또는 **"혼자 미리보기"** 모드를 사용하세요 — 네트워크 연결 없이 모든 질문을 동일하게 볼 수 있습니다.

## 📚 참고 자료

- [PeerJS 공식 문서](https://peerjs.com/docs/)
- [PeerJS 서버 GitHub](https://github.com/peers/peerjs-server)
- [WebRTC 가이드](https://webrtc.org/getting-started/overview)

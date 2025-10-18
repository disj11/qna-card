# 🚀 로컬 PeerJS 서버 설정 가이드

멀티플레이어 기능이 작동하지 않나요? 로컬 PeerJS 서버를 직접 실행하여 문제를 해결할 수 있습니다!

## 왜 로컬 서버가 필요한가요?

공개 PeerJS 서버(`0.peerjs.com`)는:
- ❌ 일일 사용량 제한이 있음
- ❌ 불안정할 수 있음
- ❌ 때때로 다운됨

로컬 서버는:
- ✅ 제한 없음
- ✅ 안정적
- ✅ 빠른 속도
- ✅ 완전히 무료

## 📦 설치 방법

### 옵션 1: 전역 설치 (권장)

```bash
# PeerJS 서버 전역 설치
npm install -g peer

# 또는 yarn 사용
yarn global add peer

# 또는 pnpm 사용
pnpm add -g peer
```

### 옵션 2: npx 사용 (설치 불필요)

설치 없이 바로 실행:
```bash
npx peer
```

## 🎮 서버 실행

### 기본 실행

```bash
# 기본 포트(9000)로 실행
peer

# 또는 npx 사용
npx peer
```

출력 예시:
```
Started PeerServer on ::, port: 9000, path: / (v. 1.0.0)
```

### 커스텀 포트 사용

```bash
# 포트 3001로 실행
peer --port 3001

# 특정 경로 사용
peer --port 9000 --path /myapp

# 키 설정
peer --port 9000 --key peerjs
```

## 🔧 앱 설정 변경

로컬 서버를 실행한 후, 앱 코드를 수정해야 합니다:

### 1. 파일 열기
```
qna-card/src/multiplayer/P2PConnection.ts
```

### 2. 코드 수정

**현재 코드 (기본 설정):**
```typescript
this.peer = new Peer(peerId, {
  debug: 2,
  config: {
    iceServers: [...]
  }
});
```

**로컬 서버 사용 (변경):**
```typescript
this.peer = new Peer(peerId, {
  host: "localhost",    // 로컬 호스트
  port: 9000,          // PeerJS 서버 포트
  path: "/",           // 서버 경로
  secure: false,       // 로컬은 HTTP 사용
  debug: 2,
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  },
});
```

### 3. 두 곳 모두 수정

`initializeAsHost`와 `initializeAsClient` 메서드 둘 다 동일하게 수정하세요.

## 🚀 실행 순서

### 터미널 1: PeerJS 서버
```bash
peer --port 9000
```

서버가 실행되면 그대로 두세요.

### 터미널 2: 개발 서버
```bash
cd qna-card
pnpm dev
```

## ✅ 확인 방법

1. 브라우저에서 개발자 도구(F12) 열기
2. Console 탭 확인
3. 방 만들기 시도

**성공 메시지:**
```
PeerJS: Connection established!
Host initialized with ID: ABC123
```

**실패 메시지:**
```
Peer error: Error: Could not connect to server
```

## 🌐 네트워크에서 사용하기

같은 네트워크의 다른 기기에서 접속하려면:

### 1. 서버를 모든 인터페이스에서 수신하도록 실행
```bash
peer --port 9000 --host 0.0.0.0
```

### 2. 내 IP 주소 확인

**Windows:**
```bash
ipconfig
```

**Mac/Linux:**
```bash
ifconfig
# 또는
ip addr show
```

예: `192.168.1.100`

### 3. 코드에서 IP 사용
```typescript
this.peer = new Peer(peerId, {
  host: "192.168.1.100",  // 내 IP 주소
  port: 9000,
  path: "/",
  secure: false,
  // ...
});
```

### 4. 친구도 같은 설정 사용

친구의 브라우저에서 `http://192.168.1.100:5173/qna-card/` 접속

## 📱 프로덕션 배포

### 무료 PeerJS 서버 호스팅 옵션

1. **Heroku** (무료 tier)
   ```bash
   git clone https://github.com/peers/peerjs-server.git
   cd peerjs-server
   heroku create
   git push heroku master
   ```

2. **Render.com** (무료)
   - PeerJS 서버를 Docker로 배포
   - 자동 HTTPS 제공

3. **Railway** (무료 tier)
   - Node.js 앱으로 배포
   - 간단한 설정

### 환경 변수 사용

프로덕션과 개발을 구분하기 위해:

```typescript
// src/multiplayer/P2PConnection.ts
const isDev = import.meta.env.DEV;

this.peer = new Peer(peerId, {
  host: isDev ? "localhost" : "your-peerjs-server.com",
  port: isDev ? 9000 : 443,
  path: "/",
  secure: !isDev,
  // ...
});
```

## 🔍 문제 해결

### 서버가 시작되지 않음

**오류: `Port 9000 already in use`**

다른 포트 사용:
```bash
peer --port 9001
```

### 여전히 연결 안 됨

1. **방화벽 확인**
   - 포트 9000이 열려있는지 확인
   - Windows: 방화벽 설정에서 허용

2. **서버 로그 확인**
   - PeerJS 서버 터미널에서 연결 시도 확인
   - 에러 메시지 확인

3. **브라우저 콘솔 확인**
   - F12 → Console
   - 상세한 에러 메시지 확인

### localhost vs 127.0.0.1

둘 다 시도해보세요:
```typescript
host: "localhost"  // 또는
host: "127.0.0.1"
```

## 💡 추가 팁

### 1. PM2로 서버 데몬화 (항상 실행)

```bash
# PM2 설치
npm install -g pm2

# PeerJS 서버를 PM2로 실행
pm2 start peer --name peerjs-server -- --port 9000

# 부팅 시 자동 시작
pm2 startup
pm2 save
```

### 2. 여러 서버 실행

테스트를 위해 여러 포트에서 실행:
```bash
peer --port 9000 &
peer --port 9001 &
peer --port 9002 &
```

### 3. 로그 확인

상세 로그:
```bash
peer --port 9000 --log debug
```

## 🎯 빠른 테스트

전체 프로세스 테스트:

```bash
# 1. PeerJS 서버 시작
peer --port 9000

# 2. 새 터미널에서 앱 실행
cd qna-card
pnpm dev

# 3. 브라우저에서 테스트
# - 일반 모드: 방 만들기
# - 시크릿 모드: 방 참가하기
```

## 📚 참고 자료

- [PeerJS 공식 문서](https://peerjs.com/docs/)
- [PeerJS 서버 GitHub](https://github.com/peers/peerjs-server)
- [WebRTC 가이드](https://webrtc.org/getting-started/overview)

## 🆘 여전히 안 되나요?

1. GitHub Issues에 다음 정보와 함께 문의:
   - PeerJS 서버 터미널 로그
   - 브라우저 콘솔 에러
   - 운영체제 및 브라우저 버전

2. 임시 해결책: **"혼자 플레이"** 모드 사용
   - 멀티플레이어 없이도 모든 게임 즐길 수 있습니다!

---

**Happy Gaming! 🎮**
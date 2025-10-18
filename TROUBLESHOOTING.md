# 🔧 문제 해결 가이드 (Troubleshooting)

## 멀티플레이어 연결 문제

### 증상: "생성 중..." 단계에서 멈춤

방을 만들 때 "생성 중..." 상태에서 진행이 안 되는 경우:

#### 원인
- PeerJS 클라우드 서버(`0.peerjs.com`)에 연결할 수 없음
- 네트워크 방화벽이 WebRTC 연결을 차단
- 브라우저가 WebRTC를 지원하지 않음

#### 해결 방법

##### 방법 1: 브라우저 콘솔 확인 (개발자 도구)

1. **F12** 키를 눌러 개발자 도구 열기
2. **Console** 탭으로 이동
3. 에러 메시지 확인:
   ```
   Peer error: Error: Could not connect to server
   ```
   또는
   ```
   Connection timeout - PeerJS server unreachable
   ```

##### 방법 2: 대체 PeerJS 서버 사용

현재 앱은 공개 PeerJS 서버(`0.peerjs.com`)를 사용합니다. 이 서버가 응답하지 않으면 다음 옵션을 시도하세요:

**Option A: 로컬 PeerJS 서버 실행**

```bash
# PeerJS 서버 설치
npm install -g peer

# 서버 실행 (기본 포트: 9000)
peerjs --port 9000 --key peerjs

# 다른 터미널에서 앱 실행
cd qna-card
pnpm dev
```

그 후 코드를 수정:
```typescript
// src/multiplayer/P2PConnection.ts
this.peer = new Peer(peerId, {
  host: "localhost",
  port: 9000,
  path: "/",
  secure: false,  // 로컬 개발 시
  config: { ... }
});
```

**Option B: 다른 공개 PeerJS 서버 사용**

일부 공개 서버 옵션:
- `0.peerjs.com` (기본)
- 자체 서버 구축 (Heroku, AWS 등)

##### 방법 3: 브라우저 및 네트워크 확인

1. **지원 브라우저 사용**
   - Chrome (권장)
   - Firefox
   - Edge
   - Safari 14+

2. **HTTPS 사용**
   - WebRTC는 HTTPS에서 더 잘 작동
   - 프로덕션 환경: `https://your-domain.com`
   - 개발 환경: `http://localhost`는 허용됨

3. **네트워크 설정**
   - 회사/학교 네트워크: VPN이나 방화벽이 WebRTC를 차단할 수 있음
   - 모바일 데이터로 시도해보기
   - 다른 네트워크에서 테스트

##### 방법 4: 브라우저 권한 확인

WebRTC는 다음 권한이 필요할 수 있습니다:
- 카메라/마이크 권한 (현재 앱은 사용 안 함)
- 네트워크 접근 권한

브라우저 설정에서 확인:
- Chrome: `chrome://settings/content`
- Firefox: `about:preferences#privacy`

---

## 일반적인 문제

### 1. 방 참가 실패

**증상**: "방 참가에 실패했습니다" 에러 메시지

**원인**:
- 잘못된 방 코드 입력
- 호스트가 방을 나감
- 네트워크 연결 문제

**해결**:
- 방 코드 재확인 (6자리 영숫자)
- 호스트에게 방이 여전히 열려있는지 확인
- 페이지 새로고침 후 재시도

### 2. 연결 끊김

**증상**: 게임 중 "연결이 끊어졌습니다" 메시지

**원인**:
- 네트워크 불안정
- 호스트 나감
- 브라우저 탭 비활성화

**해결**:
- 안정적인 인터넷 연결 사용
- 호스트는 게임 중 브라우저 탭 유지
- 재연결 시도 (페이지 새로고침)

### 3. 느린 응답

**증상**: 메시지나 게임 상태 업데이트 지연

**원인**:
- 네트워크 지연
- 너무 많은 참가자 (권장: 2-6명)
- 느린 인터넷 연결

**해결**:
- 참가자 수 제한
- 더 빠른 인터넷 연결 사용
- 불필요한 백그라운드 앱 종료

---

## 디버깅 팁

### 개발자 도구 활용

**Chrome DevTools**:
```
F12 → Console 탭
```

유용한 로그:
```
Host initialized with ID: ABC123
Connected to host: ABC123
Received message: {...}
```

### 네트워크 상태 확인

**Chrome**:
```
F12 → Network 탭 → WS (WebSocket) 필터
```

PeerJS 서버와의 WebSocket 연결 확인 가능

### WebRTC 통계

**Chrome**:
```
chrome://webrtc-internals/
```

실시간 WebRTC 연결 상태와 통계 확인

---

## 알려진 제한사항

1. **참가자 수**: 최대 10명 권장 (P2P 특성상)
2. **브라우저**: 최신 버전 사용 권장
3. **네트워크**: NAT/방화벽 환경에서 제한적
4. **모바일**: 백그라운드 전환 시 연결 끊김 가능

---

## 임시 해결책: 로컬 테스트

PeerJS 서버 연결이 계속 실패하면, 같은 디바이스에서 테스트:

1. **첫 번째 브라우저**: 일반 모드로 방 생성
2. **두 번째 브라우저**: 시크릿 모드로 방 참가
3. localhost에서는 서버 연결 없이도 작동 가능

---

## 여전히 문제가 있나요?

### 이슈 리포트

GitHub Issues에 다음 정보와 함께 문제를 제보해주세요:

1. **브라우저 정보**
   - 종류 및 버전
   - 예: Chrome 120.0.6099.109

2. **콘솔 에러 로그**
   - F12 → Console에서 복사
   - 빨간색 에러 메시지

3. **재현 단계**
   - 어떤 동작을 했을 때 문제가 발생했나요?

4. **네트워크 환경**
   - 가정용 인터넷 / 회사 네트워크 / 모바일 데이터
   - VPN 사용 여부

### 대안: 싱글 플레이어 모드

멀티플레이어가 작동하지 않으면:
- **"혼자 플레이"** 모드로 게임 즐기기
- 모든 기능을 동일하게 사용 가능
- 네트워크 연결 불필요

---

## 참고 자료

- [PeerJS 공식 문서](https://peerjs.com/docs/)
- [WebRTC 브라우저 지원](https://caniuse.com/rtcpeerconnection)
- [NAT 통과 가이드](https://webrtc.org/getting-started/turn-server)

---

**도움이 필요하신가요?** GitHub Issues 또는 Discussion에서 질문해주세요! 🙋‍♂️
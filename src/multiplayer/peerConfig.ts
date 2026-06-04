import type Peer from "peerjs";

type PeerOptions = ConstructorParameters<typeof Peer>[1];

const localHost = import.meta.env.VITE_PEER_HOST ?? "localhost";
const localPort = Number(import.meta.env.VITE_PEER_PORT ?? 9000);
const localPath = import.meta.env.VITE_PEER_PATH ?? "/";
const productionHost = import.meta.env.VITE_PEER_PROD_HOST ?? "0.peerjs.com";

const iceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" },
];

export const getPeerConfig = (): PeerOptions => {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocal) {
    return {
      host: localHost,
      port: localPort,
      path: localPath,
      secure: false,
      debug: 2,
      config: {
        iceServers: iceServers.slice(0, 2),
      },
    };
  }

  return {
    host: productionHost,
    secure: true,
    port: 443,
    debug: 2,
    config: {
      iceServers,
    },
  };
};

export const describePeerError = (error: unknown) => {
  const rawMessage =
    error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

  if (/timeout|unreachable/i.test(rawMessage)) {
    return "연결 시간이 초과되었습니다. 로컬 개발 중이라면 PeerJS 서버가 실행 중인지 확인해 주세요.";
  }

  if (/host|connect|peer/i.test(rawMessage)) {
    return "방에 연결하지 못했습니다. 방 코드와 네트워크 상태를 확인해 주세요.";
  }

  return rawMessage;
};

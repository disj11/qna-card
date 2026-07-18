import { useCallback, useEffect, useRef, useState } from "react";
import {
  P2PConnection,
  type DisconnectHandler,
  type GameMessage,
  type MessageHandler,
  type Player,
} from "../lib/P2PConnection";
import { describePeerError } from "../lib/peerConfig";

interface RoomConnectionHandlers {
  onMessage: MessageHandler;
  onDisconnect: DisconnectHandler;
  onHostReady: (player: Player) => void;
  onClientReady: (player: Player) => void;
}

const noopHandlers: RoomConnectionHandlers = {
  onMessage: () => {},
  onDisconnect: () => {},
  onHostReady: () => {},
  onClientReady: () => {},
};

/**
 * P2P 연결 수명주기(방 생성/참가/퇴장)와 로컬 플레이어 정보를 담당하는 훅.
 * 메시지/연결 이벤트가 도착했을 때 무엇을 할지는 setHandlers로 주입받는다 —
 * 훅이 생성되는 시점에는 아직 다른 훅(roster/chat/turn) 인스턴스가 없기 때문.
 */
export function useRoomConnection() {
  const connectionRef = useRef<P2PConnection | null>(null);
  const handlersRef = useRef<RoomConnectionHandlers>(noopHandlers);

  const [isConnected, setIsConnected] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [localPlayer, setLocalPlayer] = useState<Player | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setHandlers = useCallback((handlers: RoomConnectionHandlers) => {
    handlersRef.current = handlers;
  }, []);

  const sendMessage = useCallback((message: GameMessage) => {
    connectionRef.current?.sendMessage(message);
  }, []);

  const createRoom = useCallback(
    async (nickname: string, requestedRoomId?: string) => {
      setIsConnecting(true);
      setError(null);

      try {
        const connection = new P2PConnection();
        connectionRef.current = connection;

        const generatedRoomId = await connection.initializeAsHost(
          nickname,
          requestedRoomId
        );
        const player = connection.getLocalPlayer();

        if (player) {
          setIsConnected(true);
          setIsHost(true);
          setRoomId(generatedRoomId);
          setLocalPlayer(player);
          handlersRef.current.onHostReady(player);
        }

        connection.onMessage((message) =>
          handlersRef.current.onMessage(message)
        );
        connection.onDisconnect((playerId) =>
          handlersRef.current.onDisconnect(playerId)
        );

        return true;
      } catch (err) {
        console.error("Error creating room:", err);
        setError(
          `방 생성에 실패했습니다: ${describePeerError(err)}\n\n잠시 후 다시 시도해주세요.`
        );
        connectionRef.current?.disconnect();
        connectionRef.current = null;
        return false;
      } finally {
        setIsConnecting(false);
      }
    },
    []
  );

  const joinRoom = useCallback(async (nickname: string, hostRoomId: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      const connection = new P2PConnection();
      connectionRef.current = connection;

      await connection.initializeAsClient(nickname, hostRoomId);
      const player = connection.getLocalPlayer();

      if (player) {
        setIsConnected(true);
        setIsHost(false);
        setRoomId(hostRoomId);
        setLocalPlayer(player);
        handlersRef.current.onClientReady(player);
      }

      connection.onMessage((message) => handlersRef.current.onMessage(message));
      connection.onDisconnect((playerId) =>
        handlersRef.current.onDisconnect(playerId)
      );

      return true;
    } catch (err) {
      console.error("Error joining room:", err);
      setError(
        `방 참가에 실패했습니다: ${describePeerError(err)}\n\n방 코드를 확인하거나 잠시 후 다시 시도해주세요.`
      );
      connectionRef.current?.disconnect();
      connectionRef.current = null;
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const setReady = useCallback(
    (isReady: boolean) => {
      if (!localPlayer) return;
      sendMessage({
        type: "player-ready",
        data: { playerId: localPlayer.id, isReady },
        from: localPlayer.id,
        timestamp: Date.now(),
      });
      setLocalPlayer((prev) => (prev ? { ...prev, isReady } : prev));
    },
    [localPlayer, sendMessage]
  );

  const leaveRoom = useCallback(() => {
    if (!localPlayer) return;

    sendMessage({
      type: "player-leave",
      data: { playerId: localPlayer.id, nickname: localPlayer.nickname },
      from: localPlayer.id,
      timestamp: Date.now(),
    });

    connectionRef.current?.disconnect();
    connectionRef.current = null;

    setIsConnected(false);
    setIsHost(false);
    setRoomId(null);
    setLocalPlayer(null);
  }, [localPlayer, sendMessage]);

  // 언마운트 시 연결 정리
  useEffect(() => {
    return () => {
      connectionRef.current?.disconnect();
    };
  }, []);

  return {
    isConnected,
    isHost,
    roomId,
    localPlayer,
    isConnecting,
    error,
    sendMessage,
    setHandlers,
    createRoom,
    joinRoom,
    leaveRoom,
    setReady,
  };
}

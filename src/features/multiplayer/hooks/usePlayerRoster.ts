import { useCallback, useEffect, useState } from "react";
import type { GameMessage, Player } from "../lib/P2PConnection";

interface UsePlayerRosterParams {
  sendMessage: (message: GameMessage) => void;
  isHost: boolean;
  isConnected: boolean;
  localPlayer: Player | null;
  addSystemMessage: (message: string) => void;
}

/** 참가자 목록(players 맵)과 입장/퇴장/준비 상태 동기화를 담당하는 훅 */
export function usePlayerRoster({
  sendMessage,
  isHost,
  isConnected,
  localPlayer,
  addSystemMessage,
}: UsePlayerRosterParams) {
  const [players, setPlayers] = useState<Map<string, Player>>(new Map());

  // 호스트일 때만 참가자 목록이 바뀔 때마다 전체 클라이언트에 브로드캐스트
  useEffect(() => {
    if (!isHost || !isConnected) return;
    sendMessage({
      type: "player-list",
      data: Array.from(players.values()),
      from: localPlayer?.id || "",
      timestamp: Date.now(),
    });
  }, [players, isHost, isConnected, localPlayer, sendMessage]);

  /** 방을 만든 로컬 플레이어 자신을 참가자 목록에 등록 */
  const addSelf = useCallback((player: Player) => {
    setPlayers((prev) => {
      const next = new Map(prev);
      next.set(player.id, player);
      return next;
    });
  }, []);

  const handlePlayerJoin = useCallback(
    (message: GameMessage) => {
      // 새 참가자 등록은 호스트만 처리하고, 이후 player-list로 전체에 전파함
      if (!isHost) return;

      const newPlayer = message.data as Player;
      if (players.has(newPlayer.id)) return;

      setPlayers((prev) => {
        const next = new Map(prev);
        next.set(newPlayer.id, newPlayer);
        return next;
      });
      addSystemMessage(`${newPlayer.nickname}님이 입장했습니다.`);
    },
    [isHost, players, addSystemMessage]
  );

  const handlePlayerList = useCallback((message: GameMessage) => {
    const playerList = message.data as Player[];
    setPlayers(() => {
      const next = new Map<string, Player>();
      playerList.forEach((player) => next.set(player.id, player));
      return next;
    });
  }, []);

  const handlePlayerLeave = useCallback(
    (message: GameMessage) => {
      const { playerId, nickname } = message.data as {
        playerId: string;
        nickname: string;
      };
      setPlayers((prev) => {
        const next = new Map(prev);
        next.delete(playerId);
        return next;
      });
      addSystemMessage(`${nickname}님이 퇴장했습니다.`);
    },
    [addSystemMessage]
  );

  const handlePlayerReady = useCallback((message: GameMessage) => {
    const { playerId, isReady } = message.data as {
      playerId: string;
      isReady: boolean;
    };
    setPlayers((prev) => {
      const player = prev.get(playerId);
      if (!player) return prev;
      const next = new Map(prev);
      next.set(playerId, { ...player, isReady });
      return next;
    });
  }, []);

  const handleDisconnect = useCallback(
    (playerId: string) => {
      const nickname = players.get(playerId)?.nickname || "플레이어";
      setPlayers((prev) => {
        const player = prev.get(playerId);
        if (!player) return prev;
        const next = new Map(prev);
        next.set(playerId, { ...player, status: "disconnected" });
        return next;
      });
      addSystemMessage(`${nickname}님의 연결이 끊어졌습니다.`);
    },
    [players, addSystemMessage]
  );

  const areAllPlayersReady = useCallback(
    () => Array.from(players.values()).every((player) => player.isReady),
    [players]
  );

  const reset = useCallback(() => setPlayers(new Map()), []);

  return {
    players,
    addSelf,
    handlePlayerJoin,
    handlePlayerList,
    handlePlayerLeave,
    handlePlayerReady,
    handleDisconnect,
    areAllPlayersReady,
    reset,
  };
}

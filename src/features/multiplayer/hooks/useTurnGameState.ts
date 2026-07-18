import { useCallback, useState } from "react";
import type { GameMessage, Player } from "../lib/P2PConnection";

interface UseTurnGameStateParams {
  sendMessage: (message: GameMessage) => void;
  isHost: boolean;
  localPlayer: Player | null;
  players: Map<string, Player>;
  addSystemMessage: (message: string) => void;
}

/** 턴 진행 상태(currentTurn)와 게임 state 동기화를 담당하는 훅 */
export function useTurnGameState({
  sendMessage,
  isHost,
  localPlayer,
  players,
  addSystemMessage,
}: UseTurnGameStateParams) {
  const [gameState, setGameState] = useState<unknown>(null);
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);

  /** 방을 만든 호스트가 첫 턴을 갖도록 초기화 */
  const setInitialTurn = useCallback((playerId: string) => {
    setCurrentTurn(playerId);
  }, []);

  const startGame = useCallback(
    (initialGameState: unknown) => {
      if (!isHost) return;

      sendMessage({
        type: "game-start",
        data: initialGameState,
        from: localPlayer?.id || "",
        timestamp: Date.now(),
      });

      setGameState(initialGameState);
      addSystemMessage("게임이 시작되었습니다!");
    },
    [sendMessage, isHost, localPlayer, addSystemMessage]
  );

  const updateGameState = useCallback(
    (next: unknown) => {
      sendMessage({
        type: "game-state",
        data: next,
        from: localPlayer?.id || "",
        timestamp: Date.now(),
      });
      setGameState(next);
    },
    [sendMessage, localPlayer]
  );

  const changeTurn = useCallback(
    (nextPlayerId: string) => {
      sendMessage({
        type: "turn-change",
        data: { playerId: nextPlayerId },
        from: localPlayer?.id || "",
        timestamp: Date.now(),
      });
      setCurrentTurn(nextPlayerId);
    },
    [sendMessage, localPlayer]
  );

  const getNextPlayer = useCallback(() => {
    const playerIds = Array.from(players.keys()).sort();
    const currentIndex = playerIds.indexOf(currentTurn || "");
    const nextIndex = (currentIndex + 1) % playerIds.length;
    return playerIds[nextIndex];
  }, [players, currentTurn]);

  const isMyTurn = useCallback(
    () => currentTurn === localPlayer?.id,
    [currentTurn, localPlayer]
  );

  const handleGameStart = useCallback(
    (message: GameMessage) => {
      setGameState(message.data);
      addSystemMessage("게임이 시작되었습니다!");
    },
    [addSystemMessage]
  );

  const handleGameState = useCallback((message: GameMessage) => {
    setGameState(message.data);
  }, []);

  const handleTurnChange = useCallback((message: GameMessage) => {
    setCurrentTurn((message.data as { playerId: string }).playerId);
  }, []);

  const reset = useCallback(() => {
    setGameState(null);
    setCurrentTurn(null);
  }, []);

  return {
    gameState,
    currentTurn,
    setInitialTurn,
    startGame,
    updateGameState,
    changeTurn,
    getNextPlayer,
    isMyTurn,
    handleGameStart,
    handleGameState,
    handleTurnChange,
    reset,
  };
}

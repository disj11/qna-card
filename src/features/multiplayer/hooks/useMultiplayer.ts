import { useCallback, useEffect } from "react";
import type { GameMessage, Player } from "../lib/P2PConnection";
import { useRoomConnection } from "./useRoomConnection";
import { usePlayerRoster } from "./usePlayerRoster";
import { useChat } from "./useChat";
import { useTurnGameState } from "./useTurnGameState";

export type { GameMessage } from "../lib/P2PConnection";
export type { ChatMessage, EmojiReaction } from "./useChat";

/**
 * 원거리 멀티플레이어 세션 전체를 다루는 오케스트레이터 훅.
 * 연결/로스터/채팅/턴-게임state는 각각 별도 훅으로 분리되어 있고, 이 훅은
 * 들어오는 메시지를 타입별로 알맞은 훅에 라우팅하는 역할만 담당한다.
 */
export const useMultiplayer = () => {
  const room = useRoomConnection();

  const chat = useChat({
    sendMessage: room.sendMessage,
    localPlayer: room.localPlayer,
  });

  const roster = usePlayerRoster({
    sendMessage: room.sendMessage,
    isHost: room.isHost,
    isConnected: room.isConnected,
    localPlayer: room.localPlayer,
    addSystemMessage: chat.addSystemMessage,
  });

  const turn = useTurnGameState({
    sendMessage: room.sendMessage,
    isHost: room.isHost,
    localPlayer: room.localPlayer,
    players: roster.players,
    addSystemMessage: chat.addSystemMessage,
  });

  const handleMessage = useCallback(
    (message: GameMessage) => {
      switch (message.type) {
        case "player-join":
          roster.handlePlayerJoin(message);
          break;
        case "player-leave":
          roster.handlePlayerLeave(message);
          break;
        case "player-ready":
          roster.handlePlayerReady(message);
          break;
        case "player-list":
          roster.handlePlayerList(message);
          break;
        case "game-start":
          turn.handleGameStart(message);
          break;
        case "game-state":
          turn.handleGameState(message);
          break;
        case "chat":
          chat.handleChat(message);
          break;
        case "emoji":
          chat.handleEmoji(message);
          break;
        case "turn-change":
          turn.handleTurnChange(message);
          break;
      }
    },
    [roster, chat, turn]
  );

  const handleDisconnect = useCallback(
    (playerId: string) => roster.handleDisconnect(playerId),
    [roster]
  );

  const handleHostReady = useCallback(
    (player: Player) => {
      roster.addSelf(player);
      turn.setInitialTurn(player.id);
      chat.addSystemMessage(`${player.nickname}님이 방을 생성했습니다.`);
    },
    [roster, turn, chat]
  );

  const handleClientReady = useCallback(() => {
    chat.addSystemMessage("방에 접속했습니다.");
  }, [chat]);

  useEffect(() => {
    room.setHandlers({
      onMessage: handleMessage,
      onDisconnect: handleDisconnect,
      onHostReady: handleHostReady,
      onClientReady: handleClientReady,
    });
  }, [room, handleMessage, handleDisconnect, handleHostReady, handleClientReady]);

  const leaveRoom = useCallback(() => {
    room.leaveRoom();
    roster.reset();
    chat.reset();
    turn.reset();
  }, [room, roster, chat, turn]);

  return {
    // 연결/방 상태
    isConnected: room.isConnected,
    isHost: room.isHost,
    roomId: room.roomId,
    localPlayer: room.localPlayer,
    isConnecting: room.isConnecting,
    error: room.error,
    createRoom: room.createRoom,
    joinRoom: room.joinRoom,
    leaveRoom,
    setReady: room.setReady,

    // 참가자 목록
    players: roster.players,
    areAllPlayersReady: roster.areAllPlayersReady,

    // 채팅/이모지
    chatMessages: chat.chatMessages,
    emojiReactions: chat.emojiReactions,
    sendChatMessage: chat.sendChatMessage,
    sendEmoji: chat.sendEmoji,

    // 턴/게임 state
    currentTurn: turn.currentTurn,
    gameState: turn.gameState,
    startGame: turn.startGame,
    updateGameState: turn.updateGameState,
    changeTurn: turn.changeTurn,
    getNextPlayer: turn.getNextPlayer,
    isMyTurn: turn.isMyTurn,
  };
};

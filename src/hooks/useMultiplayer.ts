import { useState, useEffect, useCallback, useRef } from "react";
import {
  P2PConnection,
  type Player,
  type GameMessage,
  type MessageHandler,
} from "../multiplayer/P2PConnection";

export type { GameMessage };

export interface MultiplayerState {
  isConnected: boolean;
  isHost: boolean;
  roomId: string | null;
  players: Map<string, Player>;
  localPlayer: Player | null;
  currentTurn: string | null;
  chatMessages: ChatMessage[];
  gameState: unknown;
}

export interface ChatMessage {
  id: string;
  from: string;
  nickname: string;
  message: string;
  timestamp: number;
  type: "chat" | "system";
}

export interface EmojiReaction {
  from: string;
  nickname: string;
  emoji: string;
  timestamp: number;
}

export const useMultiplayer = () => {
  const connectionRef = useRef<P2PConnection | null>(null);
  const [state, setState] = useState<MultiplayerState>({
    isConnected: false,
    isHost: false,
    roomId: null,
    players: new Map(),
    localPlayer: null,
    currentTurn: null,
    chatMessages: [],
    gameState: null,
  });

  const [emojiReactions, setEmojiReactions] = useState<EmojiReaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  /**
   * Initialize connection as host
   */
  const createRoom = useCallback(async (nickname: string, roomId?: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      const connection = new P2PConnection();
      connectionRef.current = connection;

      console.log("Attempting to create room...");
      const generatedRoomId = await connection.initializeAsHost(
        nickname,
        roomId,
      );
      console.log("Room created successfully:", generatedRoomId);

      const localPlayer = connection.getLocalPlayer();

      if (localPlayer) {
        const players = new Map<string, Player>();
        players.set(localPlayer.id, localPlayer);

        setState((prev) => ({
          ...prev,
          isConnected: true,
          isHost: true,
          roomId: generatedRoomId,
          players,
          localPlayer,
          currentTurn: localPlayer.id,
          chatMessages: [
            {
              id: Date.now().toString(),
              from: "system",
              nickname: "System",
              message: `${nickname}님이 방을 생성했습니다.`,
              timestamp: Date.now(),
              type: "system",
            },
          ],
        }));
      }

      // Setup message handler
      connection.onMessage(handleMessage);

      // Setup connection handler
      connection.onConnection((playerId) => {
        console.log("Player connected:", playerId);
      });

      // Setup disconnect handler
      connection.onDisconnect(handleDisconnect);
    } catch (err) {
      console.error("Error creating room:", err);
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(
        `방 생성에 실패했습니다: ${errorMessage}\n\n잠시 후 다시 시도해주세요.`,
      );
      connectionRef.current?.disconnect();
      connectionRef.current = null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  /**
   * Initialize connection as client
   */
  const joinRoom = useCallback(async (nickname: string, hostRoomId: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      const connection = new P2PConnection();
      connectionRef.current = connection;

      console.log("Attempting to join room:", hostRoomId);
      await connection.initializeAsClient(nickname, hostRoomId);
      console.log("Successfully connected to room");

      const localPlayer = connection.getLocalPlayer();

      if (localPlayer) {
        setState((prev) => ({
          ...prev,
          isConnected: true,
          isHost: false,
          roomId: hostRoomId,
          localPlayer,
          chatMessages: [
            {
              id: Date.now().toString(),
              from: "system",
              nickname: "System",
              message: `방에 접속했습니다.`,
              timestamp: Date.now(),
              type: "system",
            },
          ],
        }));
      }

      // Setup message handler
      connection.onMessage(handleMessage);

      // Setup disconnect handler
      connection.onDisconnect(handleDisconnect);
    } catch (err) {
      console.error("Error joining room:", err);
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(
        `방 참가에 실패했습니다: ${errorMessage}\n\n방 코드를 확인하거나 잠시 후 다시 시도해주세요.`,
      );
      connectionRef.current?.disconnect();
      connectionRef.current = null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  /**
   * Handle incoming messages
   */
  useEffect(() => {
    // If we are the host and connected, broadcast the player list whenever it changes.
    if (state.isHost && state.isConnected && connectionRef.current) {
      const playerList = Array.from(state.players.values());
      connectionRef.current.sendMessage({
        type: "player-list",
        data: playerList,
        from: state.localPlayer?.id || "",
        timestamp: Date.now(),
      });
    }
  }, [state.players, state.isHost, state.isConnected, state.localPlayer?.id]);

  const handleMessage = useCallback((message: GameMessage) => {
    console.log("Handling message:", message);

    switch (message.type) {
      case "player-join":
        handlePlayerJoin(message);
        break;
      case "player-leave":
        handlePlayerLeave(message);
        break;
      case "player-ready":
        handlePlayerReady(message);
        break;
      case "player-list":
        handlePlayerList(message);
        break;
      case "game-start":
        handleGameStart(message);
        break;
      case "game-state":
        handleGameState(message);
        break;
      case "chat":
        handleChat(message);
        break;
      case "emoji":
        handleEmoji(message);
        break;
      case "turn-change":
        handleTurnChange(message);
        break;
    }
  }, []);

  /**
   * Handle player join
   */
  const handlePlayerJoin = useCallback((message: GameMessage) => {
    // This logic should only run on the host.
    // The host will then broadcast the new player-list via useEffect.
    if (!connectionRef.current?.getIsHost()) {
      return;
    }

    const newPlayer = message.data as Player;

    setState((prev) => {
      if (prev.players.has(newPlayer.id)) return prev;

      const players = new Map(prev.players);
      players.set(newPlayer.id, newPlayer);

      const chatMessages = [
        ...prev.chatMessages,
        {
          id: Date.now().toString(),
          from: "system",
          nickname: "System",
          message: `${newPlayer.nickname}님이 입장했습니다.`,
          timestamp: Date.now(),
          type: "system" as const,
        },
      ];

      return { ...prev, players, chatMessages };
    });
  }, []);

  /**
   * Handle player list (client only)
   */
  const handlePlayerList = useCallback((message: GameMessage) => {
    const playerList = message.data as Player[];

    setState((prev) => {
      const players = new Map<string, Player>();
      playerList.forEach((player) => {
        players.set(player.id, player);
      });
      return { ...prev, players };
    });
  }, []);

  /**
   * Handle player leave
   */
  const handlePlayerLeave = useCallback((message: GameMessage) => {
    const data = message.data as { playerId: string; nickname: string };
    const playerId = data.playerId;
    const nickname = data.nickname;

    setState((prev) => {
      const players = new Map(prev.players);
      players.delete(playerId);

      const chatMessages = [
        ...prev.chatMessages,
        {
          id: Date.now().toString(),
          from: "system",
          nickname: "System",
          message: `${nickname}님이 퇴장했습니다.`,
          timestamp: Date.now(),
          type: "system" as const,
        },
      ];

      return { ...prev, players, chatMessages };
    });
  }, []);

  /**
   * Handle player ready
   */
  const handlePlayerReady = useCallback((message: GameMessage) => {
    const data = message.data as { playerId: string; isReady: boolean };
    const { playerId, isReady } = data;

    setState((prev) => {
      const players = new Map(prev.players);
      const player = players.get(playerId);
      if (player) {
        players.set(playerId, { ...player, isReady });
      }
      return { ...prev, players };
    });
  }, []);

  /**
   * Handle game start
   */
  const handleGameStart = useCallback((message: GameMessage) => {
    setState((prev) => ({
      ...prev,
      gameState: message.data,
      chatMessages: [
        ...prev.chatMessages,
        {
          id: Date.now().toString(),
          from: "system",
          nickname: "System",
          message: "게임이 시작되었습니다!",
          timestamp: Date.now(),
          type: "system" as const,
        },
      ],
    }));
  }, []);

  /**
   * Handle game state update
   */
  const handleGameState = useCallback((message: GameMessage) => {
    setState((prev) => ({
      ...prev,
      gameState: message.data,
    }));
  }, []);

  /**
   * Handle chat message
   */
  const handleChat = useCallback((message: GameMessage) => {
    setState((prev) => ({
      ...prev,
      chatMessages: [
        ...prev.chatMessages,
        {
          id: Date.now().toString(),
          from: message.from,
          nickname: (message.data as { nickname: string; message: string })
            .nickname,
          message: (message.data as { nickname: string; message: string })
            .message,
          timestamp: message.timestamp,
          type: "chat" as const,
        },
      ],
    }));
  }, []);

  /**
   * Handle emoji reaction
   */
  const handleEmoji = useCallback((message: GameMessage) => {
    const reaction: EmojiReaction = {
      from: message.from,
      nickname: (message.data as { nickname: string; emoji: string }).nickname,
      emoji: (message.data as { nickname: string; emoji: string }).emoji,
      timestamp: message.timestamp,
    };

    setEmojiReactions((prev) => [...prev, reaction]);

    // Remove reaction after 3 seconds
    setTimeout(() => {
      setEmojiReactions((prev) =>
        prev.filter((r) => r.timestamp !== reaction.timestamp),
      );
    }, 3000);
  }, []);

  /**
   * Handle turn change
   */
  const handleTurnChange = useCallback((message: GameMessage) => {
    setState((prev) => ({
      ...prev,
      currentTurn: (message.data as { playerId: string }).playerId,
    }));
  }, []);

  /**
   * Handle disconnect
   */
  const handleDisconnect = useCallback((playerId: string) => {
    setState((prev) => {
      const player = prev.players.get(playerId);
      const players = new Map(prev.players);

      if (player) {
        players.set(playerId, { ...player, status: "disconnected" });
      }

      const chatMessages = [
        ...prev.chatMessages,
        {
          id: Date.now().toString(),
          from: "system",
          nickname: "System",
          message: `${player?.nickname || "플레이어"}님의 연결이 끊어졌습니다.`,
          timestamp: Date.now(),
          type: "system" as const,
        },
      ];

      return { ...prev, players, chatMessages };
    });
  }, []);

  /**
   * Send chat message
   */
  const sendChatMessage = useCallback(
    (message: string) => {
      if (!connectionRef.current || !state.localPlayer) return;

      const chatMessage: GameMessage = {
        type: "chat",
        data: {
          nickname: state.localPlayer.nickname,
          message,
        },
        from: state.localPlayer.id,
        timestamp: Date.now(),
      };

      connectionRef.current.sendMessage(chatMessage);

      // Add to local state
      setState((prev) => ({
        ...prev,
        chatMessages: [
          ...prev.chatMessages,
          {
            id: Date.now().toString(),
            from: state.localPlayer!.id,
            nickname: state.localPlayer!.nickname,
            message,
            timestamp: Date.now(),
            type: "chat" as const,
          },
        ],
      }));
    },
    [state.localPlayer],
  );

  /**
   * Send emoji reaction
   */
  const sendEmoji = useCallback(
    (emoji: string) => {
      if (!connectionRef.current || !state.localPlayer) return;

      const emojiMessage: GameMessage = {
        type: "emoji",
        data: {
          nickname: state.localPlayer.nickname,
          emoji,
        },
        from: state.localPlayer.id,
        timestamp: Date.now(),
      };

      connectionRef.current.sendMessage(emojiMessage);

      // Add to local state
      const reaction: EmojiReaction = {
        from: state.localPlayer.id,
        nickname: state.localPlayer.nickname,
        emoji,
        timestamp: Date.now(),
      };

      setEmojiReactions((prev) => [...prev, reaction]);

      // Remove reaction after 3 seconds
      setTimeout(() => {
        setEmojiReactions((prev) =>
          prev.filter((r) => r.timestamp !== reaction.timestamp),
        );
      }, 3000);
    },
    [state.localPlayer],
  );

  /**
   * Set player ready status
   */
  const setReady = useCallback(
    (isReady: boolean) => {
      if (!connectionRef.current || !state.localPlayer) return;

      const message: GameMessage = {
        type: "player-ready",
        data: {
          playerId: state.localPlayer.id,
          isReady,
        },
        from: state.localPlayer.id,
        timestamp: Date.now(),
      };

      connectionRef.current.sendMessage(message);

      // Update local state
      setState((prev) => ({
        ...prev,
        localPlayer: prev.localPlayer ? { ...prev.localPlayer, isReady } : null,
      }));
    },
    [state.localPlayer],
  );

  /**
   * Start game (host only)
   */
  const startGame = useCallback(
    (initialGameState: unknown) => {
      if (!connectionRef.current || !state.isHost) return;

      const message: GameMessage = {
        type: "game-start",
        data: initialGameState,
        from: state.localPlayer?.id || "",
        timestamp: Date.now(),
      };

      connectionRef.current.sendMessage(message);

      // Update local state
      setState((prev) => ({
        ...prev,
        gameState: initialGameState,
        chatMessages: [
          ...prev.chatMessages,
          {
            id: Date.now().toString(),
            from: "system",
            nickname: "System",
            message: "게임이 시작되었습니다!",
            timestamp: Date.now(),
            type: "system" as const,
          },
        ],
      }));
    },
    [state.isHost, state.localPlayer],
  );

  /**
   * Update game state
   */
  const updateGameState = useCallback(
    (gameState: unknown) => {
      if (!connectionRef.current) return;

      const message: GameMessage = {
        type: "game-state",
        data: gameState,
        from: state.localPlayer?.id || "",
        timestamp: Date.now(),
      };

      connectionRef.current.sendMessage(message);

      // Update local state
      setState((prev) => ({
        ...prev,
        gameState,
      }));
    },
    [state.localPlayer],
  );

  /**
   * Change turn to next player
   */
  const changeTurn = useCallback(
    (nextPlayerId: string) => {
      if (!connectionRef.current) return;

      const message: GameMessage = {
        type: "turn-change",
        data: {
          playerId: nextPlayerId,
        },
        from: state.localPlayer?.id || "",
        timestamp: Date.now(),
      };

      connectionRef.current.sendMessage(message);

      // Update local state
      setState((prev) => ({
        ...prev,
        currentTurn: nextPlayerId,
      }));
    },
    [state.localPlayer],
  );

  /**
   * Get next player in turn order
   */
  const getNextPlayer = useCallback(() => {
    const playerIds = Array.from(state.players.keys()).sort();
    const currentIndex = playerIds.indexOf(state.currentTurn || "");
    const nextIndex = (currentIndex + 1) % playerIds.length;
    return playerIds[nextIndex];
  }, [state.players, state.currentTurn]);

  /**
   * Leave room and disconnect
   */
  const leaveRoom = useCallback(() => {
    if (!connectionRef.current || !state.localPlayer) return;

    // Send leave message
    const message: GameMessage = {
      type: "player-leave",
      data: {
        playerId: state.localPlayer.id,
        nickname: state.localPlayer.nickname,
      },
      from: state.localPlayer.id,
      timestamp: Date.now(),
    };

    connectionRef.current.sendMessage(message);

    // Disconnect
    connectionRef.current.disconnect();
    connectionRef.current = null;

    // Reset state
    setState({
      isConnected: false,
      isHost: false,
      roomId: null,
      players: new Map(),
      localPlayer: null,
      currentTurn: null,
      chatMessages: [],
      gameState: null,
    });
  }, [state.localPlayer]);

  /**
   * Check if all players are ready
   */
  const areAllPlayersReady = useCallback(() => {
    return Array.from(state.players.values()).every((player) => player.isReady);
  }, [state.players]);

  /**
   * Check if it's local player's turn
   */
  const isMyTurn = useCallback(() => {
    return state.currentTurn === state.localPlayer?.id;
  }, [state.currentTurn, state.localPlayer]);

  const onMessage = useCallback((handler: MessageHandler) => {
    if (connectionRef.current) {
      return connectionRef.current.onMessage(handler);
    }
    return () => {}; // Return a dummy unsubscribe function
  }, []);

  const sendMessage = useCallback((message: GameMessage) => {
    if (connectionRef.current) {
      connectionRef.current.sendMessage(message);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connectionRef.current) {
        connectionRef.current.disconnect();
      }
    };
  }, []);

  return {
    // State
    ...state,
    emojiReactions,
    error,
    isConnecting,

    // Actions
    createRoom,
    joinRoom,
    leaveRoom,
    sendChatMessage,
    sendEmoji,
    setReady,
    startGame,
    updateGameState,
    changeTurn,
    getNextPlayer,
    areAllPlayersReady,
    isMyTurn,
    onMessage,
    sendMessage,
  };
};

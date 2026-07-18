import { useCallback, useState } from "react";
import type { GameMessage, Player } from "../lib/P2PConnection";

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

interface UseChatParams {
  sendMessage: (message: GameMessage) => void;
  localPlayer: Player | null;
}

/** 채팅 메시지 + 이모지 리액션 상태와 송수신을 담당하는 훅 */
export function useChat({ sendMessage, localPlayer }: UseChatParams) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [emojiReactions, setEmojiReactions] = useState<EmojiReaction[]>([]);

  const addSystemMessage = useCallback((message: string) => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        from: "system",
        nickname: "System",
        message,
        timestamp: Date.now(),
        type: "system" as const,
      },
    ]);
  }, []);

  const sendChatMessage = useCallback(
    (message: string) => {
      if (!localPlayer) return;

      sendMessage({
        type: "chat",
        data: { nickname: localPlayer.nickname, message },
        from: localPlayer.id,
        timestamp: Date.now(),
      });

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          from: localPlayer.id,
          nickname: localPlayer.nickname,
          message,
          timestamp: Date.now(),
          type: "chat" as const,
        },
      ]);
    },
    [sendMessage, localPlayer]
  );

  const sendEmoji = useCallback(
    (emoji: string) => {
      if (!localPlayer) return;

      sendMessage({
        type: "emoji",
        data: { nickname: localPlayer.nickname, emoji },
        from: localPlayer.id,
        timestamp: Date.now(),
      });

      const reaction: EmojiReaction = {
        from: localPlayer.id,
        nickname: localPlayer.nickname,
        emoji,
        timestamp: Date.now(),
      };
      setEmojiReactions((prev) => [...prev, reaction]);
      setTimeout(() => {
        setEmojiReactions((prev) =>
          prev.filter((r) => r.timestamp !== reaction.timestamp)
        );
      }, 3000);
    },
    [sendMessage, localPlayer]
  );

  const handleChat = useCallback((message: GameMessage) => {
    const data = message.data as { nickname: string; message: string };
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        from: message.from,
        nickname: data.nickname,
        message: data.message,
        timestamp: message.timestamp,
        type: "chat" as const,
      },
    ]);
  }, []);

  const handleEmoji = useCallback((message: GameMessage) => {
    const data = message.data as { nickname: string; emoji: string };
    const reaction: EmojiReaction = {
      from: message.from,
      nickname: data.nickname,
      emoji: data.emoji,
      timestamp: message.timestamp,
    };
    setEmojiReactions((prev) => [...prev, reaction]);
    setTimeout(() => {
      setEmojiReactions((prev) =>
        prev.filter((r) => r.timestamp !== reaction.timestamp)
      );
    }, 3000);
  }, []);

  const reset = useCallback(() => {
    setChatMessages([]);
    setEmojiReactions([]);
  }, []);

  return {
    chatMessages,
    emojiReactions,
    sendChatMessage,
    sendEmoji,
    addSystemMessage,
    handleChat,
    handleEmoji,
    reset,
  };
}

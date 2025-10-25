import Peer from "peerjs";

type DataConnection = ReturnType<Peer["connect"]>;

export interface Player {
  id: string;
  nickname: string;
  isHost: boolean;
  isReady: boolean;
  status: "online" | "disconnected";
}

export interface GameMessage {
  type:
    | "player-join"
    | "player-leave"
    | "player-ready"
    | "game-start"
    | "game-state"
    | "chat"
    | "emoji"
    | "turn-change"
    | "player-list"
    | "wordchain-submit"
    | "randommission-draw"
    | "randommission-complete"
    | "randommission-pass";
  data: unknown;
  from: string;
  timestamp: number;
}

export type MessageHandler = (message: GameMessage) => void;
export type ConnectionHandler = (playerId: string) => void;
export type DisconnectHandler = (playerId: string) => void;

export class P2PConnection {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private disconnectHandlers: Set<DisconnectHandler> = new Set();
  private localPlayer: Player | null = null;
  private isHost: boolean = false;

  constructor() {}

  /**
   * Initialize as host
   */
  async initializeAsHost(nickname: string, roomId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const peerId = roomId || this.generateRoomId();

        // Check if running locally (for development)
        const isDev =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        // Use local PeerJS server in development for better reliability
        const peerConfig = isDev
          ? {
              host: "localhost",
              port: 9000,
              path: "/",
              secure: false,
              debug: 2,
              config: {
                iceServers: [
                  { urls: "stun:stun.l.google.com:19302" },
                  { urls: "stun:stun1.l.google.com:19302" },
                ],
              },
            }
          : {
              // Production: use a reliable public PeerJS server
              // For production apps, it's recommended to host your own PeerJS server
              host: "peerjs-server.fly.dev",
              secure: true,
              port: 443,
              debug: 2,
              config: {
                iceServers: [
                  { urls: "stun:stun.l.google.com:19302" },
                  { urls: "stun:stun1.l.google.com:19302" },
                  { urls: "stun:stun2.l.google.com:19302" },
                  { urls: "stun:stun3.l.google.com:19302" },
                  { urls: "stun:stun4.l.google.com:19302" },
                ],
              },
            };

        this.peer = new Peer(peerId, peerConfig);

        // Add timeout
        const timeout = setTimeout(() => {
          reject(new Error("Connection timeout - PeerJS server unreachable"));
        }, 10000);

        this.peer.on("open", (id) => {
          clearTimeout(timeout);
          this.isHost = true;
          this.localPlayer = {
            id,
            nickname,
            isHost: true,
            isReady: true,
            status: "online",
          };
          console.log("Host initialized with ID:", id);
          resolve(id);
        });

        this.peer.on("connection", (conn) => {
          this.handleIncomingConnection(conn);
        });

        this.peer.on("error", (error) => {
          clearTimeout(timeout);
          console.error("Peer error:", error);
          reject(error);
        });

        this.peer.on("disconnected", () => {
          console.log("Peer disconnected, attempting to reconnect...");
          this.peer?.reconnect();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Initialize as client and connect to host
   */
  async initializeAsClient(nickname: string, hostId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const randomId = Math.random().toString(36).substring(2, 15);

        // Check if running locally (for development)
        const isDev =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        // Use local PeerJS server in development for better reliability
        const peerConfig = isDev
          ? {
              host: "localhost",
              port: 9000,
              path: "/",
              secure: false,
              debug: 2,
              config: {
                iceServers: [
                  { urls: "stun:stun.l.google.com:19302" },
                  { urls: "stun:stun1.l.google.com:19302" },
                ],
              },
            }
          : {
              // Production: use a reliable public PeerJS server
              // For production apps, it's recommended to host your own PeerJS server
              host: "peerjs-server.fly.dev",
              secure: true,
              port: 443,
              debug: 2,
              config: {
                iceServers: [
                  { urls: "stun:stun.l.google.com:19302" },
                  { urls: "stun:stun1.l.google.com:19302" },
                  { urls: "stun:stun2.l.google.com:19302" },
                  { urls: "stun:stun3.l.google.com:19302" },
                  { urls: "stun:stun4.l.google.com:19302" },
                ],
              },
            };

        this.peer = new Peer(randomId, peerConfig);

        // Add timeout
        const timeout = setTimeout(() => {
          reject(new Error("Connection timeout - PeerJS server unreachable"));
        }, 10000);

        this.peer.on("open", (id) => {
          clearTimeout(timeout);
          this.isHost = false;
          this.localPlayer = {
            id,
            nickname,
            isHost: false,
            isReady: false,
            status: "online",
          };
          console.log("Client initialized with ID:", id);

          // Connect to host
          const conn = this.peer!.connect(hostId, {
            reliable: true,
            serialization: "json",
          });

          this.setupConnection(conn);

          const connTimeout = setTimeout(() => {
            reject(new Error("Failed to connect to host"));
          }, 10000);

          conn.on("open", () => {
            clearTimeout(connTimeout);
            console.log("Connected to host:", hostId);
            // Send join message
            this.sendMessage({
              type: "player-join",
              data: this.localPlayer,
              from: id,
              timestamp: Date.now(),
            });
            resolve();
          });

          conn.on("error", (error) => {
            clearTimeout(connTimeout);
            console.error("Connection error:", error);
            reject(error);
          });
        });

        this.peer.on("error", (error) => {
          clearTimeout(timeout);
          console.error("Peer error:", error);
          reject(error);
        });

        this.peer.on("disconnected", () => {
          console.log("Peer disconnected, attempting to reconnect...");
          this.peer?.reconnect();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Handle incoming connection (host only)
   */
  private handleIncomingConnection(conn: DataConnection) {
    console.log("Incoming connection from:", conn.peer);
    this.setupConnection(conn);
  }

  /**
   * Setup connection event handlers
   */
  private setupConnection(conn: DataConnection) {
    this.connections.set(conn.peer, conn);

    conn.on("data", (data) => {
      const message = data as GameMessage;
      console.log("Received message:", message);

      // If host, relay message to all other clients
      if (this.isHost && message.type !== "player-join") {
        this.relayMessage(message, conn.peer);
      }

      // Handle message
      this.messageHandlers.forEach((handler) => handler(message));
    });

    conn.on("open", () => {
      console.log("Connection opened with:", conn.peer);
      this.connectionHandlers.forEach((handler) => handler(conn.peer));
    });

    conn.on("close", () => {
      console.log("Connection closed with:", conn.peer);
      this.connections.delete(conn.peer);
      this.disconnectHandlers.forEach((handler) => handler(conn.peer));
    });

    conn.on("error", (error) => {
      console.error("Connection error with", conn.peer, ":", error);
    });
  }

  /**
   * Relay message to all clients except sender (host only)
   */
  private relayMessage(message: GameMessage, senderId: string) {
    if (!this.isHost) return;

    this.connections.forEach((conn, peerId) => {
      if (peerId !== senderId) {
        try {
          conn.send(message);
        } catch (error) {
          console.error("Error relaying message to", peerId, ":", error);
        }
      }
    });
  }

  /**
   * Send message to all connected peers
   */
  sendMessage(message: GameMessage) {
    if (this.isHost) {
      // Host sends to all clients
      this.connections.forEach((conn) => {
        try {
          conn.send(message);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      });
    } else {
      // Client sends to host only
      const hostConn = Array.from(this.connections.values())[0];
      if (hostConn) {
        try {
          hostConn.send(message);
        } catch (error) {
          console.error("Error sending message to host:", error);
        }
      }
    }
  }

  /**
   * Send message to specific peer
   */
  sendMessageToPeer(peerId: string, message: GameMessage) {
    const conn = this.connections.get(peerId);
    if (conn) {
      try {
        conn.send(message);
      } catch (error) {
        console.error("Error sending message to peer:", error);
      }
    }
  }

  /**
   * Register message handler
   */
  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /**
   * Register connection handler
   */
  onConnection(handler: ConnectionHandler) {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  /**
   * Register disconnect handler
   */
  onDisconnect(handler: DisconnectHandler) {
    this.disconnectHandlers.add(handler);
    return () => this.disconnectHandlers.delete(handler);
  }

  /**
   * Get local player info
   */
  getLocalPlayer(): Player | null {
    return this.localPlayer;
  }

  /**
   * Get peer ID
   */
  getPeerId(): string | null {
    return this.peer?.id || null;
  }

  /**
   * Check if host
   */
  getIsHost(): boolean {
    return this.isHost;
  }

  /**
   * Get connected peers count
   */
  getConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * Get all connection IDs
   */
  getConnectionIds(): string[] {
    return Array.from(this.connections.keys());
  }

  /**
   * Disconnect from all peers and destroy peer
   */
  disconnect() {
    // Close all connections
    this.connections.forEach((conn) => {
      try {
        conn.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    });
    this.connections.clear();

    // Destroy peer
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (error) {
        console.error("Error destroying peer:", error);
      }
      this.peer = null;
    }

    // Clear handlers
    this.messageHandlers.clear();
    this.connectionHandlers.clear();
    this.disconnectHandlers.clear();

    this.localPlayer = null;
    this.isHost = false;
  }

  /**
   * Generate random room ID
   */
  private generateRoomId(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let roomId = "";
    for (let i = 0; i < 6; i++) {
      roomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return roomId;
  }
}

export const createP2PConnection = () => new P2PConnection();

import { PeerServer } from "peer";

const server = PeerServer({
  port: 9000,
  path: "/",
  allow_discovery: true,
});

server.on("connection", (client) => {
  console.log(`✅ Client connected: ${client.getId()}`);
});

server.on("disconnect", (client) => {
  console.log(`❌ Client disconnected: ${client.getId()}`);
});

console.log("🚀 PeerJS Server started on port 9000");
console.log("📍 Server ready at: http://localhost:9000/");
console.log("");
console.log("💡 Tip: Keep this terminal open while testing multiplayer");
console.log("   Press Ctrl+C to stop the server");
console.log("");

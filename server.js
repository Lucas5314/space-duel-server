const http = require("http");
const WebSocket = require("ws");
const crypto = require("crypto");

const PORT = process.env.PORT || 8080;

// 🔹 HTTP server obligatorio para Render
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Space Duel Server Running");
});

const wss = new WebSocket.Server({ server });

server.listen(PORT, () => {
  console.log("HTTP + WS escuchando en puerto", PORT);
});

// ===== MATCHMAKING =====
const queue = [];
const rooms = {};
const players = {};

// ===== UTILS =====
function send(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function broadcastRoom(room, data) {
  const msg = JSON.stringify(data);
  Object.values(room.players).forEach(p => {
    if (p.ws.readyState === WebSocket.OPEN) {
      p.ws.send(msg);
    }
  });
}

// ===== ROOM LOGIC =====
function createRoom(p1, p2) {
  const roomId = crypto.randomUUID();

  const room = {
    id: roomId,
    players: {
      [p1.id]: { id: p1.id, ws: p1.ws, x: 400, y: 520, hp: 3, cd: 0 },
      [p2.id]: { id: p2.id, ws: p2.ws, x: 400, y: 80, hp: 3, cd: 0 }
    },
    bullets: [],
    loop: null
  };

  rooms[roomId] = room;

  p1.ws.roomId = roomId;
  p2.ws.roomId = roomId;

  send(p1.ws, { type: "welcome", id: p1.id });
  send(p2.ws, { type: "welcome", id: p2.id });

  startRoom(room);
}

function startRoom(room) {
  room.loop = setInterval(() => {
    room.bullets.forEach(b => b.y += b.vy);
    room.bullets = room.bullets.filter(b => b.y > -30 && b.y < 630);

    for (const b of room.bullets) {
      for (const p of Object.values(room.players)) {
        if (
          p.id !== b.owner &&
          Math.abs(p.x - b.x) < 22 &&
          Math.abs(p.y - b.y) < 22
        ) {
          p.hp--;
          b.dead = true;

          if (p.hp <= 0) {
            broadcastRoom(room, { type: "gameover", loser: p.id });
            return closeRoom(room.id);
          }
        }
      }
    }

    room.bullets = room.bullets.filter(b => !b.dead);

    broadcastRoom(room, {
      type: "state",
      players: Object.values(room.players),
      projectiles: room.bullets
    });

  }, 1000 / 60);
}

function closeRoom(roomId) {
  const room = rooms[roomId];
  if (!room) return;

  clearInterval(room.loop);
  Object.values(room.players).forEach(p => p.ws.roomId = null);
  delete rooms[roomId];
}

// ===== CONNECTIONS =====
wss.on("connection", ws => {
  const playerId = crypto.randomUUID();
  players[playerId] = ws;

  ws.playerId = playerId;
  ws.roomId = null;

  ws.on("message", msg => {
    const data = JSON.parse(msg);

    if (data.type === "play") {
      queue.push({ id: playerId, ws });
      send(ws, { type: "waiting" });

      if (queue.length >= 2) {
        createRoom(queue.shift(), queue.shift());
      }
    }

    if (data.type === "input") {
      const room = rooms[ws.roomId];
      if (!room) return;

      const p = room.players[playerId];
      if (!p) return;

      if (data.left) p.x -= 44;
      if (data.right) p.x += 44;
      p.x = Math.max(30, Math.min(770, p.x));

      if (data.fire && Date.now() > p.cd) {
        room.bullets.push({
          owner: p.id,
          x: p.x,
          y: p.y,
          vy: p.y > 300 ? -80 : 80
        });
        p.cd = Date.now() + 180;
      }
    }
  });

  ws.on("close", () => {
    const i = queue.findIndex(p => p.id === playerId);
    if (i !== -1) queue.splice(i, 1);
    if (ws.roomId) closeRoom(ws.roomId);
    delete players[playerId];
  });
});

const WebSocket = require("ws");
const http = require("http");

const server = http.createServer((req, res) => {
  res.end("OK");
});

// 🔥 FIX REAL PARA RENDER
const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit("connection", ws, request);
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log("SERVER OK on", PORT);
});

// ================= DATA =================
let players = {};
let sockets = {};
let bullets = [];

let waiting = null;
let idCounter = 1;

const SPEED = 12;
const BULLET_SPEED = 15;

// ================= CONNECTION =================
wss.on("connection", ws => {

  const id = idCounter++;
  sockets[id] = ws;

  ws.send(JSON.stringify({ type: "welcome", id }));

  ws.on("message", msg => {
    const data = JSON.parse(msg);

    if (data.type === "play") {
      if (waiting === null) {
        waiting = id;
      } else {
        createMatch(waiting, id);
        waiting = null;
      }
    }

    if (data.type === "input") {
      const p = players[id];
      if (!p) return;

      if (data.left) p.x -= SPEED;
      if (data.right) p.x += SPEED;

      if (p.x < 20) p.x = 20;
      if (p.x > 780) p.x = 780;
    }

    if (data.type === "shoot") {
      const p = players[id];
      if (!p) return;

      if (!p.lastShot) p.lastShot = 0;
      if (Date.now() - p.lastShot < 300) return;

      p.lastShot = Date.now();

      bullets.push({
        x: p.x,
        y: p.y,
        dy: p.side === "bottom" ? -BULLET_SPEED : BULLET_SPEED,
        owner: id
      });
    }
  });

  ws.on("close", () => {
    delete players[id];
    delete sockets[id];
    if (waiting === id) waiting = null;
  });
});

// ================= MATCH =================
function createMatch(p1, p2) {

  players[p1] = {
    id: p1,
    x: 400,
    y: 550,
    hp: 3,
    side: "bottom",
    lastShot: 0
  };

  players[p2] = {
    id: p2,
    x: 400,
    y: 50,
    hp: 3,
    side: "top",
    lastShot: 0
  };

  console.log("MATCH:", p1, p2);
}

// ================= GAME LOOP =================
setInterval(() => {

  bullets.forEach(b => b.y += b.dy);

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];

    for (const p of Object.values(players)) {
      if (p.id === b.owner) continue;

      if (
        Math.abs(b.x - p.x) < 20 &&
        Math.abs(b.y - p.y) < 20
      ) {
        p.hp--;

        const ws = sockets[p.id];
        ws && ws.send(JSON.stringify({ type: "hit" }));

        bullets.splice(i, 1);

        if (p.hp <= 0) {
          gameOver(b.owner);
        }

        break;
      }
    }
  }

  bullets = bullets.filter(b => b.y > 0 && b.y < 600);

  broadcast({
    type: "state",
    players,
    bullets
  });

}, 50);

// ================= GAME OVER =================
function gameOver(winner) {

  Object.values(sockets).forEach(ws => {
    ws.send(JSON.stringify({
      type: "gameover",
      winner
    }));
  });

  players = {};
  bullets = [];
}

// ================= BROADCAST =================
function broadcast(data) {
  Object.values(sockets).forEach(ws => {
    ws.send(JSON.stringify(data));
  });
}
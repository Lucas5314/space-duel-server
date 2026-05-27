const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const crypto = require("crypto");

// ================= EXPRESS =================
const app = express();

// sirve index.html, assets, imágenes, css, js, etc
app.use(express.static(__dirname));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(process.env.PORT || 8080, () => {
  console.log("SERVER LISTO");
});

// ================= DATA =================
const rooms = {};
const queue = new Map();

// ================= SEND =================
function send(ws, data) {
  if (ws?.readyState === 1) {
    ws.send(JSON.stringify(data));
  }
}

// ================= ROOM =================
function createRoom(a, b, isBot = false) {

  const id = crypto.randomUUID();

  const p2 = isBot
    ? {
        id: "BOT",
        ws: null,
        x: 400,
        y: 80,
        hp: 4,
        vx: 0,
        targetX: 400,
        bot: true
      }
    : {
        id: b.id,
        ws: b.ws,
        x: 400,
        y: 80,
        hp: 4,
        vx: 0,
        targetX: 400
      };

  const room = {
    id,
    players: {
      [a.id]: {
        id: a.id,
        ws: a.ws,
        x: 400,
        y: 520,
        hp: 4,
        vx: 0,
        targetX: 400
      },

      [p2.id]: p2
    },

    bullets: [],
    ended: false
  };

  rooms[id] = room;

  a.ws.roomId = id;

  if (b.ws) {
    b.ws.roomId = id;
  }

  send(a.ws, {
    type: "welcome",
    id: a.id
  });

  if (b.ws) {
    send(b.ws, {
      type: "welcome",
      id: b.id
    });
  }

  loop(room);
}

// ================= GAME LOOP =================
function loop(room) {

  room.loop = setInterval(() => {

    if (room.ended) return;

    // ================= MOVEMENT =================
    for (const p of Object.values(room.players)) {

      // BOT FOLLOW
      if (p.bot) {
        const target = Object.values(room.players).find(x => !x.bot);

        if (target) {
          p.targetX = target.x;
        }
      }

      // smooth movement
      if (p.targetX != null) {
        p.x += (p.targetX - p.x) * 0.25;
      }

      // límites
      p.x = Math.max(20, Math.min(780, p.x));
    }

    // ================= BULLETS =================
    for (const b of room.bullets) {

      b.y += b.vy;

      for (const p of Object.values(room.players)) {

        if (p.id === b.owner) continue;

        // colisión
        if (
          Math.abs(p.x - b.x) < 20 &&
          Math.abs(p.y - b.y) < 25
        ) {

          p.hp--;
          b.dead = true;

          if (p.hp <= 0) {
            end(room, p.id);
            return;
          }
        }
      }

      if (b.y < -50 || b.y > 650) {
        b.dead = true;
      }
    }

    room.bullets = room.bullets.filter(b => !b.dead);

    sendState(room);

  }, 1000 / 60);
}

// ================= SEND STATE =================
function sendState(room) {

  const data = {
    type: "state",
    players: Object.values(room.players),
    projectiles: room.bullets
  };

  for (const p of Object.values(room.players)) {
    send(p.ws, data);
  }
}

// ================= CONNECTION =================
wss.on("connection", ws => {

  const id = crypto.randomUUID();

  ws.id = id;

  ws.on("message", msg => {

    const data = JSON.parse(msg);

    // ================= INPUT =================
    if (data.type === "input") {

      const room = rooms[ws.roomId];

      if (!room) return;

      const p = room.players[id];

      if (!p) return;

      // teclado
      if (data.left) {
        p.targetX = p.x - 120;
      }

      if (data.right) {
        p.targetX = p.x + 120;
      }

      // touch / mouse
      if (data.targetX != null) {
        p.targetX = data.targetX;
      }

      // disparo
      if (data.fire && Date.now() > (p.cd || 0)) {

        room.bullets.push({
          owner: id,
          x: p.x,
          y: p.y - 20,
          vy: -8
        });

        p.cd = Date.now() + 160;
      }
    }

    // ================= PLAY =================
    if (data.type === "play") {

      queue.set(id, { ws });

      match();
    }
  });

  // ================= DISCONNECT =================
  ws.on("close", () => {

    queue.delete(id);

    const room = rooms[ws.roomId];

    if (!room) return;

    if (!room.ended) {
      end(room, id);
    }
  });
});

// ================= MATCHMAKING =================
function match() {

  const arr = [...queue.entries()];

  if (arr.length < 2) return;

  const [id1, a] = arr[0];
  const [id2, b] = arr[1];

  queue.delete(id1);
  queue.delete(id2);

  createRoom(
    { id: id1, ws: a.ws },
    { id: id2, ws: b.ws },
    false
  );
}

// ================= END GAME =================
function end(room, loser) {

  room.ended = true;

  const winner = Object.keys(room.players).find(
    x => x !== loser
  );

  for (const p of Object.values(room.players)) {

    send(p.ws, {
      type: "gameover",
      loser,
      winner
    });
  }

  clearInterval(room.loop);

  delete rooms[room.id];
}
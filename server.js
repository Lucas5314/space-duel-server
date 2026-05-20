const http = require("http");
const WebSocket = require("ws");
const crypto = require("crypto");

const server = http.createServer((req, res) => {
  res.end("OK");
});

const wss = new WebSocket.Server({ server });

server.listen(process.env.PORT || 8080);

const queue = new Map();
const rooms = {};

// ================= SEND =================
function send(ws, data) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

// ================= BOT =================
function bot() {
  return {
    id: "BOT_" + crypto.randomUUID(),
    ws: null,
    x: 400,
    y: 80,
    hp: 4,
    cd: 0,
    bot: true
  };
}

// ================= ROOM =================
function createRoom(a, b, isBot = false) {

  const roomId = crypto.randomUUID();

  const p2 = isBot
    ? bot()
    : {
        id: b.id,
        ws: b.ws,
        x: 400,
        y: 80,
        hp: 4,
        cd: 0
      };

  const room = {
    id: roomId,
    ended: false,
    bullets: [],
    players: {

      [a.id]: {
        id: a.id,
        ws: a.ws,
        x: 400,
        y: 520,
        hp: 4,
        cd: 0
      },

      [p2.id]: p2
    }
  };

  rooms[roomId] = room;

  a.ws.roomId = roomId;

  if (!isBot && b.ws) {
    b.ws.roomId = roomId;
  }

  send(a.ws, {
    type: "welcome",
    id: a.id
  });

  if (!isBot && b.ws) {
    send(b.ws, {
      type: "welcome",
      id: b.id
    });
  }

  loop(room);
}

// ================= LOOP =================
function loop(room) {

  room.loop = setInterval(() => {

    if (room.ended) {
      clearInterval(room.loop);
      return;
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

          console.log("HIT:", p.id, "HP:", p.hp);

          if (p.hp <= 0 && !room.ended) {

            console.log("GAME OVER");

            end(room, p.id);
            return;
          }
        }
      }

      // eliminar si sale de pantalla
      if (b.y < -50 || b.y > 650) {
        b.dead = true;
      }
    }

    room.bullets = room.bullets.filter(b => !b.dead);

    // ================= BOT AI =================
    for (const p of Object.values(room.players)) {

      if (!p.bot) continue;

      const target = Object.values(room.players)
        .find(x => !x.bot);

      if (!target) continue;

      // movimiento bot
      if (target.x < p.x) p.x -= 3;
      if (target.x > p.x) p.x += 3;

      p.x = Math.max(20, Math.min(780, p.x));

      // disparo bot
      if (
        Date.now() > p.cd &&
        Math.random() < 0.08
      ) {

        room.bullets.push({
          owner: p.id,
          x: p.x,
          y: p.y + 25,
          vy: 8
        });

        p.cd = Date.now() + 450;
      }
    }

    sendState(room);

  }, 1000 / 60);
}

// ================= STATE =================
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

// ================= GAME OVER =================
function end(room, loser) {

  if (room.ended) return;

  room.ended = true;

  const winner = Object.keys(room.players)
    .find(x => x !== loser);

  const msg = {
    type: "gameover",
    loser,
    winner
  };

  console.log(msg);

  for (const p of Object.values(room.players)) {
    send(p.ws, msg);
  }

  clearInterval(room.loop);

  delete rooms[room.id];
}

// ================= MATCH =================
function match() {

  const entries = Array.from(queue.entries());

  if (entries.length < 2) return;

  const [id1, a] = entries[0];
  const [id2, b] = entries[1];

  queue.delete(id1);
  queue.delete(id2);

  createRoom(
    { id: id1, ws: a.ws },
    { id: id2, ws: b.ws },
    false
  );
}

// ================= WS =================
wss.on("connection", ws => {

  const id = crypto.randomUUID();

  ws.id = id;

  console.log("CONNECTED:", id);

  ws.on("message", msg => {

    let data;

    try {
      data = JSON.parse(msg);
    } catch {
      return;
    }

    // ================= PLAY =================
    if (data.type === "play") {

      console.log("PLAYER ENTERED QUEUE:", id);

      queue.set(id, {
        ws,
        joinedAt: Date.now()
      });

      send(ws, {
        type: "waiting"
      });

      match();

      // ================= BOT AUTO =================
      setTimeout(() => {

        console.log("BOT TIMER FIRED:", id);

        const waiting = queue.get(id);

        // ya no está esperando
        if (!waiting) {
          console.log("NOT WAITING");
          return;
        }

        // ya tiene room
        if (ws.roomId) {
          console.log("ALREADY IN ROOM");
          return;
        }

        console.log("CREATING BOT ROOM");

        queue.delete(id);

        createRoom(
          { id, ws },
          { id: "BOT" },
          true
        );

      }, 3000);
    }

    // ================= INPUT =================
    if (data.type === "input") {

      const room = rooms[ws.roomId];

      if (!room || room.ended) return;

      const p = room.players[id];

      if (!p) return;

      // mover
      if (data.left) p.x -= 12;
      if (data.right) p.x += 12;

      p.x = Math.max(20, Math.min(780, p.x));

      // disparar
      if (data.fire && Date.now() > p.cd) {

        // si está arriba dispara hacia abajo
        const goingDown = p.y < 300;

        room.bullets.push({
          owner: id,
          x: p.x,
          y: goingDown ? p.y + 25 : p.y - 25,
          vy: goingDown ? 8 : -8
        });

        p.cd = Date.now() + 160;
      }
    }
  });

  // ================= CLOSE =================
  ws.on("close", () => {

    console.log("DISCONNECTED:", id);

    queue.delete(id);

    const room = rooms[ws.roomId];

    if (room && !room.ended) {

      room.ended = true;

      clearInterval(room.loop);

      delete rooms[room.id];
    }
  });
});

console.log("SERVER LISTO");
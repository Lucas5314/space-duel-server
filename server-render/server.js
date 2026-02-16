const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
console.log("✅ WS server en ws://localhost:8080");

let players = {};
let bullets = [];
let waiting = null;
let nextId = 1;

const SPEED = 16;        // velocidad rápida
const BULLET_SPEED = 3000 / 60;

function sendState(){
  const safePlayers = {};
  for(const id in players){
    const p = players[id];
    safePlayers[id] = { id:p.id, x:p.x, y:p.y, hp:p.hp };
  }

  const msg = JSON.stringify({
    type: "state",
    players: safePlayers,
    bullets
  });

  Object.values(players).forEach(p=>{
    if(p.ws.readyState === WebSocket.OPEN){
      p.ws.send(msg);
    }
  });
}

function resetGame(){
  players = {};
  bullets = [];
  waiting = null;
}

setInterval(()=>{
  // mover balas
  bullets.forEach(b => b.y += b.vy);
  bullets = bullets.filter(b => b.y > -40 && b.y < 640 && !b.dead);

  // colisiones
  bullets.forEach(b=>{
    Object.values(players).forEach(p=>{
      if(p.id !== b.owner &&
         Math.abs(p.x - b.x) < 25 &&
         Math.abs(p.y - b.y) < 25){
        p.hp--;
        b.dead = true;

        if(p.hp <= 0){
          const msg = JSON.stringify({ type:"gameover", loser:p.id });
          Object.values(players).forEach(pp=>{
            if(pp.ws.readyState === WebSocket.O
// redeploy 27-01-2027

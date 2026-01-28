const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log("✅ Space Duel WS en puerto", PORT);

let players = {};
let bullets = [];
let waiting = null;
let nextId = 1;

function broadcast(obj){
  const msg = JSON.stringify(obj);
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
  bullets.forEach(b => b.y += b.vy);
  bullets = bullets.filter(b => b.y>-50 && b.y<650);

  bullets.forEach(b=>{
    Object.values(players).forEach(p=>{
      if(
        p.id !== b.owner &&
        Math.abs(p.x-b.x)<25 &&
        Math.abs(p.y-b.y)<25
      ){
        p.hp--;
        b.dead=true;

        if(p.hp<=0){
          broadcast({ type:"gameover", loser:p.id });
          setTimeout(resetGame,1000);
        }
      }
    });
  });

  bullets = bullets.filter(b=>!b.dead);

  if(Object.keys(players).length===2){
    broadcast({
      type:"state",
      players:Object.values(players),
      projectiles:bullets
    });
  }
},1000/60);

wss.on("connection", ws=>{
  ws.on("message", msg=>{
    let data;
    try{ data = JSON.parse(msg); }catch{ return; }

    if(data.type==="play"){
      if(!waiting){
        waiting = ws;
        ws.send(JSON.stringify({type:"waiting"}));
      }else{
        const p1="p"+nextId++;
        const p2="p"+nextId++;

        players[p1]={ id:p1, ws:waiting, x:400, y:520, hp:3, cd:0 };
        players[p2]={ id:p2, ws,        x:400, y:80,  hp:3, cd:0 };

        waiting.send(JSON.stringify({type:"welcome", id:p1}));
        ws.send(JSON.stringify({type:"welcome", id:p2}));

        waiting=null;
      }
    }

    if(data.type==="input"){
      const p = Object.values(players).find(p=>p.ws===ws);
      if(!p) return;

      if(data.left)  p.x -= 16;
      if(data.right) p.x += 16;
      p.x = Math.max(30, Math.min(770, p.x));

      if(data.fire && Date.now()>p.cd){
        bullets.push({
          owner:p.id,
          x:p.x,
          y:p.y,
          vy:p.y>300 ? -30 : 30
        });
        p.cd = Date.now()+180;
      }
    }
  });

  ws.on("close", resetGame);
});

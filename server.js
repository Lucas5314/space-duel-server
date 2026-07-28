const express = require("express");
const db = require("./database/db");
const http = require("http");
const WebSocket = require("ws");
const crypto = require("crypto");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
 
// ===========================
// CREAR JUGADOR
// ===========================

app.post("/create-player", async (req,res)=>{
console.log("CREANDO JUGADOR:", req.body);

    const {
        username,
        country
    } = req.body;


    try{


        const result = await db.query(

            `
            INSERT INTO players
            (
                username,
                country
            )

            VALUES
            (
                $1,
                $2
            )

            RETURNING *
            `,

            [
                username,
                country
            ]

        );


        res.json({

            success:true,

            player:result.rows[0]

        });



    }catch(error){

    console.log("ERROR REAL:", error);

    res.json({
        success:false,
        error:error.message
    });

}


});

app.use(express.static(__dirname + "/web"));

app.get('/app-ads.txt', (req, res) => {
  res.sendFile(__dirname + '/app-ads.txt');
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

server.listen(process.env.PORT || 8080, () => {

  console.log("SERVER READY");
});

// ================= CONFIG =================

const FPS = 1000 / 60;

const WORLD_WIDTH = 900;

const PLAYER_TOP_Y = 120;
const PLAYER_BOTTOM_Y = 700;

const PLAYER_SPEED = 8;

const BULLET_SPEED = 14;

const FIRE_COOLDOWN = 250;

// ================= DATA =================

const waiting = [];

const {
    rooms,
    createRoom,
    removeRoom
} = require("./rooms");

const {
    activatePower,
    updatePowers
} = require("./powers");

// ================= PLAYER =================

function createPlayer(id, side, isBot = false, username = null){

  return {

    id,
    username,
    side,
    isBot,

    x: WORLD_WIDTH / 2,

    hp:40,

    left:false,
    right:false,

    targetX:null,

    fire:false,

    lastShot:0,


  };

}
function sendRoom(room,data){

  Object.values(room.sockets)
  .forEach(ws=>{

    if(ws.readyState === 1){

      ws.send(
        JSON.stringify(data)
      );
    }
  });
}

// ================= COUNTDOWN =================

function startCountdown(room){

  const values = [
    "3",
    "2",
    "1",
    "FIGHT"
  ];

  values.forEach((v,i)=>{

    setTimeout(()=>{

      sendRoom(room,{

        type:"countdown",

        value:v
      });

      if(v === "FIGHT"){

        room.started = true;
      }

    },i*1000);
  });
}

// ================= MATCH =================

function matchPlayers(){

  while(waiting.length >= 2){

    const a = waiting.shift();
    const b = waiting.shift();

    const room = createRoom(a,b);

    startCountdown(room);
  }
}

// ================= BOT =================

function createBotSocket(){

  return {

    id:
    "BOT_" +
    crypto.randomUUID(),

    isBot:true,

    readyState:1,

    send(){},
    close(){}
  };
}

// ================= CONNECTION =================

wss.on("connection",ws=>{

  ws.id =
  crypto.randomUUID();

  ws.send(JSON.stringify({

    type:"welcome",

    id:ws.id
  }));

  ws.on("message",raw=>{

    let msg;

    try{

      msg =
      JSON.parse(raw);

    }catch{

      return;
    }
    

    // PLAY
if(msg.type === "play"){

  ws.username = msg.username;

  waiting.push(ws);

  matchPlayers();

}

      // ==========================
      // BOT AFTER 10s
setTimeout(()=>{

    if(waiting.includes(ws)){

        console.log("CREANDO BOT PARA:", ws.id);

        waiting.splice(
            waiting.indexOf(ws),
            1
        );


        const bot = createBotSocket();


        const room = createRoom(ws,bot);


        console.log("SALA BOT:", room.id);


        startCountdown(room);

    }

},10000);
    

    // INPUT
if(msg.type === "input"){

      if(!ws.room) return;

      const room =
      rooms[ws.room];

      if(!room) return;

      const player =
      room.players.find(
        p=>p.id === ws.id
      );

      if(!player) return;

      player.left =
      !!msg.left;

      player.right =
      !!msg.right;

      if(msg.targetX != null){

        player.targetX =
        msg.targetX;
      }

      if(msg.fire){

        player.fire = true;
      }
    }
  
// POWERS
// ===========================

if(msg.type === "power"){

    if(!ws.room) return;

    const room = rooms[ws.room];

    if(!room) return;

    const player = room.players.find(
        p => p.id === ws.id
    );

    if(!player) return;

    activatePower(player, msg.power);

}

// ===========================
// INVISIBILIDAD (TEMPORAL)
// ===========================

if(msg.type === "invisible"){

    if(!ws.room) return;

    const room = rooms[ws.room];

    if(!room) return;

    const player = room.players.find(
        p => p.id === ws.id
    );

    if(!player) return;

    player.invisible = true;

    player.invisibleUntil = Date.now() + 5000;

}
});
  // CLOSE
  ws.on("close",()=>{

    const i =
    waiting.indexOf(ws);

    if(i !== -1){

      waiting.splice(i,1);
    }

    if(ws.room){

      const room =
      rooms[ws.room];

      if(room){

        sendRoom(room,{

          type:"gameover",

          loser:ws.id
        });

        delete rooms[ws.room];
      }
    }
  });
  });
  
// ================= LOOP =================

setInterval(async ()=>{

  for(const roomId in rooms){

    const room =
    rooms[roomId];

    if(!room.started)
    continue;
    console.log("SALA ACTIVA:", room.id);

    // ================= BOT AI =================
// ================= BOT AI =================

for(const p of room.players){

  if(!p.isBot)
  continue;

  const enemy =
  room.players.find(
    x => x.id !== p.id
  );

  p.targetX =
  enemy.x;

  if(Math.random() < 0.03){

    p.fire = true;

  }

}
  // ================= PLAYERS =================

for(const p of room.players){

  if(p.left)
  p.x -= PLAYER_SPEED;

  if(p.right)
  p.x += PLAYER_SPEED;

  if(p.targetX != null){

    p.x +=
    (p.targetX - p.x)
    * 0.18;
  }

  p.x = Math.max(
    60,
    Math.min(
      WORLD_WIDTH - 60,
      p.x
    )
  );

  // FIRE
if(

  p.fire &&

  Date.now()
  - p.lastShot
  > FIRE_COOLDOWN

){

  p.lastShot =
  Date.now();


  const isBottom =
p.side === "bottom";


const cannonOffsetX = 9.5;
const cannonOffsetY = 140
;


  room.projectiles.push({

  owner:p.id,

  x:p.x - cannonOffsetX,

  y:
  isBottom
  ? PLAYER_BOTTOM_Y - cannonOffsetY
  : PLAYER_TOP_Y + cannonOffsetY,

  vy:
  isBottom
  ? -BULLET_SPEED
  : BULLET_SPEED

});


  room.projectiles.push({

  owner:p.id,

  x:p.x + cannonOffsetX,

  y:
  isBottom
  ? PLAYER_BOTTOM_Y - cannonOffsetY
  : PLAYER_TOP_Y + cannonOffsetY,

  vy:
  isBottom
  ? -BULLET_SPEED
  : BULLET_SPEED

});


p.fire = false;

  // ================= INVISIBILITY =================

  if(

    p.invisible &&

    Date.now() > p.invisibleUntil

  ){

    p.invisible = false;

    

  }
   
}

}

    // ================= BULLETS =================

    for(

      let i =
      room.projectiles.length-1;

      i>=0;

      i--

    ){

      const b =
      room.projectiles[i];

      b.y += b.vy;

      // REMOVE
      if(

        b.y < -100 ||

        b.y > 1000

      ){

        room.projectiles.splice(i,1);

        continue;
      }

      // HIT
      for(const p of room.players){

        if(p.id === b.owner)
        continue;

        const targetY =

          p.side === "bottom"

          ? PLAYER_BOTTOM_Y

          : PLAYER_TOP_Y;

        const hit =

          Math.abs(
            b.x - p.x
          ) < 55 &&

          Math.abs(
            b.y - targetY
          ) < 55;

        if(hit){

          p.hp--;

          sendRoom(room,{

            type:"hit",

            x:b.x,
            y:b.y
          });

          room.projectiles.splice(i,1);

          // DEAD
          // DEAD
          console.log("ENTRANDO A MUERTE", p.username, p.hp);
if(p.hp <= 0){
  console.log("========== MUERTE ==========");
  const loser = p;

  const winner = room.players.find(
    player => player.id !== loser.id
  );


  console.log("GANADOR:", winner);
  console.log("PERDEDOR:", loser);


  // guardar recompensas sin bloquear el juego
if(winner){
  giveWinnerReward(winner)
  .then(()=>console.log("WIN REWARD OK"))
  .catch(err=>console.log("WIN REWARD ERROR", err));
}

if(loser){
  giveLoserReward(loser)
  .then(()=>console.log("LOSE REWARD OK"))
  .catch(err=>console.log("LOSE REWARD ERROR", err));
}

  sendRoom(room,{
    type:"gameover",
    loser:loser.id,
    winner:winner ? winner.id : null
  });


  delete rooms[roomId];

  break;
}
      }
    }

    // ================= STATE =================
 console.log("ENVIANDO STATE", room.players);
    sendRoom(room,{

      type:"state",

      players:room.players,

      projectiles:room.projectiles,

      portal:room.portal

    });
  }
}
},FPS);

// ================= RECOMPENSAS =================

async function giveWinnerReward(winner){
    console.log("DANDO PREMIO GANADOR:", winner.username);

  await db.query(
    `
    UPDATE players
    SET
      coins = coins + 100,
      xp = xp + 50,
      wins = wins + 1,
      games = games + 1
    WHERE username = $1
    `,
    [winner.username]
  );

}


async function giveLoserReward(loser){
    console.log("DANDO PREMIO GANADOR:", winner.username);

  await db.query(
    `
    UPDATE players
    SET
      coins = coins + 20,
      xp = xp + 20,
      losses = losses + 1,
      games = games + 1
    WHERE username = $1
    `,
    [loser.username]
  );

}

  

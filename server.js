const express = require("express");
const db = require("./database/db");
const http = require("http");
const WebSocket = require("ws");
const crypto = require("crypto");
const cors = require("cors");
const BOT_NAMES = require("./botnames");
const economy = require("./economy/coins");
const skinEconomy = require("./economy/skins");
const inventory = require("./economy/inventory");
const googlePurchases = require("./economy/googlePurchases");
const googlePlay = require("./economy/googlePlay");
const googleTransactions = require("./economy/googleTransactions");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client();

const GOOGLE_WEB_CLIENT_ID =
    "73289370828-9sq2pqa6vnk8ukki4bepa154hoke12eb.apps.googleusercontent.com";


const app = express();

app.use(express.json());
app.use(cors());
// ======================================
// GOOGLE LOGIN - LAUGH BATTLES
// ======================================

app.post("/api/auth/google", async (req, res) => {

    try {

        const { idToken, username } = req.body;

        // 1. VALIDAR DATOS

        if (!idToken || !username) {

            return res.status(400).json({
                success: false,
                error: "Faltan datos de autenticación."
            });

        }

        const cleanUsername = username.trim();

        if (cleanUsername.length < 3 || cleanUsername.length > 20) {

            return res.status(400).json({
                success: false,
                error: "Nombre de usuario inválido."
            });

        }

        // 2. VERIFICAR TOKEN CON GOOGLE

        const ticket = await googleClient.verifyIdToken({

            idToken: idToken,

            audience: GOOGLE_WEB_CLIENT_ID

        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email || !payload.sub || payload.email_verified !== true) {

            return res.status(401).json({
                success: false,
                error: "La identidad de Google no es válida."
            });

        }

        const googleId = payload.sub;
        const email = payload.email.toLowerCase();

        // 3. BUSCAR POR GOOGLE ID

        const googlePlayer = await db.query(

            `SELECT * FROM players
             WHERE google_id = $1
             LIMIT 1`,

            [googleId]

        );

        if (googlePlayer.rows.length > 0) {

            const player = googlePlayer.rows[0];

            if (player.email.toLowerCase() !== email) {

                return res.status(409).json({
                    success: false,
                    error: "La cuenta de Google no coincide con el correo registrado."
                });

            }

            return res.json({
                success: true,
                isNewPlayer: false,
                player: player
            });

        }

        // 4. BUSCAR POR EMAIL

        const emailPlayer = await db.query(

            `SELECT * FROM players
             WHERE email = $1
             LIMIT 1`,

            [email]

        );

        if (emailPlayer.rows.length > 0) {

            const player = emailPlayer.rows[0];

            // No permitir vincular una cuenta Google diferente.

            if (player.google_id !== googleId) {

                return res.status(409).json({
                    success: false,
                    error: "Este correo ya está vinculado a otra cuenta."
                });

            }

            return res.json({
                success: true,
                isNewPlayer: false,
                player: player
            });

        }

        // 5. CREAR JUGADOR NUEVO

        const result = await db.query(

            `INSERT INTO players
            (
                google_id,
                email,
                username
            )
            VALUES ($1, $2, $3)
            RETURNING *`,

            [
                googleId,
                email,
                cleanUsername
            ]

        );

        const player = result.rows[0];

        console.log("NUEVO JUGADOR GOOGLE:", player.username);

        return res.json({

            success: true,
            isNewPlayer: true,
            player: player

        });

    } catch (error) {

        console.error("ERROR GOOGLE LOGIN:", error);

        return res.status(500).json({

            success: false,
            error: "Error al autenticar con Google."

        });

    }

});
app.get("/api/player/:id/coins", async (req, res) => {

    const playerId = Number(req.params.id);

    if(!Number.isInteger(playerId)){
        return res.json({
            success:false,
            error:"INVALID_PLAYER_ID"
        });
    }

    try{

        const coins = await economy.getCoins(playerId);

        res.json({
            success:true,
            coins
        });

    }catch(error){

        console.log("ERROR CONSULTANDO MONEDAS:", error);

        res.json({
            success:false,
            error:error.message
        });

    }

});
// ======================================
// GOOGLE PLAY - PROCESAR COMPRA
// ======================================

// ======================================
// GOOGLE PLAY - PROCESAR COMPRA
// ======================================

app.post("/api/purchases/google", async (req, res) => {
    const {
        playerId,
        productId,
        purchaseToken
    } = req.body;

    // -------------------------------
    // 1. VALIDAR PLAYER ID
    // -------------------------------
    const numericPlayerId = Number(playerId);

    if (!Number.isInteger(numericPlayerId)) {
        return res.status(400).json({
            success: false,
            error: "INVALID_PLAYER_ID"
        });
    }

    // -------------------------------
    // 2. VALIDAR PRODUCTO
    // -------------------------------
    if (
        typeof productId !== "string" ||
        !googlePurchases.isValidProduct(productId)
    ) {
        return res.status(400).json({
            success: false,
            error: "INVALID_PRODUCT_ID"
        });
    }

    // -------------------------------
    // 3. VALIDAR TOKEN
    // -------------------------------
    if (
        typeof purchaseToken !== "string" ||
        purchaseToken.length === 0
    ) {
        return res.status(400).json({
            success: false,
            error: "INVALID_PURCHASE_TOKEN"
        });
    }

    try {
        const pack = googlePurchases.getCoinPack(productId);

        console.log(
            "🛒 COMPRA GOOGLE PLAY RECIBIDA:",
            {
                playerId: numericPlayerId,
                productId,
                coins: pack.coins
            }
        );

        // -------------------------------
        // 4. VERIFICAR COMPRA CON GOOGLE
        // -------------------------------
        console.log("🔎 VERIFICANDO COMPRA CON GOOGLE PLAY...");

        const purchase = await googlePlay.getProductPurchase(
            productId,
            purchaseToken
        );

        console.log("📦 RESPUESTA GOOGLE PLAY:", purchase);

        // purchaseState: 0 = Comprado, 1 = Cancelado, 2 = Pendiente
        if (!purchase || purchase.purchaseState !== 0) {
            return res.status(409).json({
                success: false,
                error: "PURCHASE_NOT_COMPLETED",
                purchaseState: purchase ? purchase.purchaseState : "UNKNOWN"
            });
        }

        // -------------------------------
        // 5. REGISTRAR EN LA BD (ANTI-FRAUDE)
        // -------------------------------
        const registered = await googleTransactions.registerPurchase({
            playerId: numericPlayerId,
            productId,
            purchaseToken,
            coins: pack.coins
        });

        if (!registered.created) {
            console.log("⚠️ PURCHASE TOKEN YA UTILIZADO O DUPLICADO");
            return res.status(400).json({
                success: false,
                error: "TOKEN_ALREADY_USED"
            });
        }

        // -------------------------------
        // 6. ACREDITAR MONEDAS AL JUGADOR
        // -------------------------------
        const newBalance = await economy.addCoins(
            numericPlayerId,
            pack.coins
        );

        console.log(
            "🪙 MONEDAS ACREDITADAS:",
            {
                playerId: numericPlayerId,
                coins: pack.coins,
                newBalance
            }
        );

        // -------------------------------
        // 7. CONSUMIR EL PRODUCTO EN GOOGLE PLAY
        // -------------------------------
        console.log("🔥 CONSUMIENDO COMPRA EN GOOGLE PLAY...");

        await googlePlay.consumeProduct(
            productId,
            purchaseToken
        );

        console.log("✅ COMPRA GOOGLE COMPLETADA Y CONSUMIDA");

        // -------------------------------
        // 8. RESPONDER AL CLIENTE
        // -------------------------------
        return res.json({
            success: true,
            coins: newBalance,
            message: "¡Compra procesada con éxito!"
        });

    } catch (error) {
        console.error(
            "❌ ERROR PROCESANDO COMPRA GOOGLE:",
            error
        );

        return res.status(500).json({
            success: false,
            error: error.message || "GOOGLE_PURCHASE_ERROR"
        });
    }
});
// ==========================================
// OBTENER CATÁLOGO DE SKINS
// ==========================================

app.get("/api/skins", (req, res) => {

    try {

        const skins = skinEconomy.getAllSkins();

        res.json({
            success: true,
            skins
        });

    } catch (error) {

        console.log("ERROR OBTENIENDO SKINS:", error);

        res.status(500).json({
            success: false,
            error: "SKINS_ERROR"
        });

    }

});


// ==========================================
// COMPRAR SKIN CON MONEDAS
// ==========================================

app.post("/api/skins/purchase", async (req, res) => {

    const { playerId, skinId } = req.body;

    if (!Number.isInteger(Number(playerId))) {

        return res.status(400).json({
            success: false,
            error: "INVALID_PLAYER_ID"
        });

    }

    if (typeof skinId !== "string" || skinId.length === 0) {

        return res.status(400).json({
            success: false,
            error: "INVALID_SKIN_ID"
        });

    }

    try {

        const result = await skinEconomy.purchaseSkin(
            Number(playerId),
            skinId
        );

        res.json({
            success: true,
            purchase: result
        });

    } catch (error) {

        console.log("ERROR COMPRANDO SKIN:", error);

        if (error.message === "SKIN_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                error: "SKIN_NOT_FOUND"
            });
        }

        if (error.message === "INSUFFICIENT_COINS") {
            return res.status(409).json({
                success: false,
                error: "INSUFFICIENT_COINS"
            });
        }

        if (error.message === "PLAYER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                error: "PLAYER_NOT_FOUND"
            });
        }

        res.status(500).json({
            success: false,
            error: "PURCHASE_ERROR"
        });

    }

})
// ==========================================
// OBTENER INVENTARIO DE SKINS DEL JUGADOR
// ==========================================

app.get("/api/player/:id/skins", async (req, res) => {

    const playerId = Number(req.params.id);

    if (!Number.isInteger(playerId)) {

        return res.status(400).json({
            success: false,
            error: "INVALID_PLAYER_ID"
        });

    }

    try {

        const skins = await inventory.getPlayerSkins(playerId);

        const equipada = await inventory.getEquippedSkin(playerId);

        res.json({
            success: true,
            skins,
            equipada
        });

    } catch (error) {

        console.log("ERROR OBTENIENDO INVENTARIO:", error);

        if (error.message === "PLAYER_NOT_FOUND") {

            return res.status(404).json({
                success: false,
                error: "PLAYER_NOT_FOUND"
            });

        }

        res.status(500).json({
            success: false,
            error: "INVENTORY_ERROR"
        });

    }

});


// ==========================================
// EQUIPAR SKIN
// ==========================================

app.post("/api/player/:id/skins/equip", async (req, res) => {

    const playerId = Number(req.params.id);
    const { skinId } = req.body;

    if (!Number.isInteger(playerId)) {

        return res.status(400).json({
            success: false,
            error: "INVALID_PLAYER_ID"
        });

    }

    if (typeof skinId !== "string" || skinId.length === 0) {

        return res.status(400).json({
            success: false,
            error: "INVALID_SKIN_ID"
        });

    }

    try {

        // Verificar que la skin existe en nuestro catálogo
        const skin = skinEconomy.getSkin(skinId);

        if (!skin) {

            return res.status(404).json({
                success: false,
                error: "SKIN_NOT_FOUND"
            });

        }

        // La función del inventario comprueba
        // que el jugador realmente posee la skin.
        const equipada = await inventory.equipSkin(
            playerId,
            skinId
        );

        res.json({
            success: true,
            equipada
        });

    } catch (error) {

        console.log("ERROR EQUIPANDO SKIN:", error);

        if (error.message === "SKIN_NOT_OWNED") {

            return res.status(403).json({
                success: false,
                error: "SKIN_NOT_OWNED"
            });

        }

        if (error.message === "PLAYER_NOT_FOUND") {

            return res.status(404).json({
                success: false,
                error: "PLAYER_NOT_FOUND"
            });

        }

        res.status(500).json({
            success: false,
            error: "EQUIP_ERROR"
        });

    }

});




 
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

  if (isBot && !username) {
        username = BOT_NAMES[
            Math.floor(Math.random() * BOT_NAMES.length)
        ];
    }


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
console.log("AAAAAAAA MATCH FOUND NUEVO");

console.log("CREANDO MATCH");
console.log(a.id,b.id);


// AVISA AL MATCHMAKING QUE ENCONTRÓ RIVAL
sendRoom(room,{
  type:"matchFound"
});


console.log("MATCH FOUND ENVIADO");


// ESPERA PARA MOSTRAR LA INTRO DEL MAPA
setTimeout(()=>{

  sendRoom(room,{
    type:"matchIntro"
  });


  console.log("MATCH INTRO ENVIADO");


},1500);


// DESPUÉS DEL MAPA Y MODO, INICIA COUNTDOWN
setTimeout(()=>{

  startCountdown(room);

},4000);
}
}
// ================= BOT =================

function createBotSocket(){

  const botName = BOT_NAMES[
    Math.floor(Math.random() * BOT_NAMES.length)
  ];

  return {

    id:
    "BOT_" +
    crypto.randomUUID(),

    username: botName,

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
        // aplicar reglas del mundo
    //applyWorldRules(room);

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

    console.log("DANDO PREMIO PERDEDOR:", loser.username);

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

  

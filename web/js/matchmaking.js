// ===========================
// MÚSICA
// ===========================

const music = new Audio("assets/audio/matchmaking.mp3");

music.loop = true;
music.volume = 0.4;

// Iniciar la música en la primera interacción
document.addEventListener("click", () => {

    music.play().catch(err => console.log(err));

}, { once:true });


// ===========================
// ELEMENTOS
// ===========================

const status = document.getElementById("status");
const cancel = document.getElementById("cancel");

const connectionText = document.getElementById("connectionText");
const connectionIcon = document.getElementById("connectionIcon");

const searchTime = document.getElementById("searchTime");
const ping = document.getElementById("ping");

const region = document.getElementById("region");

const playersOnline = document.getElementById("playersOnline");
const playersSearching = document.getElementById("playersSearching");


// ===========================
// MENSAJES
// ===========================

const messages = [

    "Escaneando la galaxia...",
    "Buscando pilotos...",
    "Analizando señales...",
    "Abriendo portal...",
    "Preparando combate..."

];

let messageIndex = 0;

setInterval(()=>{

    messageIndex++;

    if(messageIndex >= messages.length){

        messageIndex = 0;

    }

    status.textContent = messages[messageIndex];

},2500);


// ===========================
// TEMPORIZADOR
// ===========================

let seconds = 0;

setInterval(()=>{

    seconds++;

    const min = String(Math.floor(seconds / 60)).padStart(2,"0");
    const sec = String(seconds % 60).padStart(2,"0");

    searchTime.textContent = `${min}:${sec}`;

},1000);


// ===========================
// DATOS TEMPORALES
// ===========================

region.textContent = "Sudamérica";

playersOnline.textContent = "12 pilotos conectados";

playersSearching.textContent = "3 buscando combate";


// ===========================
// PING SIMULADO
// ===========================

setInterval(()=>{

    const value = Math.floor(Math.random()*18)+28;

    ping.textContent = value + " ms";

},1500);


// ===========================
// ESTADO DE CONEXIÓN
// ===========================

connectionText.textContent = "Conectado";

connectionIcon.textContent = "🟢";


// ===========================
// CANCELAR
// ===========================

cancel.onclick = ()=>{

    music.pause();

    music.currentTime = 0;

    location.href = "profile.html";

};
const ws = new WebSocket(
    "wss://space-duel-server-1.onrender.com"
);

ws.onmessage = e => {

    const msg = JSON.parse(e.data);


    console.log("Matchmaking recibió:", msg);


    if(msg.type === "matchIntro"){

        status.textContent = "¡Piloto encontrado!";


        music.pause();

        music.currentTime = 0;


        setTimeout(()=>{

            location.href = "game.html";

        },1500);

    }

};
ws.onopen = ()=>{

    const player = JSON.parse(
        localStorage.getItem("player")
    );


    ws.send(JSON.stringify({

        type:"play",

        username: player?.username

    }));

};
// =======================================================
// TEMPORAL
//
// Cuando el servidor encuentre un rival,
// después esto será reemplazado por WebSocket.
//
// =======================================================


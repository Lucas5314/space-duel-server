// ===========================
// MÚSICA
// ===========================

const music = new Audio("assets/audio/matchmaking.mp3");

music.loop = true;
music.volume = 0.4;

document.addEventListener("click", () => {
    music.play().catch(() => {});
}, { once: true });


// ===========================
// ELEMENTOS
// ===========================

const status = document.getElementById("status");
const cancel = document.getElementById("cancel");


// ===========================
// MENSAJES
// ===========================

const messages = [
    "Escaneando mundos...",
    "Buscando pilotos...",
    "Analizando señales...",
    "Abriendo portal...",
    "Preparando combate..."
];

let messageIndex = 0;

if (status) {
    setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        status.textContent = messages[messageIndex];
    }, 2500);
}


// ===========================
// CANCELAR
// ===========================

if (cancel) {
    cancel.addEventListener("click", () => {
        music.pause();
        music.currentTime = 0;

        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }

        location.href = "profile.html";
    });
}


// ===========================
// WEBSOCKET
// ===========================

const player = JSON.parse(localStorage.getItem("player"));

const ws = new WebSocket(
    "wss://space-duel-server-1.onrender.com"
);

ws.onopen = () => {

    console.log("Conectado al matchmaking");

    ws.send(JSON.stringify({
        type: "play",
        username: player?.username,
        playerId: player?.id
    }));

};

ws.onmessage = (e) => {

    const msg = JSON.parse(e.data);

    console.log("Matchmaking recibió:", msg);

    if (msg.type === "matchFound") {

        if (status) {
            status.textContent = "¡Piloto encontrado!";
        }

        music.pause();
        music.currentTime = 0;

        setTimeout(() => {
            location.href = "game.html";
        }, 1500);

    }

};

ws.onerror = (error) => {
    console.error("Error WebSocket:", error);
};

ws.onclose = () => {
    console.log("Conexión matchmaking cerrada");
};


// ===========================
// ESCÁNER VISUAL DE MUNDOS
// ===========================

const mundos = [
    "assets/mapasaelegir/oeste.jpg",
    "assets/mapasaelegir/espacio.jpg",
    "assets/mapasaelegir/bosque.jpg",
    "assets/mapasaelegir/pirata.jpg",
    "assets/mapasaelegir/hielo.jpg",
    "assets/mapasaelegir/volcan.jpg"
];

const tarjetas = document.querySelectorAll(".worldCard img");

tarjetas.forEach((imagen, indice) => {

    let posicion = indice;

    setInterval(() => {

        posicion = (posicion + 1) % mundos.length;

        imagen.src = mundos[posicion];

    }, 180 + (indice * 70));

});
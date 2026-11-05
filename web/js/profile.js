//import "./back-button.js";
//import { worlds } from "./worlds.js";

import { ScreenOrientation } from '@capacitor/screen-orientation';

// ===========================
// CONFIGURACIÓN DE URL DEL BACKEND
// ===========================
const API_URL = "https://space-duel-server-1.onrender.com";

// ===========================
// VALIDACIÓN DE SESIÓN REAL
// ===========================
const savedPlayer = JSON.parse(localStorage.getItem("player"));

if (!savedPlayer || localStorage.getItem("playerCreated") !== "true") {
    // Si no hay sesión iniciada o no se creó el jugador, lo mandamos al registro
    location.href = "createplayer.html";
}

// ===========================
// ORIENTACIÓN HORIZONTAL (CAPACITOR)
// ===========================
async function lockLandscape(){
    try {
        await ScreenOrientation.lock({
            orientation: "landscape"
        });
        console.log("Perfil en horizontal");
    } catch (error) {
        console.log("Error orientación:", error);
    }
}

lockLandscape();

// ===========================
// SISTEMA DE AUDIO (EFECTOS Y MÚSICA)
// ===========================

const clickSound = new Audio("assets/audio/click.m4a");
clickSound.volume = 0.4;

const bgMusic = new Audio("assets/audio/profile.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;

function startMusic() {
    if (localStorage.getItem("music") !== "false") {
        bgMusic.play().then(() => {
            console.log("🎵 Música de perfil sonando.");
        }).catch(() => {
            console.log("⏳ Autoplay bloqueado temporalmente, esperando interacción táctil...");
            
            const unlockAudio = () => {
                bgMusic.play().catch(() => {});
                window.removeEventListener("pointerdown", unlockAudio);
                window.removeEventListener("keydown", unlockAudio);
            };

            window.addEventListener("pointerdown", unlockAudio, { once: true });
            window.addEventListener("keydown", unlockAudio, { once: true });
        });
    }
}

// Iniciar música al cargar
startMusic();


// ===========================
// CARGAR DATOS DEL PERFIL EN PANTALLA
// ===========================

const usernameDisplay = document.getElementById("usernameDisplay"); 
const coinsAmountElement = document.getElementById("coinsAmount");

if (savedPlayer) {
    // 1. Mostrar el nombre de usuario real
    if (usernameDisplay) {
        usernameDisplay.textContent = savedPlayer.username;
    }

    // 2. Mostrar las monedas iniciales guardadas en la sesión
    if (coinsAmountElement && savedPlayer.coins !== undefined) {
        coinsAmountElement.textContent = savedPlayer.coins;
    }

    // 3. Sincronizar saldo fresco desde el servidor en segundo plano
    cargarMonedasMenu();
}


// ===========================
// JUGAR
// ===========================

const playBtn = document.getElementById("playBtn");
if (playBtn) {
    playBtn.onclick = () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
        location.href = "matchmaking.html";
    };
}


// ===========================
// SKINS / VESTUARIO
// ===========================

const skinsBtn = document.getElementById("skinsBtn");
if (skinsBtn) {
    skinsBtn.onclick = () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
        location.href = "skins.html";
    };
}


// ===========================
// CONFIGURACIÓN
// ===========================

const settingsBtn = document.getElementById("settingsBtn");
if (settingsBtn) {
    settingsBtn.onclick = () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
        location.href = "settings.html";
    };
}


// ===========================
// NAVE Y ROTACIÓN 360 EN EL CENTRO
// ===========================

const ship = document.getElementById("ship");
const frames = [];

const activeSkin = savedPlayer?.currentSkin || "demo3d";

for (let i = 0; i < 36; i++) {
    const angle = String(i * 10).padStart(3, "0");
    frames.push(`assets/ships/${activeSkin}/ship_${angle}.png`);
}

let currentFrame = 0;
let startX = 0;

function updateShip() {
    if (!ship) return;
    ship.src = frames[currentFrame];
}

if (ship && frames.length > 0) {
    ship.src = frames[0];

    ship.addEventListener("pointerdown", e => {
        startX = e.clientX;
    });

    window.addEventListener("pointermove", e => {
        if (e.buttons !== 1) return;
        const dx = e.clientX - startX;

        if (Math.abs(dx) > 8) {
            if (dx > 0) {
                currentFrame = (currentFrame + 1) % frames.length;
            } else {
                currentFrame = (currentFrame - 1 + frames.length) % frames.length;
            }

            updateShip();
            startX = e.clientX;
        }
    });
}


// ===========================
// NEWS POPUP
// ===========================

const newsPopup = document.getElementById("newsPopup");
const popupClose = document.getElementById("popupClose");

if (newsPopup && popupClose) {
    newsPopup.style.display = "flex";
    popupClose.addEventListener("click", () => {
        newsPopup.style.display = "none";
    });
}


// ===========================
// MONEDAS
// ===========================

const coinsBtn = document.getElementById("coinsBtn");

if (!coinsBtn) {
    console.error("❌ NO SE ENCONTRÓ coinsBtn");
} else {
    coinsBtn.addEventListener("click", function () {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
        window.location.href = "./tienda.html";
    });
}

async function cargarMonedasMenu() {
    if (!savedPlayer || !savedPlayer.id) return;

    try {
        const response = await fetch(`${API_URL}/api/player/${savedPlayer.id}/coins`);
        const data = await response.json();

        if (data.success && coinsAmountElement) {
            coinsAmountElement.textContent = data.coins;
            
            savedPlayer.coins = data.coins;
            localStorage.setItem("player", JSON.stringify(savedPlayer));
            
            console.log("🪙 Monedas sincronizadas con la BD:", data.coins);
        }
    } catch (error) {
        console.error("Error obteniendo monedas en el menú:", error);
    }
}


// ===========================
// EMOTE
// ===========================

const emoteBtn = document.getElementById("emoteBtn");
const emoteVideo = document.getElementById("emoteVideo");

if (emoteBtn && emoteVideo && ship) {
    emoteBtn.addEventListener("click", () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});

        ship.style.visibility = "hidden";
        emoteVideo.style.display = "block";
        emoteVideo.currentTime = 0;

        emoteVideo.play().catch(error => {
            console.error("❌ Error reproduciendo emote:", error);
        });
    });

    emoteVideo.addEventListener("ended", () => {
        emoteVideo.style.display = "none";
        ship.style.visibility = "visible";
    });
}
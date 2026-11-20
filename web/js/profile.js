// Comentado para evitar errores si lo pruebas en navegador web de escritorio
// import { ScreenOrientation } from '@capacitor/screen-orientation';

const API_URL = "https://space-duel-server-1.onrender.com";

const savedPlayer = JSON.parse(localStorage.getItem("player"));

if (!savedPlayer || localStorage.getItem("playerCreated") !== "true") {
    location.href = "createplayer.html";
}

async function lockLandscape(){
    try {
        if (window.ScreenOrientation) {
            await window.ScreenOrientation.lock({ orientation: "landscape" });
        }
    } catch (error) {
        console.log("Orientación no soportada en este entorno.");
    }
}

lockLandscape();

document.addEventListener("DOMContentLoaded", () => {
    // ===========================
    // SISTEMA DE AUDIO
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
    startMusic();

    // ===========================
    // CARGAR DATOS DEL PERFIL
    // ===========================
    const usernameDisplay = document.getElementById("usernameDisplay"); 
    const coinsAmountElement = document.getElementById("coinsAmount");

    if (savedPlayer) {
        if (usernameDisplay) {
            usernameDisplay.textContent = savedPlayer.username || "Jugador";
        }
        if (coinsAmountElement && savedPlayer.coins !== undefined) {
            coinsAmountElement.textContent = savedPlayer.coins;
        }
        cargarMonedasMenu();
    }

    // ===========================
    // NAVEGACIÓN DE BOTONES
    // ===========================
    const userInfoCard = document.getElementById("userInfoCard");
    if (userInfoCard) {
        userInfoCard.addEventListener("click", () => {
            window.location.href = "./userinfo.html";
        });
    }

    const playBtn = document.getElementById("playBtn");
    if (playBtn) {
        playBtn.onclick = () => {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
            location.href = "matchmaking.html";
        };
    }

    const skinsBtn = document.getElementById("skinsBtn");
    if (skinsBtn) {
        skinsBtn.onclick = () => {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
            location.href = "skins.html";
        };
    }

    const settingsBtn = document.getElementById("settingsBtn");
    if (settingsBtn) {
        settingsBtn.onclick = () => {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
            location.href = "settings.html";
        };
    }

    // ===========================
    // NAVE Y ROTACIÓN (4 ÁNGULOS)
    // ===========================
    const ship = document.getElementById("ship");
    const frames = [];
    const activeSkin = savedPlayer?.currentSkin || "demo3d";

    for (let i = 0; i < 4; i++) {
        const angle = String(i * 90).padStart(3, "0"); // "000", "090", "180", "270"
        frames.push(`assets/ships/${activeSkin}/ship_${angle}.png`);
    }

    let currentFrame = 0;
    let startX = 0;
    let isDragging = false;

    if (ship && frames.length > 0) {
        ship.style.touchAction = "none";
        ship.src = frames[0];

        ship.addEventListener("pointerdown", e => {
            isDragging = true;
            startX = e.clientX;
            ship.setPointerCapture(e.pointerId);
        });

        ship.addEventListener("pointermove", e => {
            if (!isDragging) return;
            const dx = e.clientX - startX;

            if (Math.abs(dx) > 12) {
                if (dx > 0) {
                    currentFrame = (currentFrame + 1) % frames.length;
                } else {
                    currentFrame = (currentFrame - 1 + frames.length) % frames.length;
                }

                ship.src = frames[currentFrame];
                startX = e.clientX;
            }
        });

        const stopDragging = (e) => {
            isDragging = false;
            try { ship.releasePointerCapture(e.pointerId); } catch (_) {}
        };

        ship.addEventListener("pointerup", stopDragging);
        ship.addEventListener("pointercancel", stopDragging);
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
    if (coinsBtn) {
        coinsBtn.addEventListener("click", function () {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
            window.location.href = "./tienda.html";
        });
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

            ship.style.display = "none";
            emoteVideo.style.display = "block";
            emoteVideo.currentTime = 0;

            emoteVideo.play().catch(error => {
                console.error("❌ Error reproduciendo emote:", error);
            });
        });

        emoteVideo.addEventListener("ended", () => {
            emoteVideo.style.display = "none";
            ship.style.display = "block";
        });
    }
});

async function cargarMonedasMenu() {
    if (!savedPlayer || !savedPlayer.id) return;

    try {
        const response = await fetch(`${API_URL}/api/player/${savedPlayer.id}/coins`);
        const data = await response.json();
        const coinsAmountElement = document.getElementById("coinsAmount");

        if (data.success && coinsAmountElement) {
            coinsAmountElement.textContent = data.coins;
            savedPlayer.coins = data.coins;
            localStorage.setItem("player", JSON.stringify(savedPlayer));
        }
    } catch (error) {
        console.error("Error obteniendo monedas en el menú:", error);
    }
}
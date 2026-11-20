import { ScreenOrientation } from '@capacitor/screen-orientation';

// =================================
// ORIENTACIÓN HORIZONTAL
// =================================

async function lockLandscape() {
    try {
        await ScreenOrientation.lock({
            orientation: "landscape"
        });
    } catch (error) {
        console.log("Error orientación:", error);
    }
}

lockLandscape();

// =================================
// SESIÓN
// =================================

const player = JSON.parse(localStorage.getItem("player"));

if (!player || localStorage.getItem("playerCreated") !== "true") {
    location.href = "createplayer.html";
}

// =================================
// MOSTRAR INFORMACIÓN
// =================================

if (player) {

    document.getElementById("username").textContent =
        player.username || "Jugador";

    document.getElementById("games").textContent =
        player.games ?? 0;

    document.getElementById("wins").textContent =
        player.wins ?? 0;

    document.getElementById("losses").textContent =
        player.losses ?? 0;

    document.getElementById("level").textContent =
        player.level ?? 1;

    document.getElementById("playerId").textContent =
        player.id ?? "---";

    document.getElementById("cardLevel").textContent =
        `LV. ${player.level ?? 1}`;

}

// =================================
// VOLVER
// =================================

const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", () => {

    location.href = "profile.html";

});
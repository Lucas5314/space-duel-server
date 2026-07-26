// ===========================
// MÚSICA DE PERFIL
// ===========================
//import { ScreenOrientation } from '@capacitor/screen-orientation';
async function lockLandscape(){

    try{

        await ScreenOrientation.lock({
            orientation:"landscape"
        });

        console.log("Perfil en horizontal");

    }catch(error){

        console.log("Error orientación:", error);

    }

}


lockLandscape();
const bgMusic = new Audio("assets/audio/profile.mp3");

bgMusic.loop = true;
bgMusic.volume = 0.5;


// Iniciar música respetando configuración

function startMusic(){

    if(localStorage.getItem("music") !== "false"){

        bgMusic.play().catch(()=>{});

    }

}


// Los navegadores móviles bloquean autoplay,
// por eso inicia al primer toque

document.addEventListener("click", startMusic, { once:true });




// ===========================
// CARGAR PERFIL
// ===========================

const savedPlayer = JSON.parse(localStorage.getItem("player"));


if(savedPlayer){

    // Mostrar datos guardados inmediatamente
    document.getElementById("playerName").textContent =
        savedPlayer.username;

    document.querySelector(".flag").textContent =
        savedPlayer.country;


    fetch("https://space-duel-server.onrender.com/player/" + savedPlayer.id)

        .then(res => res.json())

        .then(player => {

            document.getElementById("playerName").textContent =
                player.username;

            document.querySelector(".flag").textContent =
                player.country;

            document.getElementById("wins").textContent =
                player.wins;

            document.getElementById("losses").textContent =
                player.losses;

            document.getElementById("games").textContent =
                player.games;

            document.getElementById("ship").src =
                "assets/ships/" + player.skin + ".png";

        })

        .catch(error => {

            console.log("Error cargando jugador:", error);

        });

}


// ===========================
// JUGAR
// ===========================

document.getElementById("playBtn").onclick = () => {

    location.href = "matchmaking.html";

};




// ===========================
// SKINS
// ===========================

document.getElementById("skinsBtn").onclick = () => {

    location.href = "skins.html";

};




// ===========================
// CONFIGURACIÓN
// ===========================

document.getElementById("settingsBtn").onclick = () => {

    location.href = "settings.html";

};
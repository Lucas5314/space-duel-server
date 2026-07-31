// ===========================
// MÚSICA DE PERFIL
// ===========================
const clickSound = new Audio("assets/audio/click.m4a");

clickSound.volume = 0.4;
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

    clickSound.currentTime = 0;
    clickSound.play();

    location.href = "matchmaking.html";

};



// ===========================
// SKINS
// ===========================

document.getElementById("skinsBtn").onclick = () => {

    console.log("CLICK SKINS");

    clickSound.currentTime = 0;

    clickSound.play()
    .then(()=>{
        console.log("SONIDO REPRODUCIDO");
    })
    .catch(e=>{
        console.log("ERROR SONIDO:", e);
    });

    location.href="skins.html";

};



// ===========================
// CONFIGURACIÓN
// ===========================

document.getElementById("settingsBtn").onclick = () => {

    clickSound.currentTime = 0;
    clickSound.play();

    location.href = "settings.html";

};
const ship = document.getElementById("ship");

const frames = [];
for(let i = 0; i < 36; i++){
    const angle = String(i * 10).padStart(3, "0");
    frames.push(`assets/ships/demo3d/ship_${angle}.png`);
}

let currentFrame = 0;
let startX = 0;

function updateShip(){
    ship.src = frames[currentFrame];
}

ship.addEventListener("pointerdown", e=>{
    startX = e.clientX;
});

window.addEventListener("pointermove", e=>{

    if(e.buttons !== 1) return;

    const dx = e.clientX - startX;

    if(Math.abs(dx) > 8){

        if(dx > 0){

            currentFrame = (currentFrame + 1) % frames.length;

        }else{

            currentFrame = (currentFrame - 1 + frames.length) % frames.length;

        }

        updateShip();
        startX = e.clientX;

    }

});
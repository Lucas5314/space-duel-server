// ===============================
// AUDIO MATCHMAKING
// ===============================

const matchmakingMusic =
new Audio("assets/audio/versus.mp3");

matchmakingMusic.loop = true;
matchmakingMusic.volume = 0.5;


function startMusic(){

    if(localStorage.getItem("music") !== "false"){

        matchmakingMusic.play().catch(()=>{});

    }

}


// Inicia al primer toque por bloqueo del navegador

document.addEventListener(
    "click",
    startMusic,
    {once:true}
);




// ===============================
// ELEMENTOS
// ===============================

const playerName =
document.getElementById("playerName");

const enemyName =
document.getElementById("enemyName");




// ===============================
// CARGAR DATOS DEL JUGADOR
// ===============================

const player =
JSON.parse(localStorage.getItem("player"));


if(player){

    playerName.textContent =
    player.username;

}else{

    playerName.textContent =
    "JUGADOR";

}




// ===============================
// RIVAL
// ===============================

// El servidor reemplazará este nombre
// cuando encuentre un oponente real.

enemyName.textContent =
"BUSCANDO...";




// ===============================
// IR A LA BATALLA
// ===============================

setTimeout(()=>{

    matchmakingMusic.pause(); // detener música antes de entrar

    window.location.href =
    "game.html";

},4000);
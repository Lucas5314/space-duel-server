// ===============================
// ELEMENTOS
// ===============================

const button =
document.getElementById("continueBtn");


const player =
JSON.parse(localStorage.getItem("player"));




// ===============================
// AUDIO
// ===============================

// ===============================
// AUDIO
// ===============================

const resultMusic = new Audio("assets/audio/result.mp3");

resultMusic.loop = true;
resultMusic.volume = 0.5;


function startResultMusic(){

    if(localStorage.getItem("music") !== "false"){

        resultMusic.play()
        .then(()=>{
            console.log("Música iniciada");
        })
        .catch(error=>{
            console.log("Audio bloqueado:", error);
        });

    }

}


// Iniciar al primer toque

document.addEventListener(
    "click",
    startResultMusic,
    {once:true}
);



// ===============================
// RESULTADO
// ===============================

// Más adelante el servidor enviará:
//
// - victoria o derrota
// - XP ganada
// - nivel
// - estadísticas actualizadas
//
// Aquí podremos cambiar:
//
// victoria -> win.mp3
// derrota -> lose.mp3




// ===============================
// CONTINUAR
// ===============================

button.onclick = ()=>{


    // sonido de botón (futuro)

    window.location.href =
    "profile.html";


};
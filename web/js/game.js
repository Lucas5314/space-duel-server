const battleMusic = new Audio("assets/audio/battle.mp3");

battleMusic.loop = true;
battleMusic.volume = 0.4;

// Los navegadores permiten reproducir audio
// después de una interacción del usuario.
document.addEventListener("click", () => {

    battleMusic.play().catch(err => console.log(err));

}, { once:true });

// Función para detener la música
function stopBattleMusic(){

    battleMusic.pause();
    battleMusic.currentTime = 0;

}
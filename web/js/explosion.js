export function showExplosion(state, loserId, myId, WORLD_WIDTH) {

    const explosion =
        document.getElementById("explosionVideo");

    const loser =
        state.players.find(
            p => p.id === loserId
        );

    if(loser){

        const x =
            (loser.x / WORLD_WIDTH) * innerWidth;

        const y =
            (loser.id === myId)
            ? innerHeight - 130
            : 130;

        explosion.style.left =
            (x - 100) + "px";

        explosion.style.top =
            (y - 100) + "px";

    }

    explosion.style.display = "block";

    explosion.currentTime = 0;

    explosion.play();

    setTimeout(()=>{

        location.href = "result.html";

    },2000);

}
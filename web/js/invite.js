const input = document.getElementById("playerName");
const button = document.getElementById("inviteBtn");
const status = document.getElementById("status");



button.onclick = ()=>{


    let player = input.value.trim();



    if(player === ""){

        status.innerHTML =
        "⚠️ Escribe un nombre primero";

        return;

    }



    button.innerHTML =
    "⌛ INVITANDO...";


    button.disabled = true;



    status.innerHTML =
    "🚀 Invitación enviada a " + player;



    setTimeout(()=>{


        button.innerHTML =
        "⚔️ INVITAR DE NUEVO";


        button.disabled = false;


    },3000);



};
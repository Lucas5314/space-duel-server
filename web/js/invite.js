const input = document.getElementById("playerName");
const button = document.getElementById("inviteBtn");
const status = document.getElementById("status");


// =========================
// BOTÓN INVITAR
// =========================

button.onclick = () => {

    const player = input.value.trim();


    // =========================
    // NOMBRE VACÍO
    // =========================

    if(player === ""){

        status.innerHTML =
            "⚠️ Escribe un nombre primero";

        return;

    }


    // =========================
    // ESTADO INVITANDO
    // =========================

    button.innerHTML = `
        <img
            src="assets/invite/boton-invitando.png"
            alt="Invitando..."
        >
    `;

    button.disabled = true;


    status.innerHTML =
        "🚀 Invitación enviada a " + player;


    // =========================
    // VOLVER A INVITAR
    // =========================

    setTimeout(() => {

        button.innerHTML = `
            <img
                src="assets/invite/boton-invitar-nuevo.png"
                alt="Invitar de nuevo"
            >
        `;

        button.disabled = false;

    }, 3000);

};
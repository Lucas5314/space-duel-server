// ======================================================
// ENVIAR DENUNCIA
// ======================================================

async function enviarDenuncia(
    reportedPlayerId,
    reason,
    description,
    matchId
) {

    const response = await fetch("/api/reports", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            reportedPlayerId,
            reason,
            description,
            matchId

        })

    });


    const data = await response.json();

    console.log(data);
}
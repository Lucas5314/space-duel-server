const nameInput = document.getElementById("name");
const countrySelect = document.getElementById("country");
const continueBtn = document.getElementById("continueBtn");
const nameError = document.getElementById("nameError");


// =========================
// MENSAJE DE ERROR
// =========================

function showError(message){

    nameError.textContent = message;

    nameError.classList.add("show");

}


function hideError(){

    nameError.textContent = "";

    nameError.classList.remove("show");

}


// Quitar error al escribir

nameInput.addEventListener("input", () => {

    hideError();

});


// =========================
// SI YA EXISTE EL JUGADOR
// =========================

if(localStorage.getItem("playerCreated") === "true"){

    location.href = "profile.html";

}


// =========================
// CREAR JUGADOR
// =========================

continueBtn.onclick = async () => {

    const name = nameInput.value.trim();


    // Limpiar error anterior

    hideError();


    // =========================
    // VALIDAR NOMBRE
    // =========================

    if(name.length < 3){

        showError(
            "El nombre debe tener al menos 3 caracteres."
        );

        nameInput.focus();

        return;

    }


    const country = countrySelect.value;


    // Evitar varios clics mientras carga

    continueBtn.disabled = true;


    try{

        // =========================
        // ENVIAR AL SERVIDOR
        // =========================

        const response = await fetch(
            "https://space-duel-server.onrender.com/create-player",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    username:name,

                    country:country

                })

            }
        );


        const data = await response.json();


        console.log(data);


        // =========================
        // JUGADOR CREADO
        // =========================

        if(data.success){

            localStorage.setItem(
                "player",
                JSON.stringify(data.player)
            );


            localStorage.setItem(
                "playerCreated",
                "true"
            );


            location.href = "profile.html";


        }else{

            // =========================
            // ERROR DEL SERVIDOR
            // =========================

            showError(
                data.error || "No se pudo crear el jugador."
            );

        }


    }catch(error){

        console.log(error);


        showError(
            "No se pudo conectar con el servidor."
        );

    }


    // Volver a activar botón

    continueBtn.disabled = false;

};


// =========================
// ENTER
// =========================

nameInput.addEventListener("keydown", e => {

    if(e.key === "Enter"){

        continueBtn.click();

    }

});